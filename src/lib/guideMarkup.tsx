import { Fragment, ReactNode, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DofusIcon from "../components/DofusIcon";
import { ExternalLink, MapPin, Check } from "../components/DofusIcons";
import { resolveQuestDungeon } from "../api/dofusdb";
import { useStore, actions } from "../store/store";

// Les guides Ganymède stockent un markup hybride : balises « rich text » à la Unity
// (<color=#hex>, <align>, <link="url">) mêlées à du HTML (<span style>, <p>, <div>)
// et à des balises maison référençant des entités du jeu (<item>, <monster>,
// <dungeon>, <quest>, <guide>) via leur id DofusDB. On les rend en React, en
// transformant les entités cliquables en liens vers les pages de l'app.

interface Ctx {
  guideId: number;
  stepIndex: number;
  cb: { n: number }; // compteur de cases à cocher dans l'étape
  onItem?: (id: number) => void;
  onMonster?: (id: number) => void;
}

// Pré-traitement : on convertit les balises Unity en équivalents parsables en HTML.
function toHtml(text: string): string {
  return text
    .replace(/<color=#?([0-9a-fA-F]{3,8})>/g, '<span data-gcolor="#$1">')
    .replace(/<\/color>/g, "</span>")
    .replace(/<align="?([a-zA-Z]+)"?>/g, '<span data-galign="$1">')
    .replace(/<\/align>/g, "</span>")
    .replace(/<link="([^"]*)">/g, '<a data-gext="$1">')
    .replace(/<\/link>/g, "</a>");
}

function attr(el: Element, name: string): string | undefined {
  return el.getAttribute(name) ?? undefined;
}

function styleOf(el: HTMLElement): React.CSSProperties {
  const s: React.CSSProperties = {};
  const color = el.getAttribute("data-gcolor") || el.style.color;
  if (color) s.color = color;
  const align = el.getAttribute("data-galign") || el.style.textAlign;
  if (align) {
    s.textAlign = align as React.CSSProperties["textAlign"];
    s.display = "block";
  }
  if (el.style.fontWeight) s.fontWeight = el.style.fontWeight as React.CSSProperties["fontWeight"];
  if (el.style.fontStyle) s.fontStyle = el.style.fontStyle;
  return s;
}

const CHIP =
  "mx-0.5 inline-flex items-center gap-1 rounded-md border px-1.5 py-px align-middle text-[0.92em] font-medium leading-tight";

// ganymede-dofus.com (ancien domaine, avant migration vers ganymede-app.com) est mort :
// ses icônes génériques (quêtes, donjons) renvoient une erreur réseau. On les ignore
// et on retombe sur l'icône Dofus. Les icônes api.dofusdb.fr (items, monstres) restent.
function isUsableImg(url?: string): url is string {
  return !!url && !url.includes("ganymede-dofus.com");
}

function EntityIcon({ url, fallback }: { url?: string; fallback: ReactNode }) {
  const [broken, setBroken] = useState(false);
  if (isUsableImg(url) && !broken)
    return (
      <img
        src={url}
        alt=""
        className="h-4 w-4 shrink-0 object-contain"
        loading="lazy"
        onError={() => setBroken(true)}
      />
    );
  return <>{fallback}</>;
}

// Référence de quête : si c'est une quête de donjon, on remonte le donjon ciblé
// (via DofusDB) et la puce devient un lien vers notre page donjon. Sinon, puce simple.
function QuestRef({ id, image, children }: { id?: number; image?: string; children: ReactNode }) {
  const { data: dungeonId } = useQuery({
    queryKey: ["quest-dungeon", id],
    queryFn: ({ signal }) => resolveQuestDungeon(id as number, signal),
    enabled: Number.isFinite(id),
    staleTime: Infinity,
  });
  if (dungeonId)
    return (
      <Link
        to={`/donjons/${dungeonId}`}
        onClick={(e) => e.stopPropagation()}
        className="no-drag hover:brightness-125"
      >
        <span className={`${CHIP} border-glow-ember/30 bg-glow-ember/15 text-glow-ember`}>
          <DofusIcon name="dungeon" size={14} /> {children}
        </span>
      </Link>
    );
  return (
    <span className={`${CHIP} border-glow-cyan/30 bg-glow-cyan/15 text-glow-cyan`}>
      <EntityIcon url={image} fallback={<DofusIcon name="dofusQuest" size={14} />} />
      {children}
    </span>
  );
}

// Positions Dofus dans le texte (ex. « allez en [5,-19] ») → puce cliquable qui copie
// la commande d'autopilote /travel x,y (comme sur Ganymède).
const COORD_RE = /(\[\s*-?\d+\s*,\s*-?\d+\s*\])/g;

function renderText(text: string, key: string): ReactNode {
  if (!text.includes("[")) return text;
  const parts = text.split(COORD_RE);
  if (parts.length === 1) return text;
  return parts.map((p, i) => {
    const m = p.match(/^\[\s*(-?\d+)\s*,\s*(-?\d+)\s*\]$/);
    if (m) return <PosChip key={`${key}.${i}`} x={Number(m[1])} y={Number(m[2])} />;
    return <Fragment key={`${key}.${i}`}>{p}</Fragment>;
  });
}

function renderNode(node: ChildNode, key: string, ctx: Ctx): ReactNode {
  if (node.nodeType === Node.TEXT_NODE) return renderText(node.textContent || "", key);
  if (node.nodeType !== Node.ELEMENT_NODE) return null;
  const el = node as HTMLElement;
  const tag = el.tagName.toLowerCase();
  const kids = Array.from(el.childNodes).map((c, i) => renderNode(c, `${key}.${i}`, ctx));

  switch (tag) {
    case "br":
      return <br key={key} />;
    case "b":
    case "strong":
      return <strong key={key} className="font-bold text-white">{kids}</strong>;
    case "i":
    case "em":
      return <em key={key}>{kids}</em>;
    case "p":
      return <p key={key} style={styleOf(el)} className="my-1">{kids}</p>;
    case "span":
      return <span key={key} style={styleOf(el)}>{kids}</span>;
    case "div": {
      if (el.getAttribute("data-type") === "quest-block") {
        const title = attr(el, "title");
        const status = attr(el, "status");
        const statusLabel = status === "start" ? "Début" : status === "end" ? "Fin" : null;
        return (
          <div key={key} className="my-2 rounded-xl border border-glow-gold/25 bg-glow-gold/[0.06] p-3">
            {title && (
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <DofusIcon name="dofusQuest" size={16} />
                <span className="font-semibold text-glow-gold">{title}</span>
                {statusLabel && (
                  <span className="rounded-full bg-glow-gold/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-glow-gold">
                    {statusLabel} de quête
                  </span>
                )}
              </div>
            )}
            <div className="text-sm">{kids}</div>
          </div>
        );
      }
      return <div key={key} style={styleOf(el)}>{kids}</div>;
    }
    case "a": {
      const href = attr(el, "data-gext") || attr(el, "href");
      return (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="no-drag inline items-center gap-0.5 break-words font-medium text-glow-cyan underline decoration-glow-cyan/40 underline-offset-2 hover:text-glow-violet"
        >
          {kids}
          <ExternalLink className="mb-0.5 ml-0.5 inline h-3 w-3" />
        </a>
      );
    }
    case "checkbox": {
      const ck = `${ctx.guideId}:${ctx.stepIndex}:${ctx.cb.n++}`;
      return (
        <GuideCheckbox key={key} ckey={ck}>
          {kids}
        </GuideCheckbox>
      );
    }
    case "item": {
      const id = Number(attr(el, "dofusdb"));
      const img = attr(el, "imageurl");
      const chip = (
        <span className={`${CHIP} border-glow-purple/30 bg-glow-purple/15 text-glow-violet`}>
          <EntityIcon url={img} fallback={<DofusIcon name="chestGrey" size={14} />} />
          {kids}
        </span>
      );
      if (ctx.onItem && Number.isFinite(id))
        return (
          <button
            key={key}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              ctx.onItem!(id);
            }}
            className="no-drag hover:brightness-125"
          >
            {chip}
          </button>
        );
      return <Fragment key={key}>{chip}</Fragment>;
    }
    case "dungeon": {
      const id = Number(attr(el, "dofusdb"));
      const img = attr(el, "imageurl");
      const chip = (
        <span className={`${CHIP} border-glow-ember/30 bg-glow-ember/15 text-glow-ember`}>
          <EntityIcon url={img} fallback={<DofusIcon name="dungeon" size={14} />} />
          {kids}
        </span>
      );
      if (Number.isFinite(id))
        return (
          <Link
            key={key}
            to={`/donjons/${id}`}
            onClick={(e) => e.stopPropagation()}
            className="no-drag hover:brightness-125"
          >
            {chip}
          </Link>
        );
      return <Fragment key={key}>{chip}</Fragment>;
    }
    case "monster": {
      const mid = Number(attr(el, "dofusdb"));
      const img = attr(el, "imageurl");
      const chip = (
        <span className={`${CHIP} border-glow-rose/30 bg-glow-rose/15 text-glow-rose`}>
          <EntityIcon url={img} fallback={<DofusIcon name="monsterGrey" size={14} />} />
          {kids}
        </span>
      );
      if (ctx.onMonster && Number.isFinite(mid))
        return (
          <button
            key={key}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              ctx.onMonster!(mid);
            }}
            className="no-drag hover:brightness-125"
          >
            {chip}
          </button>
        );
      return <Fragment key={key}>{chip}</Fragment>;
    }
    case "quest": {
      const qid = Number(attr(el, "dofusdb"));
      const img = attr(el, "imageurl");
      return (
        <QuestRef key={key} id={Number.isFinite(qid) ? qid : undefined} image={img}>
          {kids}
        </QuestRef>
      );
    }
    case "guide": {
      const gid = Number(attr(el, "guide") || attr(el, "id"));
      const step = Number(attr(el, "step"));
      if (!Number.isFinite(gid)) return <Fragment key={key}>{kids}</Fragment>;
      return (
        <GuideLink key={key} guideId={gid} step={Number.isFinite(step) ? step - 1 : 0}>
          {kids}
        </GuideLink>
      );
    }
    case "image":
    case "img": {
      const src = attr(el, "url") || attr(el, "src");
      if (!src) return null;
      return (
        <img
          key={key}
          src={src}
          alt={attr(el, "alt") || ""}
          loading="lazy"
          className="my-2 max-h-80 max-w-full rounded-lg border border-white/10"
        />
      );
    }
    default:
      return <Fragment key={key}>{kids}</Fragment>;
  }
}

// Lien interne vers un autre guide. On ne touche au store que si le step cible
// est SUPÉRIEUR à la progression actuelle — la progression n'est jamais reculée.
function GuideLink({ guideId, step, children }: { guideId: number; step: number; children: ReactNode }) {
  const navigate = useNavigate();
  const savedStep = useStore((s) => s.guideStep[guideId] ?? 0);
  return (
    <a
      href={`#/guides/${guideId}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (step > savedStep) actions.setGuideStep(guideId, step);
        navigate(`/guides/${guideId}`);
      }}
      className="no-drag cursor-pointer font-medium text-glow-violet underline decoration-glow-violet/40 underline-offset-2 hover:text-glow-cyan"
    >
      {children}
    </a>
  );
}

// Puce de position : copie « /travel x,y » dans le presse-papier.
function PosChip({ x, y }: { x: number; y: number }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        navigator.clipboard?.writeText(`/travel ${x},${y}`).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        });
      }}
      title="Copier la commande /travel"
      className="no-drag mx-0.5 inline-flex items-center gap-1 rounded-md border border-glow-cyan/40 bg-glow-cyan/10 px-1.5 py-px align-middle text-[0.92em] font-semibold leading-tight text-glow-cyan transition hover:bg-glow-cyan/25"
    >
      {copied ? <Check className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
      [{x},{y}]
    </button>
  );
}

// Case à cocher : tout le rang est cliquable pour cocher. Les entités (item/mob/
// donjon…) à l'intérieur appellent stopPropagation → un clic sur leur nom ouvre la
// popup sans cocher, et un clic ailleurs sur la ligne coche sans ouvrir la popup.
function GuideCheckbox({ ckey, children }: { ckey: string; children: ReactNode }) {
  const checked = useStore((s) => !!s.guideChecks[ckey]);
  return (
    <div
      onClick={() => actions.toggleGuideCheck(ckey)}
      className="no-drag group my-0.5 flex cursor-pointer items-start gap-2 rounded-md px-1 py-0.5 transition hover:bg-white/[0.04]"
    >
      <span
        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] transition ${
          checked
            ? "border-glow-emerald/50 bg-glow-emerald/20 text-glow-emerald"
            : "border-white/20 text-transparent group-hover:border-glow-emerald/60"
        }`}
      >
        ✓
      </span>
      <span className={checked ? "text-slate-500 line-through" : ""}>{children}</span>
    </div>
  );
}

export function GuideText({
  text,
  guideId,
  stepIndex,
  onItem,
  onMonster,
}: {
  text: string;
  guideId: number;
  stepIndex: number;
  onItem?: (id: number) => void;
  onMonster?: (id: number) => void;
}) {
  const nodes = useMemo(() => {
    const html = toHtml(text || "");
    const doc = new DOMParser().parseFromString(`<body>${html}</body>`, "text/html");
    const ctx: Ctx = { guideId, stepIndex, cb: { n: 0 }, onItem, onMonster };
    return Array.from(doc.body.childNodes).map((c, i) => renderNode(c, `n${i}`, ctx));
  }, [text, guideId, stepIndex, onItem, onMonster]);

  return <div className="leading-relaxed text-slate-300">{nodes}</div>;
}

// Retire tout le markup pour un aperçu texte (cartes de la liste).
export function stripGuideMarkup(text: string): string {
  return (text || "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
