// Illustrations officielles de classe (artworks Ankama, hébergées par DofusRoom).
// Pas de renderer 3D public (DofusDB/DofusRoom rendent côté client en PixiJS) → l'artwork
// de classe est la meilleure « image du perso » directement exploitable. Clé = id breed DofusDB.
export const CLASS_ILLUS: Record<number, string> = {
  1: "feca", 2: "osa", 3: "enu", 4: "sram", 5: "xelor", 6: "eca", 7: "eni",
  8: "iop", 9: "cra", 10: "sadi", 11: "sacrieur", 12: "panda", 13: "roublard",
  14: "zobal", 15: "steamer", 16: "elio", 17: "hupper", 18: "ouginak", 20: "forgelance",
};

export const classIllus = (id: number | null | undefined): string | null =>
  id != null && CLASS_ILLUS[id]
    ? `https://www.dofusroom.com/img/assets/characters/illus/${CLASS_ILLUS[id]}.jpg`
    : null;
