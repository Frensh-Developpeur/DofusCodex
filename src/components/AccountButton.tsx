import { useState } from "react";
import clsx from "clsx";
import DofusIcon from "./DofusIcon";
import { LogIn } from "./DofusIcons";
import { useAccount } from "../lib/cloudSync";
import AuthModal from "./AuthModal";

// Bouton « Compte » de la sidebar (au-dessus de Paramètres).
//  • déconnecté → « Se connecter » (ouvre la modale connexion/inscription)
//  • connecté   → e-mail + pastille de statut (ouvre la modale : synchro + déconnexion)
// Masqué si Supabase n'est pas configuré.
export default function AccountButton({ collapsed }: { collapsed: boolean }) {
  const account = useAccount();
  const [open, setOpen] = useState(false);
  if (account.status === "disabled") return null;

  const signedIn = account.status === "signedIn";
  const label = signedIn ? account.pseudo || account.email || "Mon compte" : "Se connecter";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title={collapsed ? label : undefined}
        className={clsx(
          "no-drag group relative flex w-full items-center rounded-xl text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200",
          collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5",
        )}
      >
        <span className="relative shrink-0">
          {signedIn ? (
            <DofusIcon name="character" size={18} className="opacity-90" />
          ) : (
            <LogIn className="h-[18px] w-[18px] opacity-80 group-hover:opacity-100" />
          )}
          {/* Pastille d'état quand connecté (vert = ok, cyan = synchro en cours, rouge = erreur). */}
          {signedIn && (
            <span
              className={clsx(
                "absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full ring-2 ring-void-900",
                account.syncing ? "bg-glow-cyan" : account.error ? "bg-glow-rose" : "bg-glow-emerald",
              )}
            />
          )}
        </span>
        {!collapsed && <span className="relative truncate">{label}</span>}
      </button>

      {open && <AuthModal onClose={() => setOpen(false)} />}
    </>
  );
}
