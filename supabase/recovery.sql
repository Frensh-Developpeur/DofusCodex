-- ───────────────────────────────────────────────────────────────────────────
-- Récupération de compte par QUESTION SECRÈTE (sans e-mail / sans SMTP).
--
-- À coller UNE FOIS dans Supabase → SQL Editor → Run.
--
-- Principe : un utilisateur déconnecté ne peut pas changer son mot de passe via
-- l'API client (il faudrait une session). On passe donc par des fonctions
-- SECURITY DEFINER (exécutées avec les droits du propriétaire) qui :
--   1) enregistrent la question + un HASH bcrypt de la réponse,
--   2) renvoient la question associée à un e-mail,
--   3) si la réponse est correcte, réécrivent le mot de passe dans auth.users.
-- La table n'est jamais lue/écrite directement (aucune policy) : tout passe par
-- ces fonctions, qui appliquent leurs propres contrôles.
-- ───────────────────────────────────────────────────────────────────────────

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.account_recovery (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  question    text not null,
  answer_hash text not null,
  updated_at  timestamptz not null default now()
);

alter table public.account_recovery enable row level security;
-- Aucune policy → accès direct refusé à tout le monde ; seules les fonctions ci-dessous
-- (SECURITY DEFINER) y touchent.

-- 1) Définir / mettre à jour sa question secrète (utilisateur CONNECTÉ).
create or replace function public.set_security_question(p_question text, p_answer text)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  if length(coalesce(trim(p_question), '')) < 3 or length(coalesce(trim(p_answer), '')) < 1 then
    raise exception 'invalid question or answer';
  end if;
  insert into public.account_recovery (user_id, question, answer_hash, updated_at)
  values (auth.uid(), trim(p_question), crypt(lower(trim(p_answer)), gen_salt('bf', 10)), now())
  on conflict (user_id) do update
    set question = excluded.question,
        answer_hash = excluded.answer_hash,
        updated_at = now();
end;
$$;

-- 2) Récupérer la question secrète liée à un e-mail (appelable par anon, pour l'écran reset).
create or replace function public.get_security_question(p_email text)
returns text
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_user_id uuid;
  v_question text;
begin
  select id into v_user_id from auth.users where lower(email) = lower(trim(p_email)) limit 1;
  if v_user_id is null then
    return null;
  end if;
  select question into v_question from public.account_recovery where user_id = v_user_id;
  return v_question; -- null si l'utilisateur n'a pas (encore) défini de question
end;
$$;

-- 3) Réinitialiser le mot de passe si la réponse est correcte (appelable par anon).
--    Renvoie true si le mot de passe a été changé, false sinon (réponse fausse / pas de question).
create or replace function public.reset_password_with_answer(
  p_email text,
  p_answer text,
  p_new_password text
)
returns boolean
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  v_user_id uuid;
  v_hash text;
begin
  if length(coalesce(p_new_password, '')) < 6 then
    raise exception 'password too short';
  end if;
  select id into v_user_id from auth.users where lower(email) = lower(trim(p_email)) limit 1;
  if v_user_id is null then
    return false;
  end if;
  select answer_hash into v_hash from public.account_recovery where user_id = v_user_id;
  if v_hash is null then
    return false; -- aucune question définie pour ce compte
  end if;
  if v_hash <> crypt(lower(trim(p_answer)), v_hash) then
    return false; -- mauvaise réponse
  end if;
  update auth.users
    set encrypted_password = crypt(p_new_password, gen_salt('bf', 10)),
        updated_at = now()
    where id = v_user_id;
  return true;
end;
$$;

-- Droits d'exécution
grant execute on function public.set_security_question(text, text)            to authenticated;
grant execute on function public.get_security_question(text)                  to anon, authenticated;
grant execute on function public.reset_password_with_answer(text, text, text) to anon, authenticated;
