// Client Supabase (compte cloud + synchro de la progression).
//
// La config vient des variables d'env Vite (inlinées au build) :
//   VITE_SUPABASE_URL       = https://<projet>.supabase.co
//   VITE_SUPABASE_ANON_KEY  = clé « anon » (publique, protégée par RLS côté serveur)
//
// Si elles sont absentes, `supabase` vaut null et toute la fonctionnalité « compte » se
// désactive proprement — l'app reste 100 % fonctionnelle en local (local-first).
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = import.meta.env.VITE_SUPABASE_URL?.trim();
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = !!(URL && ANON);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(URL as string, ANON as string, {
      auth: {
        persistSession: true, // garde la session entre deux lancements (localStorage)
        autoRefreshToken: true,
        // Pas de redirection OAuth dans Electron → on reste sur email/mot de passe.
        detectSessionInUrl: false,
      },
    })
  : null;
