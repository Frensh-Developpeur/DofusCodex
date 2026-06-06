import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getDbItem } from "../api/dofusdb";
import { levelTone } from "../data/meta";
import DofusIcon, { effectIconFromName } from "../components/DofusIcon";
import DetailBack from "../components/DetailBack";
import { Pill, Spinner } from "../components/ui";

// Page détail d'un objet NON-équipement (ressource, consommable, suiveur, objet divers…),
// via DofusDB. Atteinte via /objets/:id quand ItemDetail détecte que l'id n'est pas un
// équipement. Fetch dédupliqué avec l'aiguilleur (même queryKey ["db-item", id]).
export default function ResourceDetail() {
  const { id: idParam } = useParams();
  const id = Number(idParam);

  const { data: item, isLoading } = useQuery({
    queryKey: ["db-item", id],
    queryFn: ({ signal }) => getDbItem(id, signal),
  });
  const effects = (item?.effects ?? []).filter((e) => e.description?.fr);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl">
      <DetailBack />

      <div className="glass rounded-3xl p-6">
        {isLoading ? (
          <Spinner label="Chargement de l'objet…" />
        ) : !item ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <DofusIcon name="chestGrey" size={40} />
            <p className="text-slate-300">Détails indisponibles</p>
            <p className="max-w-xs text-sm text-slate-500">Cet objet n'existe plus dans l'encyclopédie (id obsolète).</p>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-2xl bg-glow-purple/25 blur-xl" />
                <img src={item.img} alt={item.name.fr} className="relative h-20 w-20 object-contain" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-extrabold leading-tight text-white">{item.name.fr}</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.level > 1 && <Pill tone={levelTone(item.level)}>Niv. {item.level}</Pill>}
                  {item.type?.name?.fr && (
                    <Pill tone="slate">
                      <DofusIcon name="inventory" size={12} /> {item.type.name.fr}
                    </Pill>
                  )}
                </div>
              </div>
            </div>

            {item.description?.fr && (
              <p className="mt-4 text-sm italic leading-relaxed text-slate-400">{item.description.fr}</p>
            )}

            {effects.length > 0 && (
              <div className="mt-5">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
                  <DofusIcon name="characteristic" size={16} /> Effets
                </h3>
                <ul className="space-y-1 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  {effects.map((e, i) => {
                    const ic = effectIconFromName(e.description!.fr);
                    return (
                      <li key={i} className="flex items-center gap-2 text-sm font-medium text-slate-200">
                        {ic && <DofusIcon name={ic} size={15} />}
                        {e.description!.fr}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
