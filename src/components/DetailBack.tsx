import { useLocation, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getEquipment } from "../api/dofusdude";
import { ArrowLeft } from "./DofusIcons";

// Sections auxquelles peut appartenir une page de détail (préfixe d'URL → liste + libellé).
// /objets/:id est traité à part : selon le type (équipement → Équipements, sinon Objets).
const SECTIONS: { prefix: string; to: string; label: string }[] = [
  { prefix: "/panoplies/", to: "/panoplies", label: "Panoplies" },
  { prefix: "/classes/", to: "/classes", label: "Classes" },
  { prefix: "/havre-sac/", to: "/havre-sac", label: "Havre-Sacs" },
  { prefix: "/monstres/", to: "/monstres", label: "Monstres" },
  { prefix: "/donjons/", to: "/donjons", label: "Donjons" },
  { prefix: "/guides/", to: "/guides", label: "Guides" },
];

const CLS =
  "no-drag mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition hover:text-white";

// Bouton de retour, logique uniforme sur toutes les pages :
//  • arrivé depuis la LISTE de la section (ou via la sidebar) → état `fromSection` → bouton
//    « {Section} » qui ramène à cette liste ;
//  • arrivé d'ailleurs (guide, butin, recette, pièce de panoplie…) → « Retour » (historique).
export default function DetailBack() {
  const location = useLocation();
  const navigate = useNavigate();
  const navState = location.state as { fromSection?: boolean; returnTo?: string; returnLabel?: string } | null;
  const fromSection = navState?.fromSection;
  const returnTo = navState?.returnTo;
  const returnLabel = navState?.returnLabel ?? "Retour";

  // Fiche objet : la section dépend du type réel (même cache que la page : ["item-equip", id]).
  const itemMatch = location.pathname.match(/^\/objets\/(\d+)/);
  const itemId = itemMatch ? Number(itemMatch[1]) : null;
  const { data: equipItem } = useQuery({
    queryKey: ["item-equip", itemId],
    queryFn: ({ signal }) => getEquipment(itemId!, signal).catch(() => null),
    enabled: itemId != null,
  });

  const section =
    itemId != null
      ? equipItem
        ? { to: "/stuffinator", label: "Équipements" }
        : { to: "/objets", label: "Objets & Ressources" }
      : SECTIONS.find((s) => location.pathname.startsWith(s.prefix));

  if (returnTo) {
    return (
      <Link to={returnTo} className={CLS}>
        <ArrowLeft className="h-4 w-4" /> {returnLabel}
      </Link>
    );
  }

  if (fromSection && section) {
    return (
      <Link to={section.to} className={CLS}>
        <ArrowLeft className="h-4 w-4" /> {section.label}
      </Link>
    );
  }
  return (
    <button onClick={() => navigate(-1)} className={CLS}>
      <ArrowLeft className="h-4 w-4" /> Retour
    </button>
  );
}
