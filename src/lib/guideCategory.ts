import { dofusUiIcon, type DofusUiIcon } from "../components/DofusIcons";

// Catégorise un guide Ganymède d'après son nom (heuristique) pour l'habillage visuel.
export interface GuideCategory {
  label: string;
  Icon: DofusUiIcon;
  tile: string; // dégradé du pavé d'icône / halo
  text: string; // couleur d'accent
}

const PrincipalIcon = dofusUiIcon("questGroup");
const DungeonIcon = dofusUiIcon("dungeon");
const TrophyIcon = dofusUiIcon("trophy");
const FrigostIcon = dofusUiIcon("eau");
const QuestIcon = dofusUiIcon("dofusQuest");
const GuideIcon = dofusUiIcon("questGroup");

export function categoryOf(name: string): GuideCategory {
  const n = name.toLowerCase();
  if (/^\s*\[?gp|guide principal/.test(n))
    return { label: "Principal", Icon: PrincipalIcon, tile: "from-glow-gold/30 to-glow-ember/10", text: "text-glow-gold" };
  if (/donjon|boss/.test(n))
    return { label: "Donjon", Icon: DungeonIcon, tile: "from-glow-ember/30 to-glow-rose/10", text: "text-glow-ember" };
  if (/succ[eè]s/.test(n))
    return { label: "Succès", Icon: TrophyIcon, tile: "from-glow-purple/30 to-glow-violet/10", text: "text-glow-violet" };
  if (/frigost|banquise|givre|grasou/.test(n))
    return { label: "Frigost", Icon: FrigostIcon, tile: "from-glow-cyan/30 to-sky-500/10", text: "text-glow-cyan" };
  if (/qu[eê]te/.test(n))
    return { label: "Quête", Icon: QuestIcon, tile: "from-glow-cyan/30 to-glow-emerald/10", text: "text-glow-cyan" };
  return { label: "Guide", Icon: GuideIcon, tile: "from-glow-purple/25 to-glow-cyan/10", text: "text-glow-violet" };
}
