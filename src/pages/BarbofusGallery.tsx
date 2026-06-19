import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ExternalLink, ImageOff } from "../components/DofusIcons";
import DofusIcon from "../components/DofusIcon";
import AppLoader from "../components/AppLoader";
import { SectionHeader } from "../components/ui";
import { skinatorEngine } from "../store/skinatorEngine";

// Galerie publique des skins Barbofus embarquée dans une webview Electron.
// La recherche/les filtres/le scroll infini sont 100% Livewire (AJAX + CSRF) côté Barbofus :
// impossible à scraper proprement, et leur fail2ban bannit les requêtes répétées. On affiche
// donc leur galerie telle quelle dans une webview (comme le moteur Skinator), en masquant le
// chrome du site (navbar/footer) pour l'isoler. Le webview n'est monté qu'à la demande, pour
// ne pas taper sur leur serveur tant que l'utilisateur n'a pas ouvert la galerie.

// Galerie Unity (≠ /skins qui mêle Dofus 2 + Unity) : 63 cartes par page, toutes vers une fiche
// /unity-skin/{id} qui expose le vrai bouton « 🚀 Skinator » (skin éditable). Recherche intégrée.
const GALLERY_URL = "https://barbofus.com/unity-skins";
const VIEW_HEIGHT = 760;

type GalleryWebview = HTMLElement & {
  insertCSS: (css: string) => Promise<string>;
  executeJavaScript: <T = unknown>(code: string) => Promise<T>;
  getURL: () => string;
  canGoBack: () => boolean;
  goBack: () => void;
  setZoomFactor?: (factor: number) => void;
};

// Id d'une fiche skin Unity : barbofus.com/unity-skin/{id} (singulier). C'est le même id que
// le bouton natif « 🚀 Skinator » de Barbofus (skinator?skin={id}) → chargement éditable fiable.
function unitySkinId(raw: string | null): string | null {
  if (!raw) return null;
  return raw.match(/barbofus\.com\/unity-skin\/(\d+)/)?.[1] ?? null;
}

export default function BarbofusGallery() {
  // Page montée en permanence (cf. App.tsx, KEEP_ALIVE) pour garder le webview vivant.
  // `active` = page réellement visible : on ne pousse la largeur étendue qu'alors.
  const active = useLocation().pathname === "/galerie-skins";

  useEffect(() => {
    if (!active) return;
    document.body.dataset.skinatorWide = "true";
    return () => {
      delete document.body.dataset.skinatorWide;
    };
  }, [active]);

  return (
    <div>
      <SectionHeader
        eyebrow="Apparence"
        title="Galerie Barbofus"
        subtitle="Parcours et recherche des milliers de skins partagés par la communauté Barbofus."
      />
      <div className="skinator-wide-surface">
        <GalleryEngine active={active} />
      </div>
    </div>
  );
}

function GalleryEngine({ active }: { active: boolean }) {
  const isElectron = typeof window !== "undefined" && !!window.dofusCodex;
  const navigate = useNavigate();
  const webviewRef = useRef<GalleryWebview | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [opened, setOpened] = useState(false);
  const [ready, setReady] = useState(false);
  const [viewHeight, setViewHeight] = useState(VIEW_HEIGHT);
  const [expanded, setExpanded] = useState(false);
  // URL courante du webview (pour savoir si on est sur une fiche skin) + possibilité de revenir
  // en arrière (clic sur un skin = navigation pleine page → l'historique du webview suit).
  // Pollé car aucun event fiable côté <webview> ; getURL/canGoBack sont locaux (pas de réseau).
  const [canBack, setCanBack] = useState(false);
  const [skinId, setSkinId] = useState<string | null>(null);
  useEffect(() => {
    if (!opened) {
      setCanBack(false);
      setSkinId(null);
      return;
    }
    const read = () => {
      const wv = webviewRef.current;
      if (!wv) return;
      try {
        setCanBack(wv.canGoBack());
        setSkinId(unitySkinId(wv.getURL()));
      } catch {
        /* indispo */
      }
    };
    read();
    const iv = window.setInterval(read, 1000);
    return () => window.clearInterval(iv);
  }, [opened]);

  const goBack = () => {
    const wv = webviewRef.current;
    if (wv?.canGoBack()) wv.goBack();
  };

  // Ouvre le skin de la fiche dans NOTRE moteur Skinator (page intégrée), éditable. On utilise
  // exactement l'URL du bouton natif Barbofus (skinator?skin={id}, même id) → bon skin garanti.
  const openInSkinator = () => {
    const id = unitySkinId(webviewRef.current?.getURL() ?? null) ?? skinId;
    if (!id) return;
    skinatorEngine.requestLoadSkin(`https://barbofus.com/skinator?skin=${id}`);
    navigate("/skinator");
  };

  // Hauteur responsive (mode inline) : le webview remplit l'espace restant sous lui.
  useLayoutEffect(() => {
    if (expanded) return;
    if (!active) return; // page masquée : rect non fiable → on remesure au retour
    const measure = () => {
      const el = frameRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      const next = Math.max(420, Math.round(window.innerHeight - top - 24));
      setViewHeight((prev) => (Math.abs(prev - next) > 2 ? next : prev));
    };
    measure();
    window.addEventListener("resize", measure);
    const t1 = window.setTimeout(measure, 200);
    const t2 = window.setTimeout(measure, 600);
    return () => {
      window.removeEventListener("resize", measure);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [expanded, active]);

  // Échap ferme la modal agrandie.
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  // Le <main> est en z-10 (App.tsx) → il plafonne notre overlay fixed sous la chrome.
  // On l'élève le temps de l'agrandissement (cf. même astuce dans Skinator).
  useEffect(() => {
    if (!expanded) return;
    const main = document.querySelector("main");
    if (!main) return;
    const prev = (main as HTMLElement).style.zIndex;
    (main as HTMLElement).style.zIndex = "50";
    return () => {
      (main as HTMLElement).style.zIndex = prev;
    };
  }, [expanded]);

  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview || !opened) return;

    // Garde-fou : ne jamais laisser le loader tourner à l'infini si dom-ready ne tire pas.
    const safety = window.setTimeout(() => setReady(true), 12000);

    const onReady = async () => {
      window.clearTimeout(safety);
      syncShadowFrame(webview);
      // On masque le chrome du site AVANT de retirer le loader (sinon flash de la navbar).
      try {
        await Promise.race([applyGalleryFocus(webview), wait(2500)]);
      } catch {
        /* injection indispo : on découvre quand même */
      }
      setReady(true);
      const resettle = () => {
        syncShadowFrame(webview);
        applyGalleryFocus(webview);
      };
      window.setTimeout(resettle, 300);
      window.setTimeout(resettle, 1000);
    };
    // On ne réaffiche le loader que pour un VRAI rechargement du frame principal (pas les
    // navigations Livewire in-place ni les sous-frames).
    const onNavigate = (e: Event) => {
      const ev = e as { isMainFrame?: boolean; isInPlace?: boolean; isSameDocument?: boolean };
      if (ev.isMainFrame !== true) return;
      if (ev.isInPlace || ev.isSameDocument) return;
      setReady(false);
    };

    webview.addEventListener("dom-ready", onReady);
    webview.addEventListener("did-start-navigation", onNavigate as EventListener);
    return () => {
      window.clearTimeout(safety);
      webview.removeEventListener("dom-ready", onReady);
      webview.removeEventListener("did-start-navigation", onNavigate as EventListener);
    };
  }, [opened]);

  // Le cadre interne suit la taille réelle du webview (resize fenêtre / passage en modal).
  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview || !ready) return;
    syncShadowFrame(webview);
    applyGalleryFocus(webview);
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => syncShadowFrame(webview));
    ro.observe(webview);
    return () => ro.disconnect();
  }, [ready, expanded]);

  const header = (
    <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.035] px-4 py-2">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-glow-purple/40 to-emerald-500/30 text-emerald-200 shadow-[0_0_14px_-2px_rgba(16,185,129,0.5)]">
          <DofusIcon name="search" size={16} />
        </span>
        <h2 className="truncate font-display text-base font-bold text-white">Galerie Barbofus</h2>
        {opened && canBack && (
          <button onClick={goBack} title="Retour" className={toolButton("slate")}>
            <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Retour</span>
          </button>
        )}
      </div>
      {opened && (
        <div className="flex items-center gap-2">
          {skinId && (
            <button
              onClick={openInSkinator}
              title="Ouvrir ce skin dans le Skinator pour le modifier"
              className={toolButton("cyan")}
            >
              <DofusIcon name="character" size={16} />{" "}
              <span className="hidden sm:inline">Ouvrir dans le Skinator</span>
            </button>
          )}
          <button
            onClick={() => setExpanded((v) => !v)}
            className={toolButton(expanded ? "slate" : "purple")}
          >
            {expanded ? (
              <>
                <DofusIcon name="closeRed" size={16} /> Réduire
              </>
            ) : (
              <>
                <DofusIcon name="zoom" size={16} /> Agrandir
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );

  // Écran de lancement : on ne monte pas le webview tant que l'utilisateur ne l'a pas demandé.
  const launch = (
    <div
      className="relative flex flex-col items-center justify-center gap-5 overflow-hidden px-8 text-center"
      style={{
        height: viewHeight,
        background:
          "radial-gradient(ellipse 70% 55% at 50% 42%, rgba(124,58,237,.14), rgb(var(--c-cyan)/.05) 45%, transparent 72%), #070912",
      }}
    >
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-glow-purple/40 to-glow-cyan/25 text-white shadow-glow">
        <DofusIcon name="search" size={28} />
      </span>
      <div className="space-y-1.5">
        <p className="font-display text-xl font-bold text-white">Galerie de skins Barbofus</p>
        <p className="mx-auto max-w-md text-sm leading-6 text-slate-400">
          Des milliers de skins partagés par la communauté, avec recherche par item ou par pseudo.
          La galerie se charge depuis barbofus.com — elle ne s'ouvre qu'à la demande.
        </p>
      </div>
      <button onClick={() => setOpened(true)} className={toolButton("purple")}>
        Ouvrir la galerie
      </button>
    </div>
  );

  const body = !isElectron ? (
    <div className="flex min-h-[520px] flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <ImageOff className="h-10 w-10 text-slate-600" />
      <div>
        <p className="font-display text-xl font-bold text-white">Webview Electron requise</p>
        <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
          Barbofus bloque les iframes classiques. Dans l'app desktop, la galerie utilise une
          webview Electron.
        </p>
      </div>
      <a href={GALLERY_URL} className={toolButton("cyan")}>
        <ExternalLink className="h-4 w-4" /> Ouvrir Barbofus
      </a>
    </div>
  ) : opened ? (
    <div
      ref={frameRef}
      className={
        expanded
          ? "relative min-h-0 flex-1 overflow-hidden bg-void-900"
          : "relative overflow-hidden bg-void-900"
      }
      style={expanded ? undefined : { height: viewHeight }}
    >
      <webview
        ref={webviewRef}
        src={GALLERY_URL}
        title="Galerie Barbofus"
        partition="persist:barbofus-skinator"
        allowpopups="true"
        style={{ height: expanded ? "100%" : viewHeight }}
        className="block h-full w-full bg-void-900"
      />
      <AnimatePresence>
        {!ready && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="absolute inset-0 z-10 flex items-center justify-center"
            style={{
              background:
                "radial-gradient(120% 90% at 50% 18%, rgb(var(--c-purple)/0.16), transparent 60%)," +
                "radial-gradient(90% 70% at 50% 100%, rgb(var(--c-cyan)/0.1), transparent 55%)," +
                "#070912",
            }}
          >
            <AppLoader label="Chargement de la galerie Barbofus…" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ) : (
    launch
  );

  return (
    <>
      {expanded ? <div style={{ height: viewHeight }} /> : false}
      {expanded ? (
        <div
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm"
          onClick={() => setExpanded(false)}
        />
      ) : (
        false
      )}
      <div
        className={
          expanded
            ? "fixed inset-3 z-50 flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-void-900 shadow-card sm:inset-5 lg:inset-8"
            : "overflow-visible rounded-2xl border border-white/10 bg-void-900 shadow-card"
        }
      >
        {header}
        {body}
      </div>
    </>
  );
}

function syncShadowFrame(webview: GalleryWebview) {
  const iframe = (webview as HTMLElement).shadowRoot?.querySelector("iframe") as HTMLIFrameElement | null;
  if (!iframe) return;
  iframe.style.display = "block";
  iframe.style.flex = "1 1 auto";
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.minHeight = "240px";
  iframe.style.border = "0";
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

// Masque le chrome du site (navbar fixe + footer fixe) pour isoler la galerie, sans toucher
// à la recherche ni à la grille. Le footer Barbofus est en fixed bottom → il flotterait
// par-dessus les cartes ; on le masque aussi. Sur une fiche skin, on masque AUSSI les boutons
// natifs « Copier » (clipboard de l'URL Barbofus) et « 🚀 Skinator » (skinator?skin=, ouvre
// dans le webview) → on les remplace par NOTRE bouton « Ouvrir dans le Skinator » (en-tête).
function applyGalleryFocus(webview: GalleryWebview): Promise<unknown> {
  try {
    webview.setZoomFactor?.(1);
  } catch {
    /* indispo dans certains contextes */
  }
  const css = `
    html {
      background:
        radial-gradient(ellipse 70% 55% at 50% 40%,
          rgba(124, 58, 237, 0.10),
          rgb(var(--c-cyan)/0.04) 45%,
          transparent 70%),
        #070912 !important;
      background-attachment: fixed !important;
    }
    body { background: transparent !important; }
    #navbar, #footer { display: none !important; }
  `;
  const cssDone = webview.insertCSS(css).catch(() => {});
  const jsDone = webview
    .executeJavaScript(
      `(() => {
        // Le contenu réserve de l'espace pour la navbar fixe : on le récupère une fois masquée.
        document.documentElement.style.background = '#070912';
        document.body.style.background = '#070912';
        document.body.style.paddingTop = '0px';
        window.scrollTo(0, 0);

        // Masque les boutons natifs « Copier » (x-on:mousedown="CopyLink") et « 🚀 Skinator »
        // (lien skinator?skin=) de la fiche skin → on passe par notre propre bouton d'en-tête.
        // Rejoué via MutationObserver car Alpine/Livewire re-rendent après chargement.
        const dcMask = () => {
          document.querySelectorAll('a[href*="skinator?skin="]').forEach((el) => {
            el.style.display = 'none';
          });
          document.querySelectorAll('button').forEach((b) => {
            const h = b.getAttribute('x-on:mousedown') || b.getAttribute('@mousedown') || '';
            if (h.indexOf('CopyLink') !== -1) b.style.display = 'none';
          });
        };
        dcMask();
        if (!window.__dcMaskObserver) {
          let queued = false;
          window.__dcMaskObserver = new MutationObserver(() => {
            if (queued) return;
            queued = true;
            requestAnimationFrame(() => { queued = false; dcMask(); });
          });
          window.__dcMaskObserver.observe(document.body, { childList: true, subtree: true });
        }
        return true;
      })();`,
    )
    .catch(() => {});
  return Promise.all([cssDone, jsDone]);
}

function toolButton(tone: "purple" | "cyan" | "slate") {
  const tones = {
    purple: "border-glow-purple/40 bg-glow-purple/20 text-white hover:bg-glow-purple/30",
    cyan: "border-glow-cyan/35 bg-glow-cyan/15 text-glow-cyan hover:bg-glow-cyan/25",
    slate: "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10",
  };
  return `no-drag inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold transition ${tones[tone]}`;
}
