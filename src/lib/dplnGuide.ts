// Récupère un guide DofusPourLesNoobs (page Weebly) en direct et en extrait le contenu
// d'article, restylé pour l'app (rendu via dangerouslySetInnerHTML + classe .dpln-article).
// dofuspourlesnoobs.com n'envoie pas de CORS → fetch via le pont IPC du process principal.

const DPLN_ORIGIN = "https://www.dofuspourlesnoobs.com";

// Slug de page (sans .html) à partir d'une URL DPLN complète.
export function dplnSlug(url: string): string | null {
  return url.match(/dofuspourlesnoobs\.com\/([a-z0-9-]+)\.html/i)?.[1] ?? null;
}

function absolutize(value: string | null): string | undefined {
  const v = value?.trim();
  if (!v) return undefined;
  if (/^https?:\/\//i.test(v)) return v;
  if (v.startsWith("//")) return `https:${v}`;
  if (v.startsWith("/")) return `${DPLN_ORIGIN}${v}`;
  return `${DPLN_ORIGIN}/${v}`;
}

// Extrait et assainit le corps d'article (#wsite-content) d'une page DPLN.
function extractArticle(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const root = doc.querySelector("#wsite-content");
  if (!root) return "";

  // Pubs Weebly / scripts / styles / formulaires / blocs sociaux → dégagés.
  root
    .querySelectorAll(
      "script, style, noscript, iframe, form, .wcustomhtml, .wsite-ad, [class*='adunit'], [id*='akcelo'], .blog-social, .wsite-social, .w-share-buttons, .wsite-com-field",
    )
    .forEach((el) => el.remove());

  // Aucune redirection vers un site externe : on « déballe » les liens (on garde leur contenu —
  // texte/image — mais on retire l'ancre). Les liens DPLN pointent vers d'autres pages DPLN, non
  // mappables de façon fiable vers les routes de l'app → on ne redirige nulle part hors de l'app.
  root.querySelectorAll("a").forEach((a) => {
    a.replaceWith(...Array.from(a.childNodes));
  });

  // Images : src absolu (lazy Weebly → data-src), sans referrer, chargement paresseux.
  root.querySelectorAll("img").forEach((img) => {
    const src = absolutize(
      img.getAttribute("src") || img.getAttribute("data-src") || img.getAttribute("data-image-src"),
    );
    if (!src || /\.gif($|\?)/i.test(src)) {
      img.remove(); // pixels de tracking / spacers
      return;
    }
    img.setAttribute("src", src);
    img.setAttribute("loading", "lazy");
    img.setAttribute("referrerpolicy", "no-referrer");
    img.removeAttribute("srcset");
    img.removeAttribute("style");
  });

  // Attributs d'événements + styles inline (mise en page Weebly cassée chez nous).
  root.querySelectorAll("*").forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      if (attr.name.toLowerCase().startsWith("on")) el.removeAttribute(attr.name);
    }
    if (el.tagName !== "IMG") el.removeAttribute("style");
  });

  return root.innerHTML.trim();
}

// Charge le guide d'une page DPLN (par slug) et renvoie l'HTML d'article restylable.
export async function getDplnGuide(slug: string, _signal?: AbortSignal): Promise<string> {
  if (!window.dofusCodex?.fetchDplnGuide) {
    throw new Error("Le guide n'est consultable que dans l'application desktop.");
  }
  const res = await window.dofusCodex.fetchDplnGuide(slug);
  if (!res?.ok || !res.text) throw new Error("Guide indisponible pour le moment.");
  const html = extractArticle(res.text);
  if (!html) throw new Error("Contenu du guide introuvable.");
  return html;
}
