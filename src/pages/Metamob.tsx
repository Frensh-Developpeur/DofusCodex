import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

import {
  getMetamobKraloveEvent,
  getMetamobKraloveEvents,
  getMetamobQuests,
  getMetamobMonsters,
  getMetamobServers,
  getMetamobTradeMatches,
  getMetamobUser,
  getMetamobZones,
  resetMetamobQuest,
  searchMetamobUsers,
  setMetamobQuantity,
  updateMetamobQuestSettings,
  type MetamobKraloveEvent,
  type MetamobMonster,
  type MetamobQuest,
  type MetamobQuestSettings,
  type MetamobTradeMatch,
  type MetamobUserSearchResult,
  type MetamobZone,
} from "../api/metamob";
import { resolveMonsterIdByName } from "../api/dofusdb";
import { useStore, actions, type MetamobAuth } from "../store/store";
import { useDebounce } from "../hooks/useDebounce";
import { Pill, SectionHeader, Spinner, DofusLoader, EmptyState, ErrorState, fadeUp } from "../components/ui";
import DofusIcon, { type DofusIconName } from "../components/DofusIcon";
import {
  Search,
  Plus,
  RefreshCw,
  Loader2,
  SlidersHorizontal,
  Crosshair,
  Coins,
  Compass,
  CalendarDays,
  Settings,
  LogIn,
  LogOut,
  Save,
  RotateCcw,
  Clock,
  MapPin,
  Users,
  X,
} from "../components/DofusIcons";

type TabIcon = React.ComponentType<{ className?: string }>;

export default function Metamob() {
  const auth = useStore((s) => s.metamob);
  return auth ? <Tracker auth={auth} /> : <Connect />;
}

// ─── Écran de connexion ───────────────────────────────────────────────────────
function Connect() {
  const [pseudo, setPseudo] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const p = pseudo.trim();
    const k = apiKey.trim();
    if (!p || !k) {
      setError("Renseignez votre pseudo Metamob et votre clé API.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const quests = await getMetamobQuests(p, k);
      if (quests.length === 0) {
        setError("Connexion réussie, mais aucune chasse trouvée pour ce pseudo.");
        return;
      }
      actions.setMetamobAuth({ pseudo: p, apiKey: k, slug: quests[0].slug });
    } catch (err) {
      setError((err as Error)?.message ?? "Connexion impossible.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <SectionHeader
        eyebrow="Compte"
        title="Metamob"
        subtitle="Connectez votre compte Metamob pour suivre et mettre à jour vos captures d'archimonstres directement depuis DofusCodex."
      />

      <div className="mx-auto grid max-w-4xl gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Formulaire */}
        <form onSubmit={submit} className={clsx(SURFACE, "relative overflow-hidden p-5")}>
          <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-gradient-to-br from-glow-purple/40 to-glow-cyan/20 opacity-40 blur-3xl" />
          <div className="relative mb-5 flex items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-glow-purple/35 bg-gradient-to-br from-glow-purple/25 to-glow-cyan/10 shadow-[0_0_24px_-6px_rgba(124,92,255,0.6)]">
              <DofusIcon name="archmonster" size={26} />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white">Connexion à votre compte</h2>
              <p className="mt-0.5 text-sm text-slate-400">
                Identifiants <span className="font-semibold text-slate-300">stockés localement</span> — envoyés
                uniquement à Metamob.
              </p>
            </div>
          </div>

          <label className="relative mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Pseudo Metamob
          </label>
          <input
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            placeholder="VotrePseudo"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            className="no-drag relative mb-4 w-full rounded-xl border border-white/10 bg-void-800/70 px-3.5 py-2.5 text-sm text-slate-200 outline-none transition focus:border-glow-purple/50"
          />

          <label className="relative mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Clé API
          </label>
          <input
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            type="password"
            placeholder="Collez votre clé API Metamob"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            className="no-drag relative w-full rounded-xl border border-white/10 bg-void-800/70 px-3.5 py-2.5 text-sm text-slate-200 outline-none transition focus:border-glow-purple/50"
          />

          {error && (
            <p className="relative mt-4 rounded-xl border border-glow-rose/30 bg-glow-rose/10 px-3 py-2 text-sm text-glow-rose">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="no-drag relative mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-glow-purple/25 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-glow-purple/50 transition hover:bg-glow-purple/35 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
            {busy ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        {/* Aide */}
        <aside className={clsx(SURFACE, "p-5")}>
          <h3 className="mb-1 flex items-center gap-2 font-display font-bold text-white">
            <DofusIcon name="info" size={18} /> Obtenir votre clé API
          </h3>
          <p className="mb-4 text-xs leading-relaxed text-slate-400">
            La clé API permet à DofusCodex de lire et mettre à jour votre chasse Metamob. Elle se
            génère en quelques secondes depuis votre compte.
          </p>
          <ol className="space-y-3 text-sm text-slate-300">
            <TutorialStep n={1}>
              Connectez-vous sur <span className="font-semibold text-slate-200">metamob.fr</span> avec votre compte habituel.
            </TutorialStep>
            <TutorialStep n={2}>
              Cliquez sur votre pseudo en haut à droite →{" "}
              <span className="font-semibold text-slate-200">Mon profil</span>, puis l'onglet{" "}
              <span className="font-semibold text-slate-200">API</span>.
            </TutorialStep>
            <TutorialStep n={3}>
              Cliquez sur <span className="font-semibold text-slate-200">Générer une clé</span> et copiez-la.
            </TutorialStep>
            <TutorialStep n={4}>
              Collez-la dans le champ <span className="font-semibold text-slate-200">Clé API</span> à
              gauche, avec votre pseudo. C'est tout !
            </TutorialStep>
          </ol>

          <div className="mt-4 flex items-start gap-2 rounded-xl border border-glow-emerald/20 bg-glow-emerald/[0.06] px-3 py-2.5 text-[11px] leading-relaxed text-slate-300">
            <DofusIcon name="shield" size={14} className="mt-0.5 shrink-0" />
            <span>
              Votre clé est <span className="font-semibold text-glow-emerald">stockée uniquement sur cet
              ordinateur</span> et n'est envoyée qu'à Metamob. Vous pouvez la révoquer à tout moment
              depuis votre compte.
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ─── Tableau de suivi ──────────────────────────────────────────────────────────
type StatusFilter = "all" | "owned" | "missing" | "wanted" | "offered";
type SortMode = "metamob" | "step" | "name" | "quantity" | "status" | "level";
type MetamobView = "captures" | "trades" | "zones" | "krala" | "manage";
type FilterPreset = {
  id: string;
  name: string;
  search: string;
  typeFilter: string;
  stepFilter: string;
  statusFilter: StatusFilter;
  interestingOnly: boolean;
  sortMode: SortMode;
};

const FILTER_PRESETS_KEY = "dofuscodex.metamob.filters.v1";

// Surfaces alignées sur le design system de l'app (verre dépoli, coins 2xl).
const SURFACE = "glass";
const CONTROL =
  "no-drag rounded-xl border border-white/10 bg-void-800/70 px-3 py-2.5 text-xs font-semibold text-slate-200 outline-none transition focus:border-glow-purple/50";
const SUBTLE_PANEL = "rounded-xl border border-white/10 bg-white/[0.04]";

const TABS: [MetamobView, string, TabIcon][] = [
  ["captures", "Captures", Crosshair],
  ["trades", "Échanges", Coins],
  ["zones", "Zones", Compass],
  ["krala", "Krala", CalendarDays],
  ["manage", "Gestion", Settings],
];

function Tracker({ auth }: { auth: MetamobAuth }) {
  const qc = useQueryClient();
  const [view, setView] = useState<MetamobView>("captures");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [stepFilter, setStepFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [interestingOnly, setInterestingOnly] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("metamob");
  const [presetName, setPresetName] = useState("");
  const [filterPresets, setFilterPresets] = useState<FilterPreset[]>(() => loadFilterPresets());
  const [toast, setToast] = useState<string | null>(null);
  const debounced = useDebounce(search).trim().toLowerCase();

  // Affiche brièvement une erreur d'action (quantité/échange) sinon revertée silencieusement.
  const showToast = (msg?: string) => {
    setToast(msg || "Action impossible côté Metamob.");
    window.setTimeout(() => setToast(null), 5000);
  };

  const questsQuery = useQuery({
    queryKey: ["mm-quests", auth.pseudo],
    queryFn: ({ signal }) => getMetamobQuests(auth.pseudo, auth.apiKey, signal),
    staleTime: 1000 * 60 * 10,
  });

  const quests = questsQuery.data ?? [];
  const slug = auth.slug && quests.some((q) => q.slug === auth.slug) ? auth.slug : quests[0]?.slug;
  const activeQuest = quests.find((q) => q.slug === slug);

  const monstersKey = ["mm-monsters", auth.pseudo, slug] as const;
  const monstersQuery = useQuery({
    queryKey: monstersKey,
    queryFn: ({ signal }) => getMetamobMonsters(auth.pseudo, slug!, auth.apiKey, signal),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });

  const monsters = monstersQuery.data ?? [];

  // Mutation quantité avec mise à jour optimiste du cache.
  const setQty = useMutation({
    mutationFn: ({ id, qty }: { id: number; qty: number }) =>
      setMetamobQuantity(slug!, id, qty, auth.apiKey),
    onMutate: async ({ id, qty }) => {
      await qc.cancelQueries({ queryKey: monstersKey });
      const prev = qc.getQueryData<MetamobMonster[]>(monstersKey);
      // Échange 100% AUTO : on recalcule le statut (propose le surplus / recherche le manque) en même
      // temps que la quantité → la carte se met à jour à chaque +/- sans aller-retour réseau. Metamob
      // fait le même calcul côté serveur quand la quantité change.
      qc.setQueryData<MetamobMonster[]>(monstersKey, (old) =>
        old?.map((m) => (m.id === id ? autoTradeFor(m, qty, activeQuest?.parallelQuests ?? 1) : m)),
      );
      return { prev };
    },
    onError: (e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(monstersKey, ctx.prev);
      showToast((e as Error)?.message);
    },
    onSettled: () => {
      // La quantité modifie l'échange auto → on invalide les vues dérivées (partenaires, zones),
      // re-téléchargées à leur prochaine ouverture. (La liste reste optimiste → pas de saut.)
      qc.invalidateQueries({ queryKey: ["mm-trades", slug] });
      qc.invalidateQueries({ queryKey: ["mm-zones", slug] });
    },
  });

  const change = (m: MetamobMonster, delta: number) => {
    const qty = Math.max(0, Math.min(30, m.owned + delta));
    if (qty !== m.owned) setQty.mutate({ id: m.id, qty });
  };

  const saveFilterPreset = () => {
    const name = presetName.trim() || `Filtre ${filterPresets.length + 1}`;
    const next: FilterPreset[] = [
      {
        id: `${Date.now().toString(36)}`,
        name,
        search,
        typeFilter,
        stepFilter,
        statusFilter,
        interestingOnly,
        sortMode,
      },
      ...filterPresets.filter((p) => p.name !== name),
    ].slice(0, 12);
    setFilterPresets(next);
    storeFilterPresets(next);
    setPresetName("");
  };

  const applyFilterPreset = (presetId: string) => {
    const preset = filterPresets.find((p) => p.id === presetId);
    if (!preset) return;
    setSearch(preset.search);
    setTypeFilter(preset.typeFilter);
    setStepFilter(preset.stepFilter);
    setStatusFilter(preset.statusFilter);
    setInterestingOnly(preset.interestingOnly);
    setSortMode(preset.sortMode);
  };

  // Types présents (pour les filtres) — seulement si l'API renvoie un libellé.
  const types = useMemo(() => {
    const set = new Set<string>();
    for (const m of monsters) if (m.type) set.add(m.type);
    return [...set].sort((a, b) => a.localeCompare(b, "fr"));
  }, [monsters]);

  const steps = useMemo(() => {
    const set = new Set<number>();
    for (const m of monsters) if (typeof m.step === "number") set.add(m.step);
    return [...set].sort((a, b) => a - b);
  }, [monsters]);

  const filtered = useMemo(() => {
    const step = stepFilter === "all" ? null : Number(stepFilter);
    const statusRank = (m: MetamobMonster) => (m.status === "wanted" ? 0 : m.status === "offered" ? 1 : 2);
    const byName = (a: MetamobMonster, b: MetamobMonster) => a.name.localeCompare(b.name, "fr");
    const byStep = (a: MetamobMonster, b: MetamobMonster) => (a.step ?? 999) - (b.step ?? 999) || byName(a, b);
    const byType = (a: MetamobMonster, b: MetamobMonster) =>
      a.type.localeCompare(b.type, "fr") || (a.typeId ?? 999) - (b.typeId ?? 999);

    return monsters
      .filter((m) => {
        if (debounced && !m.name.toLowerCase().includes(debounced)) return false;
        if (typeFilter !== "all" && m.type !== typeFilter) return false;
        if (step != null && m.step !== step) return false;
        if (interestingOnly && m.status === "none") return false;
        if (statusFilter === "owned" && m.owned <= 0) return false;
        if (statusFilter === "missing" && m.owned > 0) return false;
        if (statusFilter === "wanted" && m.status !== "wanted") return false;
        if (statusFilter === "offered" && m.status !== "offered") return false;
        return true;
      })
      .sort((a, b) => {
        if (sortMode === "metamob") {
          // Sous le filtre « Tous » : ordre FIXE (étape → type → nom), indépendant du statut
          // d'échange → proposer/rechercher un monstre ne le fait plus sauter de place.
          // Sous un filtre de statut, on garde le regroupement par statut (sans incidence visible,
          // le filtre isolant déjà un seul statut).
          if (statusFilter === "all") return byStep(a, b) || byType(a, b) || byName(a, b);
          return statusRank(a) - statusRank(b) || byStep(a, b) || byType(a, b) || byName(a, b);
        }
        if (sortMode === "step") return byStep(a, b);
        if (sortMode === "name") return byName(a, b);
        if (sortMode === "quantity") return b.owned - a.owned || statusRank(a) - statusRank(b) || byStep(a, b);
        if (sortMode === "status") {
          return statusRank(a) - statusRank(b) || Math.abs(b.statusValue) - Math.abs(a.statusValue) || byStep(a, b);
        }
        return (a.levelMin ?? 9999) - (b.levelMin ?? 9999) || byStep(a, b);
      });
  }, [monsters, debounced, typeFilter, stepFilter, interestingOnly, statusFilter, sortMode]);

  const ownedCount = monsters.filter((m) => m.owned > 0).length;
  const wantedCount = monsters.filter((m) => m.status === "wanted").length;
  const offeredCount = monsters.filter((m) => m.status === "offered").length;
  const total = monsters.length;

  // États de la requête « quêtes » (sert aussi à détecter une clé révoquée).
  if (questsQuery.isLoading) return <Spinner label="Connexion à Metamob…" />;
  if (questsQuery.isError) {
    return (
      <div>
        <SectionHeader eyebrow="Compte Metamob" title="Mes archimonstres" />
        <ErrorState
          message={(questsQuery.error as Error)?.message ?? "Connexion à Metamob impossible."}
          onRetry={() => questsQuery.refetch()}
        />
        <div className="mt-4 text-center">
          <button
            onClick={() => actions.clearMetamob()}
            className="no-drag inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" /> Changer de compte
          </button>
        </div>
      </div>
    );
  }
  if (!slug) return <EmptyState title="Aucune chasse" hint="Aucune chasse n'est associée à ce compte Metamob." />;

  const completion = total > 0 ? Math.round((ownedCount / total) * 100) : 0;

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Compte Metamob"
        title="Ocre tracker"
        subtitle="Captures, échanges, zones et Kralamoure synchronisés avec les endpoints publics Metamob."
        right={
          <button
            onClick={() => actions.clearMetamob()}
            className="no-drag inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-void-900/70 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-glow-rose/40 hover:bg-glow-rose/10 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" /> Déconnexion
          </button>
        }
      />

      <div className={clsx(SURFACE, "relative overflow-hidden")}>
        {/* halo décoratif (cohérent avec les hero des autres pages) */}
        <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-gradient-to-br from-glow-purple/40 to-glow-cyan/20 opacity-40 blur-3xl" />

        <div className="relative grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex min-w-0 items-center gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-glow-purple/35 bg-gradient-to-br from-glow-purple/25 to-glow-cyan/10 shadow-[0_0_24px_-6px_rgba(124,92,255,0.6)]">
              <DofusIcon name="archmonster" size={32} />
            </div>
            <div className="min-w-0">
              <div className="mb-0.5 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-glow-purple/80">
                  Chasse à l'Ocre
                </span>
                {activeQuest?.server && (
                  <Pill tone="slate" className="!px-2 !py-0 !text-[10px]">
                    {activeQuest.server}
                  </Pill>
                )}
              </div>
              <p className="truncate font-display text-2xl font-extrabold leading-tight text-white">{auth.pseudo}</p>
              <p className="truncate text-xs text-slate-400">
                {activeQuest?.characterName ?? "—"}
                {activeQuest?.parallelQuests ? ` · ${activeQuest.parallelQuests} quêtes parallèles` : ""}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:justify-end lg:self-start">
            {quests.length > 1 && (
              <select value={slug} onChange={(e) => actions.setMetamobSlug(e.target.value)} className={CONTROL}>
                {quests.map((q) => (
                  <option key={q.slug} value={q.slug}>
                    {q.characterName}
                    {q.server ? ` (${q.server})` : ""}
                  </option>
                ))}
              </select>
            )}
            <button
              onClick={() => monstersQuery.refetch()}
              className="no-drag inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <RefreshCw className={clsx("h-3.5 w-3.5", monstersQuery.isFetching && "animate-spin")} /> Actualiser
            </button>
          </div>
        </div>

        {/* Barre de progression de la collection */}
        <div className="relative px-5 pb-4">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Progression de la collection</span>
            <span className="font-bold text-glow-violet">
              {completion}% · {ownedCount}/{total || "—"}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-glow-purple to-glow-cyan"
              animate={{ width: `${completion}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
        </div>

        <div className="relative grid border-t border-white/10 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardStat label="Capturés" value={String(ownedCount)} detail={`sur ${total || "—"} archis`} tone="purple" />
          <DashboardStat label="Recherchés" value={String(wantedCount)} detail="à récupérer" tone="cyan" />
          <DashboardStat label="Proposés" value={String(offeredCount)} detail="dispo. échange" tone="gold" />
          <DashboardStat label="Étape" value={String(activeQuest?.currentStep ?? "—")} detail="quête active" tone="slate" />
        </div>

        <div className="relative flex flex-wrap gap-1 border-t border-white/10 bg-black/15 p-2">
          {TABS.map(([key, label, Icon]) => (
            <TabChip
              key={key}
              active={view === key}
              icon={Icon}
              onClick={() => {
                setView(key);
                // Recharge les partenaires d'échange à chaque passage sur l'onglet Échanges
                // (même s'il est déjà actif) → toujours l'état Metamob à jour.
                if (key === "trades") qc.invalidateQueries({ queryKey: ["mm-trades", slug] });
              }}
            >
              {label}
            </TabChip>
          ))}
        </div>
      </div>

      {view === "trades" && <TradesPanel slug={slug} apiKey={auth.apiKey} monsters={monsters} />}
      {view === "zones" && <ZonesPanel slug={slug} apiKey={auth.apiKey} />}
      {view === "krala" && (
        <KralaPanel apiKey={auth.apiKey} serverId={activeQuest?.serverId} serverName={activeQuest?.server} />
      )}
      {view === "manage" && (
        <ManagePanel
          key={slug}
          apiKey={auth.apiKey}
          pseudo={auth.pseudo}
          slug={slug}
          activeQuest={activeQuest}
          quests={quests}
          monsters={monsters}
          onQuestChange={(nextSlug) => actions.setMetamobSlug(nextSlug)}
        />
      )}
      {view !== "captures" ? null : (
        <>
      {/* Filtres */}
      <div className={clsx(SURFACE, "flex flex-col gap-3 p-4")}>
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un monstre…"
            className="no-drag w-full rounded-lg border border-white/10 bg-void-800/70 py-2.5 pl-10 pr-3 text-sm text-slate-200 outline-none transition focus:border-glow-purple/50"
          />
          </div>
          <span className="self-center text-xs font-semibold text-slate-500">
            {filtered.length}/{total || "—"} affichés
          </span>
        </div>
        <div className="grid gap-2 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
          <SelectField
            label="Tri"
            value={sortMode}
            onChange={(value) => setSortMode(value as SortMode)}
            options={[
              ["metamob", "Metamob"],
              ["step", "Étape"],
              ["name", "Nom"],
              ["quantity", "Quantité"],
              ["status", "Échange"],
              ["level", "Niveau"],
            ]}
          />
          <SelectField
            label="Type"
            value={typeFilter}
            onChange={setTypeFilter}
            options={[["all", "Tous les types"], ...types.map((t) => [t, t] as [string, string])]}
          />
          <SelectField
            label="Étape"
            value={stepFilter}
            onChange={setStepFilter}
            options={[["all", "Toutes les étapes"], ...steps.map((s) => [String(s), `Étape ${s}`] as [string, string])]}
          />
          <label className="no-drag flex min-h-[46px] items-center gap-2 rounded-lg border border-white/10 bg-void-800/70 px-3 text-xs font-semibold text-slate-300">
            <input
              type="checkbox"
              checked={interestingOnly}
              onChange={(e) => setInterestingOnly(e.target.checked)}
              className="h-4 w-4 accent-glow-purple"
            />
            Échanges uniquement
          </label>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="mr-1 inline-flex items-center gap-1 self-center text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Statut
          </span>
          {(
            [
              ["all", "Tous"],
              ["owned", "Possédés"],
              ["missing", "Manquants"],
              ["wanted", "Recherchés"],
              ["offered", "Proposés"],
            ] as [StatusFilter, string][]
          ).map(([key, label]) => (
            <FilterChip key={key} active={statusFilter === key} onClick={() => setStatusFilter(key)}>
              {label}
            </FilterChip>
          ))}
        </div>
        <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_220px_auto]">
          <input
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="Nom du filtre à sauvegarder..."
            className="no-drag w-full rounded-lg border border-white/10 bg-void-800/70 px-3 py-2.5 text-xs font-semibold text-slate-200 outline-none transition focus:border-glow-purple/50"
          />
          <SelectField
            label="Filtres sauvés"
            value=""
            onChange={applyFilterPreset}
            options={[
              ["", filterPresets.length ? "Restaurer un filtre" : "Aucun filtre sauvé"],
              ...filterPresets.map((p) => [p.id, p.name] as [string, string]),
            ]}
          />
          <button
            onClick={saveFilterPreset}
            className="no-drag self-end rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Sauvegarder filtre
          </button>
        </div>
      </div>

      {/* Grille */}
      {monstersQuery.isLoading ? (
        <Panel>
          <Spinner label="Chargement des captures Metamob…" />
        </Panel>
      ) : monstersQuery.isError ? (
        <ErrorState message={(monstersQuery.error as Error)?.message} onRetry={() => monstersQuery.refetch()} />
      ) : filtered.length === 0 ? (
        <EmptyState title="Aucun monstre" hint="Modifiez la recherche ou les filtres." />
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.015 } } }}
          className={clsx(
            "grid gap-3 md:grid-cols-2 xl:grid-cols-3",
            monstersQuery.isFetching && "opacity-80",
          )}
        >
          {filtered.map((m, i) => (
            <MonsterCard key={m.id} m={m} index={i} onChange={change} />
          ))}
        </motion.div>
      )}
        </>
      )}

      <ActionToast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}

// Toast d'erreur d'action (échange/quantité refusés par Metamob) — en portal sur <body>.
function ActionToast({ message, onClose }: { message: string | null; onClose: () => void }) {
  return createPortal(
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-5 left-1/2 z-[70] flex max-w-md -translate-x-1/2 items-start gap-2.5 rounded-xl border border-glow-rose/40 bg-void-800/95 px-4 py-3 text-sm text-slate-200 shadow-[0_16px_48px_rgba(0,0,0,0.5)] backdrop-blur-xl"
        >
          <DofusIcon name="warning" size={18} className="mt-0.5 shrink-0" />
          <span className="min-w-0">{message}</span>
          <button onClick={onClose} className="no-drag -mr-1 shrink-0 rounded p-0.5 text-slate-400 transition hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function ManagePanel({
  apiKey,
  pseudo,
  slug,
  activeQuest,
  quests,
  monsters,
  onQuestChange,
}: {
  apiKey: string;
  pseudo: string;
  slug: string;
  activeQuest?: MetamobQuest;
  quests: MetamobQuest[];
  monsters: MetamobMonster[];
  onQuestChange: (slug: string) => void;
}) {
  const qc = useQueryClient();
  const [characterName, setCharacterName] = useState(activeQuest?.characterName ?? "");
  const [parallelQuests, setParallelQuests] = useState(activeQuest?.parallelQuests ?? 1);
  const [currentStep, setCurrentStep] = useState(activeQuest?.currentStep ?? 1);
  const [showTrades, setShowTrades] = useState(activeQuest?.showTrades ?? true);
  const [tradeMode, setTradeMode] = useState(activeQuest?.tradeMode ?? 0);
  const [offerThreshold, setOfferThreshold] = useState<number | "">(activeQuest?.tradeOfferThreshold ?? "");
  const [wantThreshold, setWantThreshold] = useState<number | "">(activeQuest?.tradeWantThreshold ?? "");
  const [neverOfferNormal, setNeverOfferNormal] = useState(Boolean(activeQuest?.neverOfferNormal));
  const [neverWantNormal, setNeverWantNormal] = useState(Boolean(activeQuest?.neverWantNormal));
  const [neverOfferBoss, setNeverOfferBoss] = useState(Boolean(activeQuest?.neverOfferBoss));
  const [neverWantBoss, setNeverWantBoss] = useState(Boolean(activeQuest?.neverWantBoss));
  const [neverOfferArch, setNeverOfferArch] = useState(Boolean(activeQuest?.neverOfferArch));
  const [neverWantArch, setNeverWantArch] = useState(Boolean(activeQuest?.neverWantArch));
  const [touched, setTouched] = useState<Set<keyof MetamobQuestSettings>>(() => new Set());
  const [resetText, setResetText] = useState("");

  const markTouched = (key: keyof MetamobQuestSettings) => {
    setTouched((prev) => new Set(prev).add(key));
  };

  const saveSettings = useMutation({
    mutationFn: () => {
      const settings: MetamobQuestSettings = {};
      if (touched.has("characterName")) settings.characterName = characterName;
      if (touched.has("parallelQuests")) settings.parallelQuests = parallelQuests;
      if (touched.has("currentStep")) settings.currentStep = currentStep;
      if (touched.has("showTrades")) settings.showTrades = showTrades;
      if (touched.has("tradeMode")) settings.tradeMode = tradeMode;
      if (touched.has("tradeOfferThreshold")) settings.tradeOfferThreshold = offerThreshold === "" ? null : Number(offerThreshold);
      if (touched.has("tradeWantThreshold")) settings.tradeWantThreshold = wantThreshold === "" ? null : Number(wantThreshold);
      if (touched.has("neverOfferNormal")) settings.neverOfferNormal = neverOfferNormal;
      if (touched.has("neverWantNormal")) settings.neverWantNormal = neverWantNormal;
      if (touched.has("neverOfferBoss")) settings.neverOfferBoss = neverOfferBoss;
      if (touched.has("neverWantBoss")) settings.neverWantBoss = neverWantBoss;
      if (touched.has("neverOfferArch")) settings.neverOfferArch = neverOfferArch;
      if (touched.has("neverWantArch")) settings.neverWantArch = neverWantArch;
      return updateMetamobQuestSettings(slug, settings, apiKey);
    },
    onSuccess: () => {
      setTouched(new Set());
      qc.invalidateQueries({ queryKey: ["mm-quests", pseudo] });
      qc.invalidateQueries({ queryKey: ["mm-monsters", pseudo, slug] });
      qc.invalidateQueries({ queryKey: ["mm-trades", slug] });
      qc.invalidateQueries({ queryKey: ["mm-zones", slug] });
    },
  });

  const resetQuest = useMutation({
    mutationFn: () => resetMetamobQuest(slug, pseudo, monsters, apiKey),
    onSuccess: () => {
      setResetText("");
      qc.invalidateQueries({ queryKey: ["mm-quests", pseudo] });
      qc.invalidateQueries({ queryKey: ["mm-monsters", pseudo, slug] });
      qc.invalidateQueries({ queryKey: ["mm-trades", slug] });
      qc.invalidateQueries({ queryKey: ["mm-zones", slug] });
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings.mutate();
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-3 lg:grid-cols-4">
        <QuestMetric label="Serveur" value={activeQuest?.server ?? "—"} />
        <QuestMetric label="Étape" value={String(activeQuest?.currentStep ?? "—")} />
        <QuestMetric label="Quêtes parallèles" value={String(activeQuest?.parallelQuests ?? "—")} />
        <QuestMetric label="Échanges" value={activeQuest?.showTrades === false ? "Masqués" : "Visibles"} tone={activeQuest?.showTrades === false ? "rose" : "emerald"} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.75fr)]">
        <form onSubmit={submit} className={clsx(SURFACE, "p-5")}>
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-display text-lg font-bold text-white">Réglages de quête</p>
              <p className="mt-1 text-sm text-slate-400">Paramètres Metamob modifiables par clé API.</p>
            </div>
            <button
              type="submit"
              disabled={saveSettings.isPending || touched.size === 0}
              className="no-drag inline-flex items-center gap-1.5 rounded-lg border border-glow-emerald/30 bg-glow-emerald/15 px-3 py-2 text-xs font-semibold text-glow-emerald transition hover:bg-glow-emerald/25 disabled:opacity-50"
            >
              {saveSettings.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              Enregistrer
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <label className="md:col-span-3">
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">Personnage</span>
              <input
                value={characterName}
                onChange={(e) => {
                  markTouched("characterName");
                  setCharacterName(e.target.value);
                }}
                className="no-drag w-full rounded-lg border border-white/10 bg-void-800/70 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-glow-purple/50"
              />
            </label>
            <NumberField label="Quêtes parallèles" value={parallelQuests} min={1} max={30} onChange={(v) => {
              markTouched("parallelQuests");
              setParallelQuests(v);
            }} />
            <NumberField label="Étape actuelle" value={currentStep} min={1} max={34} onChange={(v) => {
              markTouched("currentStep");
              setCurrentStep(v);
            }} />
            <SelectField
              label="Mode trade"
              value={String(tradeMode)}
              onChange={(v) => {
                markTouched("tradeMode");
                setTradeMode(Number(v));
              }}
              options={[
                ["0", "Automatique"],
                ["1", "Expert"],
              ]}
            />
            <NullableNumberField label="Seuil proposer" value={offerThreshold} onChange={(v) => {
              markTouched("tradeOfferThreshold");
              setOfferThreshold(v);
            }} />
            <NullableNumberField label="Seuil rechercher" value={wantThreshold} onChange={(v) => {
              markTouched("tradeWantThreshold");
              setWantThreshold(v);
            }} />
            <label className="no-drag flex min-h-[46px] items-center gap-2 rounded-lg border border-white/10 bg-void-800/70 px-3 text-xs font-semibold text-slate-300 md:self-end">
              <input type="checkbox" checked={showTrades} onChange={(e) => {
                markTouched("showTrades");
                setShowTrades(e.target.checked);
              }} className="h-4 w-4 accent-glow-purple" />
              Visible communauté
            </label>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <TradeRuleBlock
              title="Monstres"
              offer={neverOfferNormal}
              want={neverWantNormal}
              onOffer={(v) => {
                markTouched("neverOfferNormal");
                setNeverOfferNormal(v);
              }}
              onWant={(v) => {
                markTouched("neverWantNormal");
                setNeverWantNormal(v);
              }}
            />
            <TradeRuleBlock
              title="Boss"
              offer={neverOfferBoss}
              want={neverWantBoss}
              onOffer={(v) => {
                markTouched("neverOfferBoss");
                setNeverOfferBoss(v);
              }}
              onWant={(v) => {
                markTouched("neverWantBoss");
                setNeverWantBoss(v);
              }}
            />
            <TradeRuleBlock
              title="Archimonstres"
              offer={neverOfferArch}
              want={neverWantArch}
              onOffer={(v) => {
                markTouched("neverOfferArch");
                setNeverOfferArch(v);
              }}
              onWant={(v) => {
                markTouched("neverWantArch");
                setNeverWantArch(v);
              }}
            />
          </div>

          {saveSettings.isError && <p className="mt-3 text-sm text-glow-rose">{(saveSettings.error as Error).message}</p>}
          {saveSettings.isSuccess && <p className="mt-3 text-sm text-glow-emerald">Réglages enregistrés.</p>}
        </form>

        <div className="space-y-5">
          <Panel className="p-5">
            <p className="font-display text-lg font-bold text-white">Chasses</p>
            <div className="mt-4 space-y-3">
              <SelectField
                label="Chasse active"
                value={slug}
                onChange={onQuestChange}
                options={quests.map((q) => [q.slug, `${q.characterName}${q.server ? ` · ${q.server}` : ""}`])}
              />
              <p className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-slate-400">
                La création, suppression ou migration de serveur n'est pas exposée par l'API publique Metamob.
              </p>
            </div>
          </Panel>

          <div className={clsx(SURFACE, "border-glow-rose/25 p-5")}>
            <p className="font-display text-lg font-bold text-glow-rose">Zone de danger</p>
            <p className="mt-1 text-sm text-slate-400">
              Réinitialise l'étape à 1 et remet toutes les quantités à 0. Les réglages de trade restent configurables ensuite.
            </p>
            <input
              value={resetText}
              onChange={(e) => setResetText(e.target.value)}
              placeholder="Tapez REINITIALISER"
              className="no-drag mt-4 w-full rounded-lg border border-glow-rose/25 bg-glow-rose/10 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-glow-rose/60"
            />
            <button
              onClick={() => resetQuest.mutate()}
              disabled={resetText !== "REINITIALISER" || resetQuest.isPending || monsters.length === 0}
              className="no-drag mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-glow-rose/35 bg-glow-rose/15 px-3 py-2 text-xs font-semibold text-glow-rose transition hover:bg-glow-rose/25 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {resetQuest.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />}
              Réinitialiser la chasse
            </button>
            {resetQuest.isError && <p className="mt-3 text-sm text-glow-rose">{(resetQuest.error as Error).message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

type MonsterRefIndex = {
  byId: Map<number, MetamobMonster>;
  byName: Map<string, MetamobMonster>;
};

function monsterLookupKey(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr-FR")
    .replace(/\s+/g, " ")
    .trim();
}

function tradeMonsterTarget(monster: MetamobTradeMatch["theyHaveYouWant"][number], refs: MonsterRefIndex): MonsterOpenTarget {
  const ref = refs.byId.get(monster.id) ?? refs.byName.get(monsterLookupKey(monster.name));
  return {
    name: monster.name,
    img: monster.img ?? ref?.img,
    codexMonsterId: monster.codexMonsterId ?? ref?.codexMonsterId,
    typeId: monster.typeId ?? ref?.typeId,
    levelMin: monster.levelMin ?? ref?.levelMin,
    levelMax: monster.levelMax ?? ref?.levelMax,
  };
}

function TradesPanel({ slug, apiKey, monsters }: { slug: string; apiKey: string; monsters: MetamobMonster[] }) {
  const [onlyPossible, setOnlyPossible] = useState(true);
  const [minParallel, setMinParallel] = useState(1);
  const [userSearch, setUserSearch] = useState("");
  const [serverFilter, setServerFilter] = useState("");
  const [activeDays, setActiveDays] = useState(90);
  const [profileUser, setProfileUser] = useState<string | null>(null);
  const debouncedUserSearch = useDebounce(userSearch).trim();
  const serversQuery = useQuery({
    queryKey: ["mm-servers"],
    queryFn: ({ signal }) => getMetamobServers(apiKey, signal),
    staleTime: 1000 * 60 * 60,
  });
  const servers = serversQuery.data ?? [];
  const matchesQuery = useQuery({
    queryKey: ["mm-trades", slug, onlyPossible, minParallel],
    queryFn: ({ signal }) =>
      getMetamobTradeMatches(slug, apiKey, {
        onlyPossibleTrades: onlyPossible,
        minParallelQuests: minParallel,
        signal,
      }),
    staleTime: 1000 * 60 * 5,
    // L'onglet Échanges se démonte au changement d'onglet → on recharge les partenaires à chaque
    // fois qu'on y revient, pour refléter l'état Metamob à jour (et nos derniers réglages de trade).
    refetchOnMount: "always",
  });
  const usersQuery = useQuery({
    queryKey: ["mm-user-search", debouncedUserSearch, serverFilter, activeDays],
    queryFn: ({ signal }) =>
      searchMetamobUsers(apiKey, {
        query: debouncedUserSearch,
        serverId: serverFilter ? Number(serverFilter) : undefined,
        activeWithinDays: activeDays,
        signal,
      }),
    enabled: debouncedUserSearch.length >= 3,
    staleTime: 1000 * 60 * 2,
  });
  const matches = matchesQuery.data ?? [];
  const users = usersQuery.data ?? [];
  const monsterRefs = useMemo<MonsterRefIndex>(() => {
    const byId = new Map<number, MetamobMonster>();
    const byName = new Map<string, MetamobMonster>();
    for (const monster of monsters) {
      byId.set(monster.id, monster);
      byName.set(monsterLookupKey(monster.name), monster);
    }
    return { byId, byName };
  }, [monsters]);

  return (
    <div className="space-y-5">
      <Panel className="grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_220px_auto]">
        <div>
          <p className="font-display text-lg font-bold text-white">Partenaires d'échange</p>
          <p className="mt-1 text-sm text-slate-400">
            Tri Metamob conservé: équilibre entre ce que vous pouvez donner et recevoir.
          </p>
        </div>
        <label className="block">
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Quêtes parallèles min.
          </span>
          <input
            type="number"
            min={1}
            max={20}
            value={minParallel}
            onChange={(e) => setMinParallel(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
            className="no-drag w-full rounded-lg border border-white/10 bg-void-800/70 px-3 py-2.5 text-xs font-semibold text-slate-200 outline-none focus:border-glow-purple/50"
          />
        </label>
        <label className="no-drag flex min-h-[46px] items-center gap-2 rounded-lg border border-white/10 bg-void-800/70 px-3 text-xs font-semibold text-slate-300 md:self-end">
          <input
            type="checkbox"
            checked={onlyPossible}
            onChange={(e) => setOnlyPossible(e.target.checked)}
            className="h-4 w-4 accent-glow-purple"
          />
          Échanges possibles
        </label>
      </Panel>

      {matchesQuery.isLoading ? (
        <Panel>
          <Spinner label="Chargement des partenaires d'échange…" />
        </Panel>
      ) : matchesQuery.isError ? (
        <ErrorState message={(matchesQuery.error as Error)?.message} onRetry={() => matchesQuery.refetch()} />
      ) : matches.length === 0 ? (
        <EmptyState title="Aucun partenaire" hint="Ajustez les filtres d'échange." />
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {matches.map((match) => (
            <TradeMatchCard
              key={`${match.username}:${match.questSlug ?? match.characterName}`}
              match={match}
              monsterRefs={monsterRefs}
              onOpenProfile={setProfileUser}
            />
          ))}
        </div>
      )}

      <Panel className="p-4">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-display text-lg font-bold text-white">Recherche communauté</p>
            <p className="mt-1 text-sm text-slate-400">Recherche de joueurs exposée par l'API, sans redirection web.</p>
          </div>
        </div>
        <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_220px_160px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Pseudo joueur..."
              className="no-drag w-full rounded-lg border border-white/10 bg-void-800/70 py-2.5 pl-10 pr-3 text-sm text-slate-200 outline-none transition focus:border-glow-purple/50"
            />
          </div>
          <SelectField
            label="Serveur"
            value={serverFilter}
            onChange={setServerFilter}
            options={[
              ["", serversQuery.isLoading ? "Chargement..." : "Tous les serveurs"],
              ...servers.map((s) => [String(s.id), `${s.name}${s.community ? ` · ${s.community}` : ""}`] as [string, string]),
            ]}
          />
          <NumberField label="Actif depuis" value={activeDays} min={1} max={365} onChange={setActiveDays} suffix="j" />
        </div>
        <div className="mt-4">
          {debouncedUserSearch.length > 0 && debouncedUserSearch.length < 3 ? (
            <p className="text-sm text-slate-500">Tapez au moins 3 caractères.</p>
          ) : usersQuery.isLoading ? (
            <DofusLoader label="Recherche des joueurs…" className="rounded-xl border border-white/10 bg-black/20 py-6" />
          ) : usersQuery.isError ? (
            <p className="text-sm text-glow-rose">{(usersQuery.error as Error).message}</p>
          ) : users.length > 0 ? (
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              {users.map((user) => (
                <UserSearchCard key={user.username} user={user} onOpenProfile={setProfileUser} />
              ))}
            </div>
          ) : debouncedUserSearch.length >= 3 ? (
            <p className="text-sm text-slate-500">Aucun joueur trouvé.</p>
          ) : null}
        </div>
      </Panel>

      {profileUser && (
        <ProfileModal username={profileUser} apiKey={apiKey} onClose={() => setProfileUser(null)} />
      )}
    </div>
  );
}

function UserSearchCard({
  user,
  onOpenProfile,
}: {
  user: MetamobUserSearchResult;
  onOpenProfile: (username: string) => void;
}) {
  return (
    <button
      onClick={() => onOpenProfile(user.username)}
      className={clsx(
        SUBTLE_PANEL,
        "no-drag flex items-center justify-between gap-3 p-3 text-left transition hover:border-glow-purple/40 hover:bg-white/[0.07]",
      )}
    >
      <span className="flex min-w-0 items-center gap-3">
        <Avatar src={user.avatar} name={user.username} size={40} />
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-white">{user.username}</span>
          {user.lastActive && <span className="block text-[11px] text-slate-500">Actif : {formatDate(user.lastActive)}</span>}
        </span>
      </span>
      <Pill tone="slate">Profil</Pill>
    </button>
  );
}

function TradeMatchCard({
  match,
  monsterRefs,
  onOpenProfile,
}: {
  match: MetamobTradeMatch;
  monsterRefs: MonsterRefIndex;
  onOpenProfile: (username: string) => void;
}) {
  const receiveCount = match.theyHaveYouWant.length;
  const giveCount = match.youHaveTheyWant.length;

  return (
    <Panel className="overflow-hidden p-0">
      <div className="mb-3 flex items-start justify-between gap-3">
        <button
          onClick={() => onOpenProfile(match.username)}
          className="no-drag group ml-4 mt-4 flex min-w-0 items-center gap-3 text-left"
        >
          <Avatar src={match.avatar} name={match.username} size={44} />
          <div className="min-w-0">
            <p className="truncate font-display text-base font-bold text-white transition group-hover:text-glow-violet">
              {match.username}
            </p>
            <p className="truncate text-xs text-slate-400">
              {match.characterName}
              {match.parallelQuests ? ` · ${match.parallelQuests} quêtes` : ""}
            </p>
          </div>
        </button>
        <div className="mr-4 mt-4 flex shrink-0 flex-wrap items-center justify-end gap-2">
          <Pill tone="cyan">{receiveCount} reçus</Pill>
          <Pill tone="gold">{giveCount} donnés</Pill>
          <Pill tone="purple">Score {match.score}</Pill>
        </div>
      </div>
      <div className="grid gap-px border-t border-white/10 bg-white/10 sm:grid-cols-2">
        <TradeMonsterList
          title="À recevoir"
          subtitle="Mobs proposés par ce joueur"
          tone="cyan"
          monsters={match.theyHaveYouWant}
          monsterRefs={monsterRefs}
        />
        <TradeMonsterList
          title="À donner"
          subtitle="Mobs recherchés par ce joueur"
          tone="gold"
          monsters={match.youHaveTheyWant}
          monsterRefs={monsterRefs}
        />
      </div>
      {match.lastActive && (
        <p className="border-t border-white/10 px-4 py-3 text-[11px] text-slate-500">
          Dernière activité: {formatDate(match.lastActive)}
        </p>
      )}
    </Panel>
  );
}

function TradeMonsterList({
  title,
  subtitle,
  monsters,
  monsterRefs,
  tone,
}: {
  title: string;
  subtitle: string;
  monsters: MetamobTradeMatch["theyHaveYouWant"];
  monsterRefs: MonsterRefIndex;
  tone: "cyan" | "gold";
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const hasMany = monsters.length > 5;
  const visibleMonsters = hasMany ? monsters.slice(0, 4) : monsters;

  return (
    <div className="bg-void-900/70 p-3">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{title}</p>
          <p className="mt-0.5 truncate text-[11px] text-slate-500">{subtitle}</p>
        </div>
        <Pill tone={tone} className="shrink-0">
          {monsters.length}
        </Pill>
      </div>
      {monsters.length === 0 ? (
        <p className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-slate-500">Aucun monstre.</p>
      ) : (
        <>
          <ul className="space-y-2">
            {visibleMonsters.map((m) => (
              <TradeMonsterRow key={m.id} monster={m} monsterRefs={monsterRefs} tone={tone} />
            ))}
          </ul>
          {hasMany && (
            <button
              onClick={() => setModalOpen(true)}
              className="no-drag mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-glow-purple/35 hover:bg-white/10"
            >
              Voir les {monsters.length} mobs
            </button>
          )}
        </>
      )}
      {modalOpen && (
        <TradeMonsterModal
          title={title}
          subtitle={subtitle}
          monsters={monsters}
          monsterRefs={monsterRefs}
          tone={tone}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

function TradeMonsterRow({
  monster,
  monsterRefs,
  tone,
}: {
  monster: MetamobTradeMatch["theyHaveYouWant"][number];
  monsterRefs: MonsterRefIndex;
  tone: "cyan" | "gold";
}) {
  const target = tradeMonsterTarget(monster, monsterRefs);
  return (
    <li className="grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-2 rounded-xl border border-white/10 bg-black/20 p-2 text-xs transition hover:border-white/20 hover:bg-white/[0.04]">
      <MonsterOpenThumb
        target={target}
        size="sm"
        muted={!monster.coversNeed}
        className={clsx(
          monster.coversNeed
            ? tone === "cyan"
              ? "border-glow-cyan/30 bg-glow-cyan/[0.08]"
              : "border-glow-gold/30 bg-glow-gold/[0.08]"
            : "border-white/10 bg-black/20",
          "hover:border-glow-purple/50 hover:bg-glow-purple/10",
        )}
      />
      <span className="min-w-0">
        <span className="block truncate font-semibold text-slate-200" title={monster.name}>
          {monster.name}
        </span>
        <span className="mt-0.5 block truncate text-[10px] text-slate-500">
          {monster.coversNeed ? "Échange utile" : "Besoin partiel"}
        </span>
      </span>
      <Pill tone={monster.coversNeed ? "emerald" : tone} className="shrink-0">
        {monster.available}/{monster.needed}
      </Pill>
    </li>
  );
}

function TradeMonsterModal({
  title,
  subtitle,
  monsters,
  monsterRefs,
  tone,
  onClose,
}: {
  title: string;
  subtitle: string;
  monsters: MetamobTradeMatch["theyHaveYouWant"];
  monsterRefs: MonsterRefIndex;
  tone: "cyan" | "gold";
  onClose: () => void;
}) {
  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[65] grid place-items-center bg-void-900/80 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          onClick={(e) => e.stopPropagation()}
          className="glass max-h-[82vh] w-full max-w-3xl overflow-hidden p-0"
        >
          <div className="flex items-start justify-between gap-3 border-b border-white/10 p-4">
            <div className="min-w-0">
              <p className="font-display text-lg font-bold text-white">{title}</p>
              <p className="mt-0.5 text-sm text-slate-400">
                {subtitle} · {monsters.length} mobs
              </p>
            </div>
            <button
              onClick={onClose}
              className="no-drag shrink-0 rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="max-h-[68vh] overflow-y-auto p-4">
            <ul className="grid gap-2 md:grid-cols-2">
              {monsters.map((monster) => (
                <TradeMonsterRow key={monster.id} monster={monster} monsterRefs={monsterRefs} tone={tone} />
              ))}
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}

// Types de monstres Metamob (ids figés : 1 = monstre, 2 = boss, 3 = archimonstre).
const ZONE_TYPES: [string, string][] = [
  ["all", "Tous les types"],
  ["1", "Monstres"],
  ["2", "Boss"],
  ["3", "Archimonstres"],
];

function ZonesPanel({ slug, apiKey }: { slug: string; apiKey: string }) {
  const [typeFilter, setTypeFilter] = useState("all");
  const typeId = typeFilter === "all" ? undefined : Number(typeFilter);
  const zonesQuery = useQuery({
    queryKey: ["mm-zones", slug, typeFilter],
    queryFn: ({ signal }) => getMetamobZones(slug, apiKey, { monsterTypeId: typeId, signal }),
    staleTime: 1000 * 60 * 10,
  });
  const zones = zonesQuery.data ?? [];

  return (
    <div className="space-y-3">
      <Panel className="flex flex-wrap items-end justify-between gap-3 p-4">
        <div>
          <p className="font-display text-lg font-bold text-white">Progression par zones</p>
          <p className="mt-1 text-sm text-slate-400">Sous-zones triées par Metamob, les moins avancées en premier.</p>
        </div>
        <SelectField label="Type" value={typeFilter} onChange={setTypeFilter} options={ZONE_TYPES} />
      </Panel>

      {zonesQuery.isLoading ? (
        <Panel>
          <Spinner label="Chargement des zones Metamob…" />
        </Panel>
      ) : zonesQuery.isError ? (
        <ErrorState message={(zonesQuery.error as Error)?.message} onRetry={() => zonesQuery.refetch()} />
      ) : zones.length === 0 ? (
        <EmptyState title="Aucune zone" hint="Aucune progression disponible pour ce filtre." />
      ) : (
        <div className="space-y-3">
          {zones.map((zone) => (
            <ZoneCard key={zone.id} zone={zone} />
          ))}
        </div>
      )}
    </div>
  );
}

function ZoneCard({ zone }: { zone: MetamobZone }) {
  const done = zone.total > 0 && zone.completed >= zone.total;
  return (
    <Panel className="overflow-hidden p-4">
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div
            className={clsx(
              "grid h-9 w-9 shrink-0 place-items-center rounded-xl border",
              done ? "border-glow-emerald/30 bg-glow-emerald/10" : "border-white/10 bg-white/[0.04]",
            )}
          >
            <Compass className={clsx("h-4 w-4", done ? "text-glow-emerald" : "text-slate-300")} />
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-base font-bold text-white">{zone.name}</p>
            <p className="text-xs text-slate-500">{zone.completed}/{zone.total} sous-zones validées</p>
          </div>
        </div>
        <ProgressPill completed={zone.completed} total={zone.total} />
      </div>
      <div className="mb-3">
        <ProgressBar completed={zone.completed} total={zone.total} />
      </div>
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {zone.subzones.map((subzone) => {
          const subDone = subzone.total > 0 && subzone.completed >= subzone.total;
          return (
            <div
              key={subzone.id}
              className={clsx(
                SUBTLE_PANEL,
                "p-3",
                subDone && "border-glow-emerald/25 bg-glow-emerald/[0.05]",
              )}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="min-w-0 truncate text-sm font-semibold text-slate-200">{subzone.name}</p>
                <span className={clsx("shrink-0 text-xs font-semibold", subDone ? "text-glow-emerald" : "text-slate-500")}>
                  {subzone.completed}/{subzone.total}
                </span>
              </div>
              <ProgressBar completed={subzone.completed} total={subzone.total} />
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {subzone.monsters.slice(0, 8).map((m) => {
                  const ok = m.zoneStatus === "completed" || m.zoneStatus === "validated" || m.owned >= m.required;
                  return (
                    <MonsterOpenThumb
                      key={m.id}
                      target={m}
                      size="sm"
                      muted={!ok}
                      className={clsx(
                        ok ? "border-glow-emerald/30 bg-glow-emerald/[0.08]" : "border-white/10 bg-black/20",
                        "hover:border-glow-purple/50 hover:bg-glow-purple/10",
                      )}
                    >
                      <span
                        className={clsx(
                          "absolute -bottom-1 -right-1 rounded-full px-1 text-[9px] font-bold leading-tight ring-2 ring-void-900",
                          ok ? "bg-glow-emerald/90 text-void-900" : "bg-white/15 text-slate-200",
                        )}
                      >
                        {m.owned}
                      </span>
                    </MonsterOpenThumb>
                  );
                })}
                {subzone.monsters.length > 8 && (
                  <span className="grid h-9 place-items-center px-1 text-[10px] font-semibold text-slate-500">
                    +{subzone.monsters.length - 8}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function KralaPanel({ apiKey, serverId, serverName }: { apiKey: string; serverId?: number; serverName?: string }) {
  const [from, setFrom] = useState(todayIso());
  const [serverFilter, setServerFilter] = useState(serverId ? String(serverId) : "");
  const serversQuery = useQuery({
    queryKey: ["mm-servers"],
    queryFn: ({ signal }) => getMetamobServers(apiKey, signal),
    staleTime: 1000 * 60 * 60,
  });
  const servers = serversQuery.data ?? [];
  const kraloveQuery = useQuery({
    queryKey: ["mm-kralove", serverFilter || "all", from],
    queryFn: ({ signal }) =>
      getMetamobKraloveEvents(apiKey, {
        serverId: serverFilter ? Number(serverFilter) : undefined,
        from,
        signal,
      }),
    staleTime: 1000 * 60 * 5,
  });
  const events = kraloveQuery.data ?? [];
  const selectedServerName =
    serverFilter && servers.length > 0
      ? servers.find((s) => String(s.id) === serverFilter)?.name
      : serverName;
  const upcomingEvents = useMemo(() => events.filter((event) => eventTime(event) >= Date.now()), [events]);
  const nextEvent = useMemo(() => [...upcomingEvents].sort((a, b) => eventTime(a) - eventTime(b))[0], [upcomingEvents]);
  const participantsTotal = events.reduce((sum, event) => sum + event.participantsCount, 0);
  const charactersTotal = events.reduce((sum, event) => sum + event.characterCount, 0);

  return (
    <div className="space-y-4">
      <Panel className="overflow-hidden p-0">
        <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="flex min-w-0 gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-glow-cyan/30 bg-glow-cyan/[0.08]">
              <CalendarDays className="h-6 w-6 text-glow-cyan" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-xl font-extrabold text-white">Calendrier Kralamoure</p>
              <p className="mt-1 max-w-2xl text-sm text-slate-400">
                Ouvertures déclarées sur Metamob{selectedServerName ? ` pour ${selectedServerName}` : ""}.
              </p>
              {nextEvent && (
                <div className="mt-3 inline-flex max-w-full items-center gap-2 rounded-xl border border-glow-emerald/25 bg-glow-emerald/[0.07] px-3 py-2 text-xs text-slate-300">
                  <Clock className="h-3.5 w-3.5 shrink-0 text-glow-emerald" />
                  <span className="truncate">
                    Prochaine ouverture: <span className="font-semibold text-white">{formatDate(nextEvent.datetime)}</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_170px]">
            <SelectField
              label="Serveur"
              value={serverFilter}
              onChange={setServerFilter}
              options={[
                ["", serversQuery.isLoading ? "Chargement..." : "Tous les serveurs"],
                ...servers.map((s) => [String(s.id), `${s.name}${s.community ? ` · ${s.community}` : ""}`] as [string, string]),
              ]}
            />
            <label className="block">
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">Depuis</span>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value || todayIso())}
                className="no-drag w-full rounded-lg border border-white/10 bg-void-800/70 px-3 py-2.5 text-xs font-semibold text-slate-200 outline-none focus:border-glow-purple/50"
              />
            </label>
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <button
                onClick={() => setFrom(todayIso())}
                className="no-drag rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                Aujourd'hui
              </button>
              <button
                onClick={() => setServerFilter("")}
                disabled={!serverFilter}
                className="no-drag rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Tous les serveurs
              </button>
            </div>
          </div>
        </div>

        <div className="grid border-t border-white/10 bg-black/15 sm:grid-cols-4">
          <KralaStat label="Événements" value={String(events.length)} />
          <KralaStat label="À venir" value={String(upcomingEvents.length)} tone="emerald" />
          <KralaStat label="Joueurs inscrits" value={String(participantsTotal)} tone="cyan" />
          <KralaStat label="Personnages" value={String(charactersTotal)} tone="purple" />
        </div>
      </Panel>

      {kraloveQuery.isLoading ? (
        <Panel>
          <Spinner label="Chargement du calendrier Krala…" />
        </Panel>
      ) : kraloveQuery.isError ? (
        <ErrorState message={(kraloveQuery.error as Error)?.message} onRetry={() => kraloveQuery.refetch()} />
      ) : events.length === 0 ? (
        <EmptyState title="Aucun événement Krala" hint="Changez la date ou affichez tous les serveurs." />
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <KralaEventCard key={event.id} event={event} apiKey={apiKey} />
          ))}
        </div>
      )}
    </div>
  );
}

function KralaEventCard({ event, apiKey }: { event: MetamobKraloveEvent; apiKey: string }) {
  const [open, setOpen] = useState(false);
  const detailQuery = useQuery({
    queryKey: ["mm-kralove-detail", event.id],
    queryFn: ({ signal }) => getMetamobKraloveEvent(event.id, apiKey, signal),
    enabled: open,
    staleTime: 1000 * 60 * 5,
  });
  const detail = detailQuery.data ?? event;
  const isPast = eventTime(event) < Date.now();
  const day = formatDatePart(event.datetime);
  const time = formatTimePart(event.datetime);

  return (
    <Panel className={clsx("overflow-hidden p-0", isPast ? "opacity-75" : "border-glow-cyan/20")}>
      <div className="grid gap-4 p-4 lg:grid-cols-[88px_minmax(0,1fr)_auto] lg:items-center">
        <div className="grid h-20 w-20 place-items-center rounded-2xl border border-white/10 bg-black/25 text-center">
          <span>
            <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-500">{day}</span>
            <span className="mt-1 block font-display text-xl font-extrabold text-white">{time}</span>
          </span>
        </div>
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Pill tone={isPast ? "slate" : "emerald"}>{isPast ? "Passé" : "À venir"}</Pill>
            <Pill tone="cyan">
              <MapPin className="h-3 w-3" /> {event.server}
            </Pill>
          </div>
          <p className="truncate font-display text-base font-bold text-white" title={event.description || "Ouverture Kralamoure"}>
            {event.description || "Ouverture Kralamoure"}
          </p>
          <p className="mt-1 truncate text-xs text-slate-500">
            {event.creator ? `Créé par ${event.creator}` : "Créateur non renseigné"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <KralaMiniPill icon={Users} label={`${event.participantsCount} joueurs`} tone="cyan" />
          <KralaMiniPill iconName="character" label={`${event.characterCount} persos`} tone="purple" />
          <KralaMiniPill iconName="dofusQuest" label={`${event.messagesCount} messages`} tone="slate" />
          <button
            onClick={() => setOpen((v) => !v)}
            className="no-drag rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10"
          >
            {open ? "Masquer" : "Détails"}
          </button>
        </div>
      </div>
      {open && (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {detailQuery.isLoading ? (
            <div className="md:col-span-2">
              <DofusLoader label="Chargement des détails Krala…" className="rounded-xl border border-white/10 bg-black/20 py-8" />
            </div>
          ) : detailQuery.isError ? (
            <p className="text-sm text-glow-rose">{(detailQuery.error as Error).message}</p>
          ) : (
            <>
              <div className={clsx(SUBTLE_PANEL, "p-3")}>
                <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
                  <Users className="h-3.5 w-3.5" /> Participants
                </p>
                {(detail.participants ?? []).length === 0 ? (
                  <p className="text-xs text-slate-500">Aucun participant affiché.</p>
                ) : (
                  <ul className="max-h-60 space-y-1.5 overflow-y-auto pr-1">
                    {(detail.participants ?? []).map((p) => (
                      <li key={p.username} className="flex items-center justify-between gap-2 rounded-lg bg-black/20 px-2.5 py-2 text-xs">
                        <span className="truncate font-semibold text-slate-300">{p.username}</span>
                        <Pill tone="purple">{p.characterCount} persos</Pill>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className={clsx(SUBTLE_PANEL, "p-3")}>
                <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
                  <DofusIcon name="dofusQuest" size={14} /> Messages
                </p>
                {(detail.messages ?? []).length === 0 ? (
                  <p className="text-xs text-slate-500">Aucun message affiché.</p>
                ) : (
                  <ul className="max-h-60 space-y-2 overflow-y-auto pr-1">
                    {(detail.messages ?? []).map((m, i) => (
                      <li key={`${m.username}:${m.createdAt}:${i}`} className="rounded-lg bg-black/20 px-2.5 py-2 text-xs">
                        <p className="flex items-center justify-between gap-2 font-semibold text-slate-300">
                          <span className="truncate">{m.username}</span>
                          <span className="shrink-0 text-[10px] font-medium text-slate-600">{formatShortDate(m.createdAt)}</span>
                        </p>
                        <p className="mt-1 whitespace-pre-line text-slate-500">{m.content}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </Panel>
  );
}

function KralaStat({
  label,
  value,
  tone = "slate",
}: {
  label: string;
  value: string;
  tone?: "slate" | "cyan" | "purple" | "emerald";
}) {
  const tones = {
    slate: "text-slate-200",
    cyan: "text-glow-cyan",
    purple: "text-glow-violet",
    emerald: "text-glow-emerald",
  };
  return (
    <div className="border-white/10 px-4 py-3 sm:border-r last:border-r-0">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className={clsx("mt-1 font-display text-2xl font-extrabold leading-none", tones[tone])}>{value}</p>
    </div>
  );
}

function KralaMiniPill({
  icon: Icon,
  iconName,
  label,
  tone,
}: {
  icon?: TabIcon;
  iconName?: DofusIconName;
  label: string;
  tone: "cyan" | "purple" | "slate";
}) {
  const tones = {
    cyan: "border-glow-cyan/25 bg-glow-cyan/[0.08] text-glow-cyan",
    purple: "border-glow-purple/25 bg-glow-purple/[0.08] text-glow-violet",
    slate: "border-white/10 bg-white/[0.05] text-slate-300",
  };
  return (
    <span className={clsx("inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold", tones[tone])}>
      {Icon ? <Icon className="h-3.5 w-3.5" /> : iconName ? <DofusIcon name={iconName} size={14} /> : null}
      {label}
    </span>
  );
}

function todayIso(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function parseMetamobDate(value: string): Date {
  return new Date(value.includes("T") ? value : value.replace(" ", "T"));
}

function eventTime(event: MetamobKraloveEvent): number {
  const time = parseMetamobDate(event.datetime).getTime();
  return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time;
}

function formatDate(value: string): string {
  const d = parseMetamobDate(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

function formatDatePart(value: string): string {
  const d = parseMetamobDate(value);
  if (Number.isNaN(d.getTime())) return "Date";
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(d);
}

function formatTimePart(value: string): string {
  const d = parseMetamobDate(value);
  if (Number.isNaN(d.getTime())) return "--:--";
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function formatShortDate(value: string): string {
  const d = parseMetamobDate(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function progressPct(completed: number, total: number): number {
  return total > 0 ? Math.max(0, Math.min(100, Math.round((completed / total) * 100))) : 0;
}

function ProgressPill({ completed, total }: { completed: number; total: number }) {
  return <Pill tone={completed >= total && total > 0 ? "emerald" : "purple"}>{progressPct(completed, total)}%</Pill>;
}

function ProgressBar({ completed, total }: { completed: number; total: number }) {
  const pct = progressPct(completed, total);
  const done = total > 0 && completed >= total;
  return (
    <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
      <div
        className={clsx(
          "h-full rounded-full transition-all",
          done ? "bg-glow-emerald" : "bg-gradient-to-r from-glow-purple to-glow-cyan",
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// Statut d'échange AUTOMATIQUE d'un monstre selon la quantité possédée `owned` et le nombre de
// quêtes parallèles `parallel` : il faut `need` exemplaires (1 par quête) ; au-delà on PROPOSE le
// surplus, en dessous on RECHERCHE le manque, à égalité c'est neutre (« normal »). Reproduit le
// calcul que Metamob applique côté serveur quand la quantité change.
function autoTradeFor(m: MetamobMonster, owned: number, parallel: number): MetamobMonster {
  const need = Math.max(1, parallel);
  const offered = Math.max(0, owned - need);
  const wanted = Math.max(0, need - owned);
  return {
    ...m,
    owned,
    offered,
    wanted,
    status: offered > 0 ? "offered" : wanted > 0 ? "wanted" : "none",
    statusValue: offered > 0 ? offered : wanted > 0 ? -wanted : 0,
  };
}

function loadFilterPresets(): FilterPreset[] {
  try {
    const raw = localStorage.getItem(FILTER_PRESETS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.slice(0, 12) : [];
  } catch {
    return [];
  }
}

function storeFilterPresets(presets: FilterPreset[]) {
  try {
    localStorage.setItem(FILTER_PRESETS_KEY, JSON.stringify(presets));
  } catch {
    /* localStorage indisponible */
  }
}

function QuestMetric({
  label,
  value,
  tone = "purple",
}: {
  label: string;
  value: string;
  tone?: "purple" | "cyan" | "gold" | "emerald" | "rose" | "slate";
}) {
  return (
    <Panel className="p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 truncate font-display text-xl font-bold text-white">{value}</p>
      <div className="mt-3">
        <Pill tone={tone}>Metamob</Pill>
      </div>
    </Panel>
  );
}

function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx(SURFACE, className)}>{children}</div>;
}

function DashboardStat({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  tone: "purple" | "cyan" | "gold" | "slate";
}) {
  const tones: Record<typeof tone, { text: string; dot: string }> = {
    purple: { text: "text-glow-violet", dot: "bg-glow-purple" },
    cyan: { text: "text-glow-cyan", dot: "bg-glow-cyan" },
    gold: { text: "text-glow-gold", dot: "bg-glow-gold" },
    slate: { text: "text-slate-200", dot: "bg-slate-400" },
  };
  return (
    <div className="border-white/10 p-4 transition-colors hover:bg-white/[0.02] sm:border-r last:border-r-0">
      <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        <span className={clsx("h-1.5 w-1.5 rounded-full", tones[tone].dot)} />
        {label}
      </p>
      <p className={clsx("mt-1.5 font-display text-2xl font-extrabold leading-none", tones[tone].text)}>{value}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <div className="flex items-center rounded-lg border border-white/10 bg-void-800/70 px-3 focus-within:border-glow-purple/50">
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value) || min)))}
          className="no-drag min-w-0 flex-1 bg-transparent py-2.5 text-xs font-semibold text-slate-200 outline-none"
        />
        {suffix && <span className="text-xs font-semibold text-slate-500">{suffix}</span>}
      </div>
    </label>
  );
}

function NullableNumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | "";
  onChange: (value: number | "") => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <input
        type="number"
        min={0}
        max={30}
        value={value}
        onChange={(e) => onChange(e.target.value === "" ? "" : Math.max(0, Math.min(30, Number(e.target.value) || 0)))}
        placeholder="Auto"
        className="no-drag w-full rounded-lg border border-white/10 bg-void-800/70 px-3 py-2.5 text-xs font-semibold text-slate-200 outline-none focus:border-glow-purple/50"
      />
    </label>
  );
}

function TradeRuleBlock({
  title,
  offer,
  want,
  onOffer,
  onWant,
}: {
  title: string;
  offer: boolean;
  want: boolean;
  onOffer: (value: boolean) => void;
  onWant: (value: boolean) => void;
}) {
  return (
    <div className={clsx(SUBTLE_PANEL, "p-3")}>
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">{title}</p>
      <label className="no-drag mb-2 flex items-center gap-2 text-xs font-semibold text-slate-300">
        <input type="checkbox" checked={offer} onChange={(e) => onOffer(e.target.checked)} className="h-4 w-4 accent-glow-purple" />
        Ne jamais proposer
      </label>
      <label className="no-drag flex items-center gap-2 text-xs font-semibold text-slate-300">
        <input type="checkbox" checked={want} onChange={(e) => onWant(e.target.checked)} className="h-4 w-4 accent-glow-purple" />
        Ne jamais rechercher
      </label>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="no-drag w-full rounded-lg border border-white/10 bg-void-800/70 px-3 py-2.5 text-xs font-semibold text-slate-200 outline-none transition focus:border-glow-purple/50"
      >
        {options.map(([key, optionLabel]) => (
          <option key={key} value={key}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "no-drag rounded-lg px-3 py-1.5 text-xs font-semibold transition",
        active ? "bg-glow-purple/25 text-white ring-1 ring-glow-purple/50" : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200",
      )}
    >
      {children}
    </button>
  );
}

function MetaBadge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">{children}</span>;
}

function TutorialStep({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5 leading-relaxed">
      <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-glow-purple to-glow-cyan text-[11px] font-bold text-white shadow-[0_0_10px_-2px_rgba(124,92,255,0.8)]">
        {n}
      </span>
      <span>{children}</span>
    </li>
  );
}

// Avatar joueur : affiche l'image Metamob si dispo, sinon un générique (initiale).
function Avatar({ src, name, size = 44, className }: { src?: string; name: string; size?: number; className?: string }) {
  const [broken, setBroken] = useState(false);
  const show = !!src && !broken;
  const initial = (name.trim()[0] ?? "?").toUpperCase();
  return (
    <span
      className={clsx(
        "grid shrink-0 place-items-center overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-glow-purple/20 to-glow-cyan/10",
        className,
      )}
      style={{ height: size, width: size }}
    >
      {show ? (
        <img
          src={src}
          alt={name}
          loading="lazy"
          className="h-full w-full object-contain"
          onError={() => setBroken(true)}
        />
      ) : (
        <span className="font-display font-bold text-glow-violet" style={{ fontSize: size * 0.4 }}>
          {initial}
        </span>
      )}
    </span>
  );
}

// Profil public d'un joueur (nouvelle fonctionnalité, endpoint GET /users/{username}).
function ProfileModal({ username, apiKey, onClose }: { username: string; apiKey: string; onClose: () => void }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["mm-user", username],
    queryFn: ({ signal }) => getMetamobUser(username, apiKey, signal),
    staleTime: 1000 * 60 * 5,
  });

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[65] grid place-items-center bg-void-900/80 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          onClick={(e) => e.stopPropagation()}
          className="glass relative max-h-[80vh] w-full max-w-lg overflow-y-auto p-5"
        >
          <button
            onClick={onClose}
            className="no-drag absolute right-3 top-3 rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          {isLoading ? (
            <Spinner label="Chargement du profil…" />
          ) : isError || !data ? (
            <p className="py-8 text-center text-sm text-glow-rose">
              {(error as Error)?.message ?? "Profil introuvable."}
            </p>
          ) : (
            <>
              <div className="flex items-center gap-4 pr-6">
                <Avatar src={data.avatar} name={data.username} size={64} />
                <div className="min-w-0">
                  <p className="truncate font-display text-xl font-extrabold text-white">{data.username}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                    {data.lastActive && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> Actif {formatDate(data.lastActive)}
                      </span>
                    )}
                    {data.createdAt && <span>Membre depuis {formatDate(data.createdAt)}</span>}
                  </div>
                </div>
              </div>

              {data.bio && (
                <p className="mt-4 whitespace-pre-line rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-slate-300">
                  {data.bio}
                </p>
              )}

              <p className="mb-2 mt-5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Chasses publiques ({data.quests.length})
              </p>
              {data.quests.length === 0 ? (
                <p className="text-sm text-slate-500">Aucune chasse publique.</p>
              ) : (
                <ul className="space-y-2">
                  {data.quests.map((q) => (
                    <li key={q.slug} className={clsx(SUBTLE_PANEL, "flex items-center justify-between gap-2 p-3")}>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-200">{q.characterName}</p>
                        <p className="truncate text-xs text-slate-500">
                          {q.server ?? "—"}
                          {q.currentStep ? ` · étape ${q.currentStep}` : ""}
                        </p>
                      </div>
                      {q.parallelQuests ? <Pill tone="purple">{q.parallelQuests} quêtes</Pill> : null}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}

function TabChip({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon?: TabIcon;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "no-drag inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition",
        active
          ? "bg-glow-purple/20 text-white ring-1 ring-glow-purple/50 shadow-[0_0_18px_-6px_rgba(124,92,255,0.7)]"
          : "text-slate-400 hover:bg-white/[0.07] hover:text-slate-200",
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </button>
  );
}

const STATUS_META: Record<"wanted" | "offered", { label: string; cls: string }> = {
  wanted: { label: "Recherché", cls: "border-glow-cyan/40 bg-glow-cyan/15 text-glow-cyan" },
  offered: { label: "Proposé", cls: "border-glow-gold/40 bg-glow-gold/15 text-glow-gold" },
};

type MonsterOpenTarget = {
  name: string;
  img?: string;
  codexMonsterId?: number;
  typeId?: number;
  levelMin?: number;
  levelMax?: number;
};

type MonsterThumbSize = "sm" | "md" | "lg";

const MONSTER_THUMB_SIZE: Record<MonsterThumbSize, { frame: string; img: string; icon: number; spinner: string }> = {
  sm: { frame: "h-9 w-9 rounded-lg", img: "h-7 w-7", icon: 17, spinner: "h-3.5 w-3.5" },
  md: { frame: "h-10 w-10 rounded-xl", img: "h-8 w-8", icon: 19, spinner: "h-4 w-4" },
  lg: { frame: "h-14 w-14 rounded-xl", img: "h-11 w-11", icon: 24, spinner: "h-4 w-4" },
};

function monsterIconName(typeId?: number): DofusIconName {
  if (typeId === 2) return "boss";
  if (typeId === 3) return "archmonster";
  return "monster";
}

function MonsterOpenThumb({
  target,
  size = "sm",
  muted,
  className,
  imgClassName,
  children,
}: {
  target: MonsterOpenTarget;
  size?: MonsterThumbSize;
  muted?: boolean;
  className?: string;
  imgClassName?: string;
  children?: React.ReactNode;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [opening, setOpening] = useState(false);
  const [openError, setOpenError] = useState(false);
  const dims = MONSTER_THUMB_SIZE[size];

  const openMonster = async () => {
    if (opening) return;
    setOpening(true);
    setOpenError(false);
    try {
      const monsterId =
        target.codexMonsterId ??
        (await queryClient.fetchQuery({
          queryKey: [
            "dofusdb-monster-id",
            target.name,
            target.typeId ?? null,
            target.levelMin ?? null,
            target.levelMax ?? null,
          ],
          queryFn: ({ signal }) =>
            resolveMonsterIdByName(
              target.name,
              {
                typeId: target.typeId,
                levelMin: target.levelMin,
                levelMax: target.levelMax,
              },
              signal,
            ),
          staleTime: 1000 * 60 * 60 * 24,
        }));

      if (monsterId) {
        navigate(`/monstres/${monsterId}`, { state: { returnTo: "/metamob", returnLabel: "Retour Metamob" } });
        return;
      }
      setOpenError(true);
    } catch {
      setOpenError(true);
    } finally {
      setOpening(false);
    }
  };

  return (
    <button
      type="button"
      onClick={openMonster}
      disabled={opening}
      aria-label={`Voir ${target.name} dans l'encyclopédie`}
      title={openError ? "Monstre introuvable dans l'encyclopédie" : `Voir ${target.name}`}
      className={clsx(
        "no-drag relative grid shrink-0 place-items-center border transition focus:outline-none focus:ring-2 focus:ring-glow-purple/60 disabled:cursor-wait",
        dims.frame,
        className,
        openError && "border-glow-rose/50 bg-glow-rose/10",
      )}
    >
      {target.img ? (
        <img
          src={target.img}
          alt={target.name}
          loading="lazy"
          className={clsx("object-contain transition", dims.img, muted && "opacity-55 grayscale", opening && "opacity-30", imgClassName)}
          onError={(e) => (e.currentTarget.style.opacity = "0.2")}
        />
      ) : (
        <DofusIcon
          name={monsterIconName(target.typeId)}
          size={dims.icon}
          className={clsx("text-slate-300 transition", muted && "opacity-55 grayscale", opening && "opacity-30")}
        />
      )}
      {opening && <Loader2 className={clsx("absolute animate-spin text-glow-cyan", dims.spinner)} />}
      {children}
    </button>
  );
}

function MonsterCard({
  m,
  index,
  onChange,
}: {
  m: MetamobMonster;
  index: number;
  onChange: (m: MetamobMonster, delta: number) => void;
}) {
  const owned = m.owned > 0;
  // Échange entièrement AUTOMATIQUE : le statut (proposé / recherché) est recalculé depuis la
  // quantité à chaque +/- (voir autoTradeFor). La carte ne fait plus qu'AFFICHER ce statut.
  const badge = m.status !== "none" ? STATUS_META[m.status] : null;
  const exchangeCount = m.status === "wanted" ? m.wanted : m.status === "offered" ? m.offered : 0;
  // « Proposé » passe au vert à partir de 2 (vrai surplus à échanger) ; à 1 il reste doré.
  const badgeCls =
    m.status === "offered" && m.offered >= 2
      ? "border-glow-emerald/40 bg-glow-emerald/15 text-glow-emerald"
      : badge?.cls;

  return (
    <motion.div
      variants={fadeUp}
      custom={index % 20}
      className={clsx(
        "group relative overflow-hidden rounded-2xl border bg-white/[0.03] p-3 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-glow-purple/35 hover:shadow-[0_12px_36px_-14px_rgba(124,92,255,0.5)]",
        owned ? "border-glow-emerald/30 ring-1 ring-glow-emerald/10" : "border-white/10",
      )}
    >
      <div className="grid gap-3 sm:grid-cols-[56px_minmax(0,1fr)_auto]">
        <MonsterOpenThumb
          target={m}
          size="lg"
          muted={!owned}
          className={clsx(
            owned ? "border-glow-emerald/25 bg-glow-emerald/[0.08]" : "border-white/10 bg-black/20",
            "hover:border-glow-purple/50 hover:bg-glow-purple/10",
          )}
          imgClassName={!owned ? "group-hover:opacity-80" : undefined}
        />

        <div className="min-w-0">
          {/* Nom sur sa propre ligne (pleine largeur) → ne se fait plus écraser par le badge. */}
          <p className="truncate text-sm font-bold text-white" title={m.name}>
            {m.name}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-1">
            {badge && (
              <span className={clsx("rounded-md border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide", badgeCls)}>
                {badge.label}
                {exchangeCount > 0 ? ` ×${exchangeCount}` : ""}
              </span>
            )}
            {m.type && <MetaBadge>{m.type}</MetaBadge>}
            {m.step != null && <MetaBadge>Étape {m.step}</MetaBadge>}
            {m.levelMin != null && (
              <MetaBadge>
                Niv. {m.levelMax && m.levelMax !== m.levelMin ? `${m.levelMin}-${m.levelMax}` : m.levelMin}
              </MetaBadge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/20 p-1 sm:justify-end sm:self-center">
          <button
            onClick={() => onChange(m, -1)}
            disabled={m.owned <= 0}
            aria-label="Retirer"
            className="no-drag grid h-8 w-8 place-items-center rounded-lg text-lg font-bold leading-none text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            −
          </button>
          <span
            className={clsx(
              "min-w-[2ch] text-center font-display text-lg font-extrabold tabular-nums",
              owned ? "text-glow-emerald" : "text-slate-500",
            )}
          >
            {m.owned}
          </span>
          <button
            onClick={() => onChange(m, +1)}
            disabled={m.owned >= 30}
            aria-label="Ajouter"
            className="no-drag grid h-8 w-8 place-items-center rounded-lg border border-glow-emerald/30 bg-glow-emerald/15 text-glow-emerald transition hover:bg-glow-emerald/25 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
