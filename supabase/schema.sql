-- DofusCodex — schéma du compte cloud (à exécuter UNE fois dans Supabase).
--
-- Où : dashboard Supabase → onglet « SQL Editor » → coller ce fichier → « Run ».
--
-- Une seule table : la progression de chaque utilisateur, dans une colonne jsonb. L'isolation
-- est assurée par Row Level Security (RLS) : chacun ne peut lire/écrire QUE sa propre ligne.

create table if not exists public.user_state (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  state      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_state enable row level security;

-- Politiques RLS : un utilisateur n'accède qu'à sa ligne (auth.uid() = user_id).
drop policy if exists "user_state select own" on public.user_state;
create policy "user_state select own"
  on public.user_state for select
  using (auth.uid() = user_id);

drop policy if exists "user_state insert own" on public.user_state;
create policy "user_state insert own"
  on public.user_state for insert
  with check (auth.uid() = user_id);

drop policy if exists "user_state update own" on public.user_state;
create policy "user_state update own"
  on public.user_state for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- (Optionnel) autoriser la suppression de sa propre ligne.
drop policy if exists "user_state delete own" on public.user_state;
create policy "user_state delete own"
  on public.user_state for delete
  using (auth.uid() = user_id);
