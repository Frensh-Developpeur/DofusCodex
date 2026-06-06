import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search } from "../components/DofusIcons";
import DofusIcon from "../components/DofusIcon";
import {
  listAchievementCategories,
  getAchievementsByIds,
  dungeonsWithMonster,
  type AchievementCategory,
  type Achievement,
} from "../api/dofusdb";
import { SectionHeader, Skeleton, ErrorState, EmptyState, fadeUp } from "../components/ui";
import { useViewState } from "../lib/viewState";

const DUNGEONS_ROOT = 3; // catégorie racine « Donjons »

const DEFAULT_CATEGORY = 15; // « Général » (succès de niveau)

// Nœud d'arbre = catégorie + ses enfants.
type TreeNode = AchievementCategory & { children: AchievementCategory[] };

export default function Achievements() {
  const { data: cats, isLoading, isError, refetch } = useQuery({
    queryKey: ["achievement-categories"],
    queryFn: ({ signal }) => listAchievementCategories(signal),
    staleTime: Infinity,
  });

  const [selected, setSelected] = useViewState<number>("achievements:selected", DEFAULT_CATEGORY);
  const [expanded, setExpanded] = useViewState<Set<number>>("achievements:expanded", new Set());
  const [search, setSearch] = useViewState("achievements:search", "");
  const navigate = useNavigate();
  const [openAch, setOpenAch] = useState<number | null>(null);

  // Construit l'arbre : racines (parentId 0) triées par order, chacune avec ses enfants.
  const tree = useMemo<TreeNode[]>(() => {
    if (!cats) return [];
    const byParent = new Map<number, AchievementCategory[]>();
    for (const c of cats) {
      const arr = byParent.get(c.parentId) ?? [];
      arr.push(c);
      byParent.set(c.parentId, arr);
    }
    const sort = (a: AchievementCategory, b: AchievementCategory) => a.order - b.order;
    return (byParent.get(0) ?? [])
      .sort(sort)
      .map((root) => ({ ...root, children: (byParent.get(root.id) ?? []).sort(sort) }));
  }, [cats]);

  const byId = useMemo(() => new Map((cats ?? []).map((c) => [c.id, c])), [cats]);
  const current = byId.get(selected);

  // Racine de la catégorie courante (remonte parentId jusqu'à 0) → savoir si c'est un donjon.
  const rootId = useMemo(() => {
    let c = current;
    while (c && c.parentId !== 0) c = byId.get(c.parentId);
    return c?.id;
  }, [current, byId]);
  const isDungeonCat = rootId === DUNGEONS_ROOT;

  const {
    data: achievements,
    isLoading: achLoading,
    isError: achError,
    refetch: achRefetch,
  } = useQuery({
    queryKey: ["achievements", selected],
    queryFn: ({ signal }) => getAchievementsByIds(current?.achievementIds ?? [], signal),
    enabled: !!current && current.achievementIds.length > 0,
    staleTime: 1000 * 60 * 30,
  });

  const filtered = useMemo(() => {
    const list = achievements ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (a) => a.name.fr.toLowerCase().includes(q) || a.description.toLowerCase().includes(q),
    );
  }, [achievements, search]);

  const totalPoints = useMemo(() => (achievements ?? []).reduce((s, a) => s + a.points, 0), [achievements]);

  function pickCategory(node: AchievementCategory) {
    if (node.achievementIds.length > 0) {
      setSelected(node.id);
      setSearch("");
      setOpenAch(null);
    }
  }

  function toggleRoot(node: TreeNode) {
    if (node.children.length > 0) {
      setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(node.id)) next.delete(node.id);
        else {
          next.add(node.id);
          // À l'ouverture, si la racine n'a pas de succès direct, on sélectionne le 1er enfant.
          if (node.achievementIds.length === 0 && node.children[0]) pickCategory(node.children[0]);
        }
        return next;
      });
    }
    pickCategory(node);
  }

  return (
    <div>
      <SectionHeader
        eyebrow="Encyclopédie"
        title="Succès"
        subtitle="Tous les succès du jeu, organisés par catégorie — comme dans le jeu."
      />

      {isLoading ? (
        <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
          <Skeleton className="h-[70vh]" />
          <Skeleton className="h-[70vh]" />
        </div>
      ) : isError ? (
        <ErrorState message="Impossible de charger les catégories de succès." onRetry={refetch} />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
          {/* Arbre des catégories */}
          <aside className="lg:sticky lg:top-4 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto">
            <div className="glass rounded-2xl p-2">
              {tree.map((root) => {
                const isOpen = expanded.has(root.id);
                const hasKids = root.children.length > 0;
                const active = selected === root.id;
                return (
                  <div key={root.id}>
                    <button
                      onClick={() => toggleRoot(root)}
                      className={`no-drag flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold transition ${
                        active
                          ? "bg-glow-purple/20 text-white"
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <DofusIcon name="trophy" size={16} />
                      <span className="min-w-0 flex-1 truncate">{root.name.fr}</span>
                      {hasKids && (
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-slate-500 transition ${isOpen ? "rotate-180" : ""}`}
                        />
                      )}
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && hasKids && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-3 border-l border-white/10 pl-2">
                            {root.children.map((child) => {
                              const childActive = selected === child.id;
                              return (
                                <button
                                  key={child.id}
                                  onClick={() => pickCategory(child)}
                                  className={`no-drag flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-[13px] transition ${
                                    childActive
                                      ? "bg-glow-purple/20 font-semibold text-white"
                                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                                  }`}
                                >
                                  <span className="min-w-0 flex-1 truncate">{child.name.fr}</span>
                                  <span className="shrink-0 text-[10px] text-slate-600">
                                    {child.achievementIds.length}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Liste des succès de la catégorie sélectionnée */}
          <section className="min-w-0">
            {/* Bandeau de points (façon DofusDB) */}
            <div className="mb-4 flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-glow-gold/30 bg-gradient-to-r from-glow-gold/15 via-glow-gold/5 to-transparent p-4">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-glow-gold/80">
                  {current?.name.fr ?? "Succès"}
                </p>
                <p className="truncate text-sm text-slate-400">
                  {achievements?.length ?? 0} succès dans cette catégorie
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2 rounded-xl border border-glow-gold/40 bg-void-900/60 px-4 py-2">
                <DofusIcon name="trophy" size={20} />
                <span className="font-display text-2xl font-extrabold text-glow-gold">{totalPoints}</span>
                <span className="text-xs font-semibold text-glow-gold/70">pts</span>
              </div>
            </div>

            {/* Recherche */}
            <div className="relative mb-4">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un succès…"
                className="no-drag w-full rounded-xl border border-white/10 bg-void-800/70 py-2.5 pl-10 pr-3 text-sm text-slate-200 outline-none focus:border-glow-purple/50"
              />
            </div>

            {achLoading ? (
              <div className="space-y-2.5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            ) : achError ? (
              <ErrorState message="Impossible de charger les succès." onRetry={achRefetch} />
            ) : !current || current.achievementIds.length === 0 ? (
              <EmptyState title="Sélectionne une catégorie" hint="Choisis une catégorie de succès à gauche." />
            ) : filtered.length === 0 ? (
              <EmptyState title="Aucun succès" hint="Essaie un autre terme de recherche." />
            ) : (
              <motion.div
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.015 } } }}
                className="space-y-2.5"
              >
                {filtered.map((a, i) => (
                  <AchievementRow
                    key={a.id}
                    a={a}
                    index={i}
                    open={openAch === a.id}
                    onToggle={() => setOpenAch((cur) => (cur === a.id ? null : a.id))}
                    onOpenItem={(itemId) => navigate(`/objets/${itemId}`)}
                    onOpenMonster={(mid) => navigate(`/monstres/${mid}`)}
                    isDungeonCat={isDungeonCat}
                  />
                ))}
              </motion.div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

// Bouton « Voir le donjon » : résout le donjon depuis le boss (monté seulement quand la ligne
// est ouverte → la requête ne part que pour le succès déplié).
function DungeonLink({ bossId }: { bossId: number }) {
  const { data } = useQuery({
    queryKey: ["ach-dungeon", bossId],
    queryFn: ({ signal }) => dungeonsWithMonster(bossId, signal),
    staleTime: 1000 * 60 * 30,
  });
  const dungeon = data?.[0];
  if (!dungeon) return null;
  return (
    <Link
      to={`/donjons/${dungeon.id}`}
      className="no-drag inline-flex items-center gap-1.5 rounded-lg border border-glow-purple/40 bg-glow-purple/15 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-glow-purple/25"
    >
      <DofusIcon name="dungeon" size={14} /> Voir le donjon
    </Link>
  );
}

function AchievementRow({
  a,
  index,
  open,
  onToggle,
  onOpenItem,
  onOpenMonster,
  isDungeonCat,
}: {
  a: Achievement;
  index: number;
  open: boolean;
  onToggle: () => void;
  onOpenItem: (id: number) => void;
  onOpenMonster: (id: number) => void;
  isDungeonCat: boolean;
}) {
  const r = a.rewards;
  const hasRewards =
    r.items.length > 0 || r.titles.length > 0 || r.ornaments.length > 0 || r.xp > 0 || r.kamas > 0;
  const nf = (n: number) => n.toLocaleString("fr-FR");
  const boss = a.monsters[0];
  const showDungeon = isDungeonCat && !!boss;
  const showMonsters = !showDungeon && a.monsters.length > 0;
  return (
    <motion.div
      variants={fadeUp}
      custom={Math.min(index, 12)}
      className={`glass overflow-hidden rounded-2xl transition ${open ? "ring-1 ring-glow-gold/40" : "hover:ring-1 hover:ring-glow-gold/30"}`}
    >
      <button onClick={onToggle} className="no-drag flex w-full items-center gap-4 p-3 text-left">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-void-900/60 ring-1 ring-white/10">
          <img
            src={a.img}
            alt=""
            loading="lazy"
            className="h-10 w-10 object-contain"
            onError={(e) => (e.currentTarget.style.opacity = "0.25")}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display font-semibold leading-snug text-white">{a.name.fr}</p>
          {a.description && (
            <p className={`mt-0.5 text-sm leading-relaxed text-slate-400 ${open ? "" : "line-clamp-2"}`}>
              {a.description}
            </p>
          )}
        </div>
        <span
          className="flex shrink-0 items-center gap-1 rounded-lg border border-glow-gold/30 bg-glow-gold/10 px-2.5 py-1 text-sm font-bold text-glow-gold"
          title={`${a.points} points`}
        >
          {a.points}
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-slate-500 transition ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 border-t border-white/10 px-4 py-3.5">
              {/* Conditions */}
              {a.conditions.length > 0 && (
                <div>
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Conditions</p>
                  <ul className="space-y-1">
                    {a.conditions.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-glow-violet" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Récompenses */}
              {hasRewards && (
                <div>
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Récompenses</p>
                  <div className="flex flex-wrap items-center gap-2">
                    {r.xp > 0 && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-glow-cyan/30 bg-glow-cyan/10 px-2.5 py-1 text-xs font-bold text-glow-cyan">
                        <DofusIcon name="xp" size={14} /> {nf(r.xp)} XP
                      </span>
                    )}
                    {r.kamas > 0 && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-glow-gold/30 bg-glow-gold/10 px-2.5 py-1 text-xs font-bold text-glow-gold">
                        <DofusIcon name="kama" size={14} /> {nf(r.kamas)} Kamas
                      </span>
                    )}
                    {r.items.map((it, i) => (
                      <button
                        key={i}
                        type="button"
                        disabled={!it.id}
                        onClick={() => it.id && onOpenItem(it.id)}
                        className="no-drag flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] py-1 pl-1.5 pr-2.5 transition hover:border-glow-gold/40 hover:bg-white/[0.07] disabled:cursor-default disabled:hover:border-white/10"
                        title={it.id ? `${it.name} — voir le détail` : it.name}
                      >
                        <span className="relative">
                          <img
                            src={it.img}
                            alt=""
                            loading="lazy"
                            className="h-7 w-7 object-contain"
                            onError={(e) => (e.currentTarget.style.opacity = "0.25")}
                          />
                          {it.quantity > 1 && (
                            <span className="absolute -bottom-1 -right-1 rounded bg-void-900 px-1 text-[10px] font-bold text-glow-gold ring-1 ring-glow-gold/40">
                              {it.quantity}
                            </span>
                          )}
                        </span>
                        <span className="max-w-[180px] truncate text-xs font-medium text-slate-200">{it.name}</span>
                      </button>
                    ))}
                    {r.titles.map((t, i) => (
                      <span
                        key={`t${i}`}
                        className="rounded-lg border border-glow-purple/30 bg-glow-purple/10 px-2.5 py-1 text-xs font-medium text-glow-violet"
                      >
                        Titre : {t}
                      </span>
                    ))}
                    {r.ornaments.map((o, i) => (
                      <span
                        key={`o${i}`}
                        className="rounded-lg border border-glow-emerald/30 bg-glow-emerald/10 px-2.5 py-1 text-xs font-medium text-glow-emerald"
                      >
                        Ornement : {o}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Liens : donjon (succès de donjon) ou monstres (succès de monstres) */}
              {(showDungeon || showMonsters) && (
                <div>
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Liens</p>
                  <div className="flex flex-wrap items-center gap-2">
                    {showDungeon && boss && <DungeonLink bossId={boss.id} />}
                    {showMonsters &&
                      a.monsters.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => onOpenMonster(m.id)}
                          className="no-drag inline-flex items-center gap-1.5 rounded-lg border border-glow-rose/30 bg-glow-rose/10 px-2.5 py-1.5 text-xs font-semibold text-glow-rose transition hover:bg-glow-rose/20"
                          title={`Voir ${m.name}`}
                        >
                          <DofusIcon name="monsterGrey" size={14} /> {m.name}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {a.conditions.length === 0 && !hasRewards && !showDungeon && !showMonsters && (
                <p className="text-sm italic text-slate-500">Aucune condition ou récompense particulière.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
