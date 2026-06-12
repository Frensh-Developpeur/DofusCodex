import { useCallback, useEffect, useRef, useState } from "react";
import { getWorldGridRange, gridKey, type MapCell } from "../api/dofusdb";

// Chargement des cellules d'un monde À LA DEMANDE, par blocs couvrant le viewport courant
// (au lieu de précharger les ~4669 cellules avant le 1er affichage → carte instantanée).
// On découpe le monde en blocs de BLOCK×BLOCK cellules ; chaque bloc n'est chargé qu'une fois
// (Set des blocs déjà demandés), les tuiles étant ensuite servies par le cache HTTP d'Electron.
const BLOCK = 12;

export function useWorldCells(worldId: number) {
  const [cells, setCells] = useState<Map<string, MapCell>>(new Map());
  const fetched = useRef<Set<string>>(new Set());
  const inflight = useRef(0);
  const [loading, setLoading] = useState(false);

  // Reset au changement de monde.
  useEffect(() => {
    setCells(new Map());
    fetched.current = new Set();
    inflight.current = 0;
    setLoading(false);
  }, [worldId]);

  const ensureRange = useCallback(
    (minX: number, maxX: number, minY: number, maxY: number) => {
      const b0x = Math.floor(minX / BLOCK);
      const b1x = Math.floor(maxX / BLOCK);
      const b0y = Math.floor(minY / BLOCK);
      const b1y = Math.floor(maxY / BLOCK);
      const blocks: [number, number][] = [];
      for (let bx = b0x; bx <= b1x; bx++) {
        for (let by = b0y; by <= b1y; by++) {
          const key = `${bx},${by}`;
          if (!fetched.current.has(key)) {
            fetched.current.add(key);
            blocks.push([bx, by]);
          }
        }
      }
      if (!blocks.length) return;
      for (const [bx, by] of blocks) {
        inflight.current += 1;
        setLoading(true);
        getWorldGridRange(worldId, bx * BLOCK, bx * BLOCK + BLOCK - 1, by * BLOCK, by * BLOCK + BLOCK - 1)
          .then((got) => {
            if (got.length) {
              setCells((prev) => {
                const m = new Map(prev);
                for (const c of got) m.set(gridKey(c.posX, c.posY), c);
                return m;
              });
            }
          })
          .catch(() => {
            fetched.current.delete(`${bx},${by}`); // permet un nouvel essai au prochain pan
          })
          .finally(() => {
            inflight.current -= 1;
            if (inflight.current <= 0) setLoading(false);
          });
      }
    },
    [worldId],
  );

  return { cells, ensureRange, loading };
}
