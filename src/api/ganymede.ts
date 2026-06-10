// Ganymède API (https://ganymede-app.com) — guides communautaires Dofus.
// On ne télécharge rien en local : la liste est requêtée une fois (cache long via
// TanStack Query) et le détail de chaque guide est chargé à la demande, à l'ouverture.
import { getJson } from "./client";

const BASE = "https://ganymede-app.com/api";

export type GuideStatus = "gp" | "certified" | "public" | "draft";

export interface GuideAuthor {
  id: number;
  name: string;
  is_admin?: number;
  is_certified?: number;
}

export interface GuideLight {
  id: number;
  name: string;
  status: GuideStatus;
  lang: string;
  game_type: string;
  description?: string;
  web_description?: string;
  likes: number;
  dislikes: number;
  downloads?: number;
  order?: number;
  updated_at?: string;
  user?: GuideAuthor;
}

export interface GuideStep {
  name?: string | null;
  map?: string | null;
  pos_x: number;
  pos_y: number;
  text: string;
}

export interface GuideDetail extends GuideLight {
  steps: GuideStep[];
}

// Toute la liste arrive d'un coup (≈ 700 guides, toutes langues). On garde l'objet
// brut ; le filtrage (langue, statut, recherche) se fait côté page.
export function listGuides(signal?: AbortSignal) {
  return getJson<GuideLight[]>(`${BASE}/guides`, signal);
}

export function getGuide(id: number, signal?: AbortSignal) {
  return getJson<GuideDetail>(`${BASE}/guides/${id}`, signal);
}

// Première image (vignette) d'un guide : les images sont embarquées dans le markup des
// étapes sous forme <image url="…"> (ou <img src="…">). On renvoie la première URL https
// rencontrée. `\b(?:url|src)` évite de capturer le `imageurl=` des entités item/monstre.
const GUIDE_IMG_RE = /<im(?:g|age)\b[^>]*?\b(?:url|src)\s*=\s*["']([^"']+)["']/i;
export function firstGuideImage(steps?: GuideStep[]): string | undefined {
  for (const s of steps ?? []) {
    const m = (s.text || "").match(GUIDE_IMG_RE);
    if (m && /^https?:\/\//i.test(m[1])) return m[1];
  }
  return undefined;
}

// Libellés FR des statuts Ganymède.
export const STATUS_LABEL: Record<GuideStatus, string> = {
  gp: "Officiel",
  certified: "Certifié",
  public: "Communauté",
  draft: "Brouillon",
};
