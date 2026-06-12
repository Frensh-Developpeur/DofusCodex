import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronRight } from "../components/DofusIcons";
import DofusIcon from "../components/DofusIcon";
import { SectionHeader, Pill, Spinner, ErrorState } from "../components/ui";
import { useDebounce } from "../hooks/useDebounce";
import WorldMapCanvas from "../components/map/WorldMapCanvas";
import {
  getWorlds,
  getResourceMaps,
  getSubarea,
  getSubareaAnchor,
  getSubareasByIds,
  getMapPositionsByIds,
  getSubareaCells,
  subareasWithMonster,
  dungeonsWithMonster,
  monstersDroppingItem,
  searchItems,
  getItemsByIds,
  getMonstersLite,
  listMonsters,
  listItemTypes,
  browseItems,
  type MapCell,
  type ResourcePin,
  type WorldGeometry,
} from "../api/dofusdb";

type SearchMode = "resource" | "monster" | "metier";

// Métiers de RÉCOLTE → types d'items récoltés (résolus en typeIds via listItemTypes).
const GATHER_JOBS: { label: string; typeNames: string[] }[] = [
  { label: "Bûcheron", typeNames: ["Bois"] },
  { label: "Mineur", typeNames: ["Minerai"] },
  { label: "Paysan", typeNames: ["Céréale"] },
  { label: "Alchimiste", typeNames: ["Plante", "Fleur"] },
  { label: "Pêcheur", typeNames: ["Poisson"] },
];

export default function Carte() {
  const [params, setParams] = useSearchParams();
  const [worldId, setWorldId] = useState(1);
  const [mode, setMode] = useState<SearchMode>("resource");
  const [term, setTerm] = useState("");
  const [gatherJob, setGatherJob] = useState(0); // index dans GATHER_JOBS
  const debounced = useDebounce(term);

  // Sélection courante : une ressource (pins) OU un monstre (zones surlignées).
  const resourceId = params.get("resource") ? Number(params.get("resource")) : null;
  const [resource, setResource] = useState<{ id: number; name: string } | null>(null);
  const [monster, setMonster] = useState<{ id: number; name: string } | null>(null);
  const [selectedCell, setSelectedCell] = useState<MapCell | null>(null);
  // Focus manuel (clic sur une ligne de la liste) — prioritaire sur le recadrage auto (centroïde).
  const [manualFocus, setManualFocus] = useState<{ x: number; y: number; scale?: number } | null>(null);

  const monsterParam = params.get("monster") ? Number(params.get("monster")) : null;

  // Deep-link ?resource=ID : charge le nom et bascule en mode ressource.
  useEffect(() => {
    if (resourceId && resource?.id !== resourceId) {
      setMode("resource");
      getItemsByIds([resourceId])
        .then((r) => r[0] && setResource({ id: r[0].id, name: r[0].name.fr }))
        .catch(() => setResource({ id: resourceId, name: `#${resourceId}` }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resourceId]);

  // Deep-link ?monster=ID : charge le nom et bascule en mode monstre.
  useEffect(() => {
    if (monsterParam && monster?.id !== monsterParam) {
      setMode("monster");
      getMonstersLite([monsterParam])
        .then((r) => r[0] && setMonster({ id: r[0].id, name: r[0].name.fr }))
        .catch(() => setMonster({ id: monsterParam, name: `#${monsterParam}` }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monsterParam]);

  // ── Données carte ─────────────────────────────────────────────────────────
  const worldsQ = useQuery({ queryKey: ["worlds"], queryFn: ({ signal }) => getWorlds(signal), staleTime: Infinity });
  const worlds = worldsQ.data ?? [];
  const geo: WorldGeometry | undefined = worlds.find((w) => w.id === worldId);

  // Pins ressource.
  const pinsQ = useQuery({
    queryKey: ["resource-maps", resource?.id],
    queryFn: ({ signal }) => getResourceMaps(resource!.id, signal),
    enabled: mode === "resource" && resource != null,
    placeholderData: keepPreviousData,
  });
  const pins = useMemo(
    () => (mode === "resource" ? (pinsQ.data ?? []).filter((p) => p.worldMap === worldId) : []),
    [pinsQ.data, mode, worldId],
  );

  // Noms des sous-zones des pins (pour grouper la liste des maps).
  const pinZonesQ = useQuery({
    queryKey: ["pin-zones", resource?.id, pins.length],
    queryFn: ({ signal }) => getSubareasByIds(pins.map((p) => p.subAreaId), signal),
    enabled: mode === "resource" && pins.length > 0,
    staleTime: Infinity,
  });
  const zoneName = useMemo(() => {
    const m = new Map<number, string>();
    for (const z of pinZonesQ.data ?? []) m.set(z.id, z.name.fr);
    return m;
  }, [pinZonesQ.data]);

  // Liste des maps groupées par zone (quantité décroissante), pour le panneau de résultats.
  const groupedPins = useMemo(() => {
    if (mode !== "resource" || !pins.length) return [];
    const groups = new Map<number, { zone: string; pins: ResourcePin[] }>();
    for (const p of pins) {
      const g = groups.get(p.subAreaId) ?? { zone: zoneName.get(p.subAreaId) ?? "Zone inconnue", pins: [] };
      g.pins.push(p);
      groups.set(p.subAreaId, g);
    }
    return [...groups.values()]
      .map((g) => ({ ...g, pins: [...g.pins].sort((a, b) => b.quantity - a.quantity) }))
      .sort((a, b) => b.pins.length - a.pins.length);
  }, [mode, pins, zoneName]);

  // Zones OVERWORLD d'un monstre.
  const monsterZonesQ = useQuery({
    queryKey: ["monster-zones", monster?.id],
    queryFn: ({ signal }) => subareasWithMonster(monster!.id, 50, signal),
    enabled: mode === "monster" && monster != null,
    placeholderData: keepPreviousData,
  });

  // Donjons contenant le monstre (boss de donjon = pas en overworld) + position de leurs entrées.
  const monsterDungeonsQ = useQuery({
    queryKey: ["monster-dungeons-map", monster?.id],
    queryFn: ({ signal }) => dungeonsWithMonster(monster!.id, signal),
    enabled: mode === "monster" && monster != null,
  });
  const entranceIds = useMemo(
    () => (monsterDungeonsQ.data ?? []).map((d) => d.entranceMapId).filter((n): n is number => Number.isFinite(n)),
    [monsterDungeonsQ.data],
  );
  const entrancePosQ = useQuery({
    queryKey: ["dungeon-entrances", entranceIds.join(",")],
    queryFn: ({ signal }) => getMapPositionsByIds(entranceIds, signal),
    enabled: entranceIds.length > 0,
    staleTime: Infinity,
  });

  // Sous-zones surlignées : sélection (clic) + zones overworld du monstre + zones des entrées de donjon.
  const highlightSubareas = useMemo(() => {
    const s = new Set<number>();
    if (selectedCell) s.add(selectedCell.subAreaId);
    if (mode === "monster") {
      for (const z of monsterZonesQ.data ?? []) s.add(z.id);
      for (const e of entrancePosQ.data ?? []) s.add(e.subAreaId);
    }
    return s;
  }, [selectedCell, mode, monsterZonesQ.data, entrancePosQ.data]);

  // Ancre overworld (1re zone qui EST sur la worldmap).
  const firstZoneId = mode === "monster" ? monsterZonesQ.data?.[0]?.id : undefined;
  const anchorQ = useQuery({
    queryKey: ["subarea-anchor", firstZoneId],
    queryFn: ({ signal }) => getSubareaAnchor(firstZoneId!, signal),
    enabled: firstZoneId != null,
    staleTime: Infinity,
  });

  // Cellule de référence du monstre : entrée de donjon en priorité (boss), sinon ancre overworld.
  // Complète (id+subAreaId) pour pouvoir aussi OUVRIR le panneau de zone dessus.
  const monsterAnchor = useMemo(() => {
    if (mode !== "monster") return null;
    const e = entrancePosQ.data?.[0];
    if (e) return { id: e.id, posX: e.posX, posY: e.posY, subAreaId: e.subAreaId, worldMap: e.worldMap };
    const a = anchorQ.data;
    return a ? { id: a.id, posX: a.posX, posY: a.posY, subAreaId: a.subAreaId, worldMap: a.worldMap } : null;
  }, [mode, entrancePosQ.data, anchorQ.data]);

  // Cases du surlignage (récupérées par subAreaId pour le monde courant) → bleu à TOUT zoom.
  const highlightKey = useMemo(() => [...highlightSubareas].sort((a, b) => a - b).join(","), [highlightSubareas]);
  const highlightCellsQ = useQuery({
    queryKey: ["highlight-cells", worldId, highlightKey],
    queryFn: ({ signal }) => getSubareaCells([...highlightSubareas], worldId, signal),
    enabled: highlightSubareas.size > 0,
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });

  // Ressource droppée (pas de récolte) → on la localise via ses monstres droppeurs.
  const noHarvest = mode === "resource" && resource != null && !pinsQ.isFetching && (pinsQ.data?.length ?? 0) === 0;
  const dropperQ = useQuery({
    queryKey: ["resource-droppers", resource?.id],
    queryFn: ({ signal }) => monstersDroppingItem(resource!.id, 18, signal),
    enabled: noHarvest,
    staleTime: Infinity,
  });

  // ── Bascule automatique de monde ───────────────────────────────────────────
  // Une ressource/monstre peut se trouver dans un AUTRE monde (Incarnam, dimensions…).
  // Si le monde courant n'a aucune localisation, on bascule vers celui qui en a (une fois
  // par sélection, pour ne pas se battre avec le sélecteur manuel).
  const switchedResRef = useRef<number | null>(null);
  useEffect(() => {
    if (mode !== "resource" || !resource) return;
    const data = pinsQ.data;
    if (!data?.length || switchedResRef.current === resource.id) return;
    switchedResRef.current = resource.id;
    if (!data.some((p) => p.worldMap === worldId)) {
      const counts = new Map<number, number>();
      for (const p of data) counts.set(p.worldMap, (counts.get(p.worldMap) ?? 0) + 1);
      const best = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
      setWorldId(best);
      setSelectedCell(null);
      setManualFocus(null);
    }
  }, [pinsQ.data, mode, resource, worldId]);

  const switchedMonRef = useRef<number | null>(null);
  useEffect(() => {
    if (mode !== "monster" || !monster || !monsterAnchor) return;
    if (switchedMonRef.current === monster.id) return;
    switchedMonRef.current = monster.id;
    if (monsterAnchor.worldMap !== worldId) {
      setWorldId(monsterAnchor.worldMap);
      setSelectedCell(null);
      setManualFocus(null);
    }
  }, [monsterAnchor, mode, monster, worldId]);

  // À la localisation d'un monstre, on OUVRE aussi le panneau de zone (sur l'ancre), une fois le
  // bon monde affiché — pour voir directement les ressources/monstres du coin sans cliquer.
  const openedMonRef = useRef<number | null>(null);
  useEffect(() => {
    if (mode !== "monster" || !monster || !monsterAnchor) return;
    if (monsterAnchor.worldMap !== worldId || openedMonRef.current === monster.id) return;
    openedMonRef.current = monster.id;
    setSelectedCell({
      id: monsterAnchor.id,
      posX: monsterAnchor.posX,
      posY: monsterAnchor.posY,
      subAreaId: monsterAnchor.subAreaId,
    });
  }, [monsterAnchor, mode, monster, worldId]);

  // Recadrage auto : centroïde des pins (ressource) ou ancre de la zone monstre.
  const computedFocus = useMemo(() => {
    if (!geo) return null;
    if (mode === "resource" && pins.length) {
      const ax = pins.reduce((a, p) => a + p.posX, 0) / pins.length;
      const ay = pins.reduce((a, p) => a + p.posY, 0) / pins.length;
      return { x: geo.origineX + ax * geo.mapWidth, y: geo.origineY + ay * geo.mapHeight, scale: 0.9 };
    }
    if (mode === "monster" && monsterAnchor && monsterAnchor.worldMap === worldId) {
      return {
        x: geo.origineX + monsterAnchor.posX * geo.mapWidth,
        y: geo.origineY + monsterAnchor.posY * geo.mapHeight,
        scale: 1,
      };
    }
    return null;
  }, [geo, mode, pins, monsterAnchor, worldId]);
  // Le focus manuel (clic sur une map de la liste) prime sur le recadrage auto.
  const focusTarget = manualFocus ?? computedFocus;

  // Vole vers une map précise (clic liste) : recadre + sélectionne (highlight + panneau zone).
  const goToMap = (p: ResourcePin) => {
    if (!geo) return;
    setManualFocus({
      x: geo.origineX + p.posX * geo.mapWidth + geo.mapWidth / 2,
      y: geo.origineY + p.posY * geo.mapHeight + geo.mapHeight / 2,
      scale: 1.6,
    });
    setSelectedCell({ id: p.mapId, posX: p.posX, posY: p.posY, subAreaId: p.subAreaId });
  };

  // ── Recherche (dropdown) ────────────────────────────────────────────────
  const itemSearchQ = useQuery({
    queryKey: ["map-item-search", debounced],
    queryFn: ({ signal }) => searchItems(debounced, 12, signal),
    enabled: mode === "resource" && debounced.trim().length >= 2,
  });
  const monsterSearchQ = useQuery({
    queryKey: ["map-monster-search", debounced],
    queryFn: ({ signal }) => listMonsters({ search: debounced, limit: 12 }, signal),
    enabled: mode === "monster" && debounced.trim().length >= 2,
  });

  // ── Mode « Métier » : ressources de récolte d'un métier ────────────────────
  const itemTypesQ = useQuery({ queryKey: ["item-types"], queryFn: ({ signal }) => listItemTypes(signal), staleTime: Infinity });
  const gatherTypeIds = useMemo(() => {
    const names = new Set(GATHER_JOBS[gatherJob]?.typeNames ?? []);
    return (itemTypesQ.data ?? []).filter((t) => names.has(t.name?.fr ?? "")).map((t) => t.id);
  }, [itemTypesQ.data, gatherJob]);
  const metierResQ = useQuery({
    queryKey: ["metier-res", gatherTypeIds.join(","), debounced],
    queryFn: ({ signal }) => browseItems({ typeIds: gatherTypeIds, search: debounced, limit: 50 }, signal),
    enabled: mode === "metier" && gatherTypeIds.length > 0,
    placeholderData: keepPreviousData,
  });

  const pickResource = (id: number, name: string) => {
    switchedResRef.current = null; // re-évaluer la bascule de monde pour cette sélection
    setMode("resource");
    setResource({ id, name });
    setMonster(null);
    setManualFocus(null);
    setSelectedCell(null);
    setTerm("");
    setParams((p) => {
      p.set("resource", String(id));
      p.delete("monster");
      return p;
    });
  };
  const pickMonster = (id: number, name: string) => {
    switchedMonRef.current = null; // re-évaluer la bascule de monde pour cette sélection
    openedMonRef.current = null; // re-ouvrir le panneau de zone
    setMode("monster");
    setMonster({ id, name });
    setResource(null);
    setManualFocus(null);
    setSelectedCell(null);
    setTerm("");
    setParams((p) => {
      p.set("monster", String(id));
      p.delete("resource");
      return p;
    });
  };
  const clearSelection = () => {
    setResource(null);
    setMonster(null);
    setParams((p) => {
      p.delete("resource");
      p.delete("monster");
      return p;
    });
  };

  const activeLabel = mode === "resource" ? resource?.name : monster?.name;
  // URL courante de la carte (avec ?resource/?monster) → sert de cible « Retour » aux fiches
  // ouvertes depuis la carte, pour revenir À LA CARTE (et non à la liste Objets/Monstres).
  const mapUrl = `/carte${params.toString() ? `?${params.toString()}` : ""}`;

  return (
    <div>
      <SectionHeader
        eyebrow="Monde"
        title="Carte du monde"
        subtitle="Explorez le Monde des Douze, repérez où récolter une ressource et où trouver un monstre."
        right={geo ? <Pill tone="cyan">{geo.name.fr}</Pill> : null}
      />

      {/* Barre de recherche + sélecteur de monde — z élevé pour que le menu déroulant passe AU-DESSUS de la carte. */}
      <div className="glass relative z-30 mb-4 flex flex-col gap-3 rounded-2xl p-3 sm:flex-row sm:items-center">
        <div className="flex shrink-0 rounded-lg bg-void-800/60 p-0.5 text-xs font-semibold">
          {(["resource", "monster", "metier"] as SearchMode[]).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setTerm("");
              }}
              className={`no-drag rounded-md px-3 py-1.5 transition ${
                mode === m ? "bg-glow-purple/25 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {m === "resource" ? "Ressource" : m === "monster" ? "Monstre" : "Métier"}
            </button>
          ))}
        </div>

        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder={
              mode === "resource"
                ? "Rechercher une ressource (Fer, Frêne…)"
                : mode === "monster"
                  ? "Rechercher un monstre…"
                  : "Filtrer les ressources du métier…"
            }
            className="no-drag w-full rounded-xl border border-white/10 bg-void-800/60 py-2.5 pl-10 pr-3 text-sm text-slate-200 outline-none transition focus:border-glow-purple/50"
          />
          {/* Dropdown résultats (ressource/monstre) */}
          {mode !== "metier" && term.trim().length >= 2 && (
            <div className="absolute z-50 mt-1 max-h-72 w-full overflow-y-auto rounded-xl border border-white/10 bg-void-900/95 p-1 shadow-xl backdrop-blur">
              {mode === "resource"
                ? (itemSearchQ.data ?? []).map((it) => (
                    <button
                      key={it.id}
                      onClick={() => pickResource(it.id, it.name.fr)}
                      className="no-drag flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-slate-200 transition hover:bg-white/10"
                    >
                      <img src={it.img} alt="" loading="lazy" className="h-7 w-7 object-contain" />
                      <span className="min-w-0 flex-1 truncate">{it.name.fr}</span>
                      <span className="text-[10px] text-slate-500">Niv.{it.level}</span>
                    </button>
                  ))
                : (monsterSearchQ.data?.data ?? []).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => pickMonster(m.id, m.name.fr)}
                      className="no-drag flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-slate-200 transition hover:bg-white/10"
                    >
                      <img src={m.img} alt="" loading="lazy" className="h-7 w-7 object-contain" />
                      <span className="min-w-0 flex-1 truncate">{m.name.fr}</span>
                    </button>
                  ))}
              {((mode === "resource" && itemSearchQ.isFetching) || (mode === "monster" && monsterSearchQ.isFetching)) && (
                <p className="px-2 py-1.5 text-xs text-slate-500">Recherche…</p>
              )}
            </div>
          )}
        </div>

        {worlds.length > 1 && (
          <select
            value={worldId}
            onChange={(e) => {
              setWorldId(Number(e.target.value));
              setSelectedCell(null);
            }}
            className="no-drag shrink-0 rounded-xl border border-white/10 bg-void-800/60 px-3 py-2.5 text-sm text-slate-200 outline-none"
          >
            {worlds.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name.fr}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Chips des métiers de récolte (mode Métier) */}
      {mode === "metier" && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {GATHER_JOBS.map((j, i) => (
            <button
              key={j.label}
              onClick={() => setGatherJob(i)}
              className={`no-drag inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                gatherJob === i
                  ? "bg-glow-purple/25 text-white ring-1 ring-glow-purple/40"
                  : "bg-white/5 text-slate-400 hover:bg-white/10"
              }`}
            >
              <DofusIcon name="job" size={14} /> {j.label}
            </button>
          ))}
        </div>
      )}

      {/* Bandeau sélection active */}
      {activeLabel &&
        (() => {
          const loadingLoc =
            (mode === "resource" && (pinsQ.isFetching || (noHarvest && dropperQ.isFetching))) ||
            (mode === "monster" && (monsterZonesQ.isFetching || monsterDungeonsQ.isFetching || entrancePosQ.isFetching));
          const noLoc =
            !loadingLoc &&
            ((mode === "resource" &&
              (pinsQ.data?.length ?? 0) === 0 &&
              (dropperQ.data?.length ?? 0) === 0) ||
              (mode === "monster" &&
                (monsterZonesQ.data?.length ?? 0) === 0 &&
                (monsterDungeonsQ.data?.length ?? 0) === 0));
          return (
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-300">
              <DofusIcon name={mode === "resource" ? "pin" : "bestiary"} size={15} />
              <span>
                {mode === "resource" ? "Maps contenant" : "Zones où trouver"}{" "}
                <span className="font-semibold text-white">{activeLabel}</span>
                {loadingLoc ? (
                  <span className="ml-1 text-slate-500">— recherche…</span>
                ) : noLoc ? (
                  <span className="ml-1 text-glow-ember">
                    — aucune localisation ({mode === "resource" ? "ni récolte ni drop répertoriés" : "monstre sans zone répertoriée"})
                  </span>
                ) : mode === "resource" && noHarvest ? (
                  <span className="ml-1 text-slate-500">— droppé par {dropperQ.data?.length ?? 0} monstre(s)</span>
                ) : mode === "resource" ? (
                  <span className="ml-1 text-slate-500">— {pins.length} map(s)</span>
                ) : null}
              </span>
              <button onClick={clearSelection} className="no-drag rounded-md p-1 text-slate-400 transition hover:bg-white/10 hover:text-white">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })()}

      {/* Carte + panneau zone */}
      <div className="relative h-[72vh] w-full">
        {worldsQ.isError ? (
          <ErrorState message="Carte indisponible" onRetry={() => worldsQ.refetch()} />
        ) : !geo ? (
          <div className="grid h-full place-items-center rounded-2xl border border-white/10 bg-void-950">
            <Spinner label="Chargement de la carte du monde…" />
          </div>
        ) : (
          <>
            <WorldMapCanvas
              key={worldId}
              geo={geo}
              worldId={worldId}
              pins={pins}
              highlightCells={highlightCellsQ.data}
              focusTarget={focusTarget}
              selectedCell={selectedCell}
              onSelectCell={setSelectedCell}
            />

            {/* Mode Métier : liste des ressources récoltables du métier → clic = pins. */}
            {mode === "metier" && (
              <div className="absolute left-3 top-3 flex max-h-[calc(100%-1.5rem)] w-64 flex-col overflow-hidden rounded-2xl border border-white/10 bg-void-900/95 shadow-2xl backdrop-blur-md">
                <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
                  <DofusIcon name="job" size={14} className="text-glow-purple" />
                  <span className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-200">
                    {GATHER_JOBS[gatherJob].label}
                  </span>
                  {(metierResQ.data?.length ?? 0) > 0 && <Pill tone="purple">{metierResQ.data!.length}</Pill>}
                </div>
                <div className="flex flex-col gap-0.5 overflow-y-auto p-2">
                  {metierResQ.isFetching && !metierResQ.data ? (
                    <p className="px-1 py-1.5 text-xs text-slate-500">Chargement…</p>
                  ) : (metierResQ.data?.length ?? 0) === 0 ? (
                    <p className="px-1 py-1.5 text-xs text-slate-500">Aucune ressource.</p>
                  ) : (
                    metierResQ.data!.map((it) => (
                      <button
                        key={it.id}
                        onClick={() => pickResource(it.id, it.name.fr)}
                        className={`no-drag flex items-center gap-2 rounded-lg px-2 py-1 text-left text-xs transition ${
                          resource?.id === it.id
                            ? "bg-glow-emerald/20 text-white ring-1 ring-glow-emerald/40"
                            : "text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        <img src={it.img} alt="" loading="lazy" className="h-6 w-6 shrink-0 object-contain" />
                        <span className="min-w-0 flex-1 truncate">{it.name.fr}</span>
                        {it.level > 0 && <span className="text-[10px] text-slate-500">Niv.{it.level}</span>}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Liste des maps de la ressource (groupées par zone), cliquables pour y voler. */}
            {mode === "resource" && resource && pins.length > 0 && (
              <div className="absolute left-3 top-3 flex max-h-[calc(100%-1.5rem)] w-64 flex-col overflow-hidden rounded-2xl border border-white/10 bg-void-900/95 shadow-2xl backdrop-blur-md">
                <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
                  <DofusIcon name="pin" size={14} className="text-glow-emerald" />
                  <span className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-200">{resource.name}</span>
                  <Pill tone="emerald">{pins.length}</Pill>
                </div>
                <div className="flex flex-col gap-2 overflow-y-auto p-2">
                  {groupedPins.map((g) => (
                    <div key={g.pins[0].subAreaId}>
                      <p className="px-1 pb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">{g.zone}</p>
                      <div className="flex flex-col gap-0.5">
                        {g.pins.map((p) => (
                          <button
                            key={p.mapId}
                            onClick={() => goToMap(p)}
                            className={`no-drag flex items-center gap-2 rounded-lg px-2 py-1 text-left text-xs transition ${
                              selectedCell?.id === p.mapId
                                ? "bg-glow-cyan/20 text-white ring-1 ring-glow-cyan/40"
                                : "text-slate-300 hover:bg-white/10"
                            }`}
                          >
                            <span className="font-mono">
                              [{p.posX}, {p.posY}]
                            </span>
                            <span className="ml-auto font-bold text-glow-gold">×{p.quantity}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Panneau « Droppé par » (ressource sans récolte) : localiser via ses monstres droppeurs. */}
            {mode === "resource" && resource && noHarvest && (dropperQ.data?.length ?? 0) > 0 && (
              <div className="absolute left-3 top-3 flex max-h-[calc(100%-1.5rem)] w-64 flex-col overflow-hidden rounded-2xl border border-white/10 bg-void-900/95 shadow-2xl backdrop-blur-md">
                <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
                  <DofusIcon name="bestiary" size={14} className="text-glow-rose" />
                  <span className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-200">Droppé par</span>
                  <Pill tone="rose">{dropperQ.data!.length}</Pill>
                </div>
                <div className="flex flex-col gap-0.5 overflow-y-auto p-2">
                  <p className="px-1 pb-1 text-[10px] text-slate-500">Cliquez un monstre pour le localiser sur la carte.</p>
                  {dropperQ.data!.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => pickMonster(m.id, m.name.fr)}
                      className="no-drag group flex items-center gap-2 rounded-lg px-2 py-1 text-left text-xs text-slate-300 transition hover:bg-white/10 hover:text-white"
                    >
                      {m.img && <img src={m.img} alt="" loading="lazy" className="h-6 w-6 shrink-0 object-contain" />}
                      <span className="min-w-0 flex-1 truncate">{m.name.fr}</span>
                      <ChevronRight className="h-3 w-3 shrink-0 text-slate-500 transition group-hover:text-glow-rose" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Panneau donjons (mode monstre) : le monstre est un boss de donjon → liens vers le donjon. */}
            {mode === "monster" && monster && (monsterDungeonsQ.data?.length ?? 0) > 0 && (
              <div className="absolute left-3 top-3 flex max-h-[calc(100%-1.5rem)] w-64 flex-col overflow-hidden rounded-2xl border border-white/10 bg-void-900/95 shadow-2xl backdrop-blur-md">
                <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
                  <DofusIcon name="dungeon" size={14} className="text-glow-rose" />
                  <span className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-200">Donjons</span>
                  <Pill tone="rose">{monsterDungeonsQ.data!.length}</Pill>
                </div>
                <div className="flex flex-col gap-0.5 overflow-y-auto p-2">
                  {monsterDungeonsQ.data!.map((d) => (
                    <Link
                      key={d.id}
                      to={`/donjons/${d.id}`}
                      state={{ returnTo: mapUrl, returnLabel: "Carte" }}
                      className="no-drag group flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-slate-300 transition hover:bg-white/10 hover:text-white"
                    >
                      <DofusIcon name="dungeon" size={14} className="shrink-0 text-slate-500 transition group-hover:text-glow-rose" />
                      <span className="min-w-0 flex-1 truncate">{d.name.fr}</span>
                      <ChevronRight className="h-3 w-3 shrink-0 text-slate-500 transition group-hover:text-glow-rose" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <AnimatePresence>
              {selectedCell && (
                <SubareaPanel
                  key={selectedCell.subAreaId}
                  cell={selectedCell}
                  backTo={mapUrl}
                  onClose={() => setSelectedCell(null)}
                />
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      <p className="mt-2 text-[11px] text-slate-500">
        Les pins marquent les <strong>maps contenant</strong> la ressource (granularité officielle DofusDB), pas chaque nœud individuel.
        Cliquez une map pour voir sa sous-zone.
      </p>
    </div>
  );
}

// Panneau latéral d'une sous-zone (clic sur une map) : nom, niveau, ressources & monstres.
function SubareaPanel({ cell, backTo, onClose }: { cell: MapCell; backTo: string; onClose: () => void }) {
  // Les fiches ouvertes d'ici renvoient « ← Carte » (et non vers la liste Objets/Monstres).
  const back = { returnTo: backTo, returnLabel: "Carte" };
  const subQ = useQuery({
    queryKey: ["subarea", cell.subAreaId],
    queryFn: ({ signal }) => getSubarea(cell.subAreaId, signal),
  });
  const sub = subQ.data;
  const harvQ = useQuery({
    queryKey: ["subarea-items", cell.subAreaId],
    queryFn: ({ signal }) => getItemsByIds((sub?.harvestables ?? []).slice(0, 24), signal),
    enabled: !!sub && (sub.harvestables?.length ?? 0) > 0,
  });
  const monsQ = useQuery({
    queryKey: ["subarea-monsters", cell.subAreaId],
    queryFn: ({ signal }) => getMonstersLite((sub?.monsters ?? []).slice(0, 24), signal),
    enabled: !!sub && (sub.monsters?.length ?? 0) > 0,
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.2 }}
      className="absolute right-3 top-3 flex max-h-[calc(100%-1.5rem)] w-72 flex-col overflow-y-auto rounded-2xl border border-white/10 bg-void-900/95 p-4 shadow-2xl backdrop-blur-md"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-display text-base font-bold leading-tight text-white">{sub?.name?.fr ?? "Sous-zone"}</h3>
        <button onClick={onClose} className="no-drag shrink-0 rounded-md p-1 text-slate-400 transition hover:bg-white/10 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>
      {sub?.level ? <Pill tone="slate">Niv. {sub.level}</Pill> : null}

      {!sub ? (
        <Spinner />
      ) : (
        <>
          {(harvQ.data?.length ?? 0) > 0 && (
            <div className="mt-4">
              <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
                <DofusIcon name="resources" size={13} /> Ressources
              </h4>
              <div className="flex flex-col gap-1">
                {harvQ.data!.map((it) => (
                  <Link
                    key={it.id}
                    to={`/objets/${it.id}`}
                    state={back}
                    className="no-drag group flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-2 py-1 text-xs text-slate-200 transition hover:border-glow-emerald/40 hover:bg-white/5"
                  >
                    <img src={it.img} alt="" loading="lazy" className="h-6 w-6 object-contain" />
                    <span className="min-w-0 flex-1 truncate">{it.name.fr}</span>
                    <ChevronRight className="h-3 w-3 shrink-0 text-slate-500 transition group-hover:text-glow-emerald" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {(monsQ.data?.length ?? 0) > 0 && (
            <div className="mt-4">
              <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
                <DofusIcon name="bestiary" size={13} /> Monstres
              </h4>
              <div className="flex flex-col gap-1">
                {monsQ.data!.map((m) => (
                  <Link
                    key={m.id}
                    to={`/monstres/${m.id}`}
                    state={back}
                    className="no-drag group flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-2 py-1 text-xs text-slate-200 transition hover:border-glow-rose/40 hover:bg-white/5"
                  >
                    <img src={m.img} alt="" loading="lazy" className="h-6 w-6 object-contain" />
                    <span className="min-w-0 flex-1 truncate">{m.name.fr}</span>
                    <ChevronRight className="h-3 w-3 shrink-0 text-slate-500 transition group-hover:text-glow-rose" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!(harvQ.data?.length || monsQ.data?.length) && (
            <p className="mt-4 text-xs text-slate-500">Aucune ressource ni monstre répertorié pour cette sous-zone.</p>
          )}
        </>
      )}
    </motion.div>
  );
}
