// Actualités officielles Dofus, récupérées dynamiquement depuis les flux RSS de dofus.com
// (news / changelog / devblog). dofus.com est derrière CloudFront (bloque les UA non-navigateur
// et n'envoie pas de CORS) → on passe par le pont IPC du process principal (window.dofusCodex.
// fetchDofusNews), qui fetch avec un UA navigateur. Le parsing/affichage se fait ici (rien de
// statique : la liste suit le flux en temps réel).

export type NewsCategory = "news" | "changelog" | "devblog";

export interface NewsItem {
  id: string;
  category: NewsCategory;
  categoryLabel: string;
  title: string;
  link: string; // URL de l'article sur dofus.com
  date: number; // timestamp ms (0 si absent)
  image?: string; // 1re image trouvée dans le contenu
  excerpt: string; // texte brut (sans HTML) pour l'aperçu
  html: string; // contenu HTML complet (assaini) pour la lecture in-app
}

export const NEWS_FEEDS: { category: NewsCategory; label: string }[] = [
  { category: "news", label: "Actualités" },
  { category: "changelog", label: "Changelog" },
  { category: "devblog", label: "Devblog" },
];

const LABELS: Record<NewsCategory, string> = {
  news: "Actualités",
  changelog: "Changelog",
  devblog: "Devblog",
};

const NEWS_IMAGE_PROTOCOL = "dofuscodex-news-image";

function toNewsImageSrc(url: string | undefined): string | undefined {
  if (!url) return undefined;
  const encoded = btoa(url).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return `${NEWS_IMAGE_PROTOCOL}://image/${encoded}`;
}

function normalizeUrl(raw: string | null | undefined, base = "https://www.dofus.com"): string | undefined {
  const value = raw?.trim();
  if (!value) return undefined;
  if (value.startsWith("//")) return `https:${value}`;
  try {
    const url = new URL(value, base);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    url.protocol = "https:";
    return url.toString();
  } catch {
    return undefined;
  }
}

function firstSrcsetUrl(srcset: string | null | undefined): string | undefined {
  return srcset
    ?.split(",")
    .map((part) => part.trim().split(/\s+/)[0])
    .find(Boolean);
}

function findImage(doc: Document): string | undefined {
  const img = doc.querySelector("img");
  const fromImg = normalizeUrl(
    img?.getAttribute("src") ||
      img?.getAttribute("data-src") ||
      img?.getAttribute("data-original") ||
      firstSrcsetUrl(img?.getAttribute("srcset")),
  );
  if (fromImg) return toNewsImageSrc(fromImg);

  const media = doc.querySelector(
    "meta[property='og:image'], meta[name='twitter:image'], enclosure[url], media\\:content[url], media\\:thumbnail[url]",
  );
  return toNewsImageSrc(normalizeUrl(media?.getAttribute("content") || media?.getAttribute("url")));
}

// Retire les éléments dangereux/inutiles et les attributs d'événements d'un fragment HTML
// (contenu de confiance — dofus.com — mais on reste prudent avant un dangerouslySetInnerHTML).
function sanitizeHtml(raw: string): string {
  const doc = new DOMParser().parseFromString(raw, "text/html");
  doc.querySelectorAll("script, style, iframe, object, embed, link, meta, noscript").forEach((el) => el.remove());
  doc.querySelectorAll("*").forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase();
      if (name.startsWith("on")) el.removeAttribute(attr.name);
      if ((name === "href" || name === "src") && /^\s*javascript:/i.test(attr.value)) el.removeAttribute(attr.name);
    }
  });
  // Les liens internes ouvrent dans le navigateur (gérés par le main process).
  doc.querySelectorAll("a[href]").forEach((a) => {
    const href = normalizeUrl(a.getAttribute("href"));
    if (href) a.setAttribute("href", href);
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noreferrer");
  });
  doc.querySelectorAll("img").forEach((img) => {
    const src = normalizeUrl(
      img.getAttribute("src") ||
        img.getAttribute("data-src") ||
        img.getAttribute("data-original") ||
        firstSrcsetUrl(img.getAttribute("srcset")),
    );
    const proxied = toNewsImageSrc(src);
    if (proxied) img.setAttribute("src", proxied);
    img.setAttribute("loading", "lazy");
    img.setAttribute("referrerpolicy", "no-referrer");
  });
  return doc.body.innerHTML;
}

function parseFeed(xml: string, category: NewsCategory): NewsItem[] {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  if (doc.querySelector("parsererror")) return [];
  const text = (el: Element, tag: string) => el.querySelector(tag)?.textContent?.trim() ?? "";
  return Array.from(doc.querySelectorAll("item")).map((it, i) => {
    const desc = it.querySelector("description")?.textContent ?? "";
    const link = text(it, "link");
    const descDoc = new DOMParser().parseFromString(desc, "text/html");
    const image =
      findImage(descDoc) ||
      toNewsImageSrc(normalizeUrl(it.querySelector("enclosure[url], media\\:content[url], media\\:thumbnail[url]")?.getAttribute("url")));
    const excerpt = (descDoc.body.textContent || "").replace(/\s+/g, " ").trim();
    const pub = text(it, "pubDate");
    return {
      id: text(it, "guid") || link || `${category}-${i}`,
      category,
      categoryLabel: LABELS[category],
      title: text(it, "title"),
      link,
      date: pub ? Date.parse(pub) || 0 : 0,
      image,
      excerpt: excerpt.slice(0, 260),
      html: sanitizeHtml(desc),
    };
  });
}

async function fetchFeed(category: NewsCategory): Promise<NewsItem[]> {
  const res = await window.dofusCodex?.fetchDofusNews?.(category);
  if (!res?.ok || !res.text) return [];
  return parseFeed(res.text, category);
}

// Récupère et fusionne les 3 flux, triés du plus récent au plus ancien. Dédoublonne par id
// (un même article peut apparaître dans plusieurs flux). Lève si le pont IPC est absent (web).
export async function getDofusNews(): Promise<NewsItem[]> {
  if (!window.dofusCodex?.fetchDofusNews) {
    throw new Error("Les actualités ne sont disponibles que dans l'application desktop.");
  }
  const lists = await Promise.all(NEWS_FEEDS.map((f) => fetchFeed(f.category)));
  const seen = new Set<string>();
  const merged: NewsItem[] = [];
  for (const item of lists.flat()) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    merged.push(item);
  }
  return merged.sort((a, b) => b.date - a.date);
}
