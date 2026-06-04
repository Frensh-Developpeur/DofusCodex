// Génère les visuels de l'installeur NSIS (BMP 24 bits, sans lib image) :
//  • installerSidebar.bmp / uninstallerSidebar.bmp (164×314) — image des pages
//    Bienvenue / Fin → c'est ce qui donne le look « DofusCodex » au lieu du gris par défaut.
// Même thème que l'icône (fond void + emblème hexagonal violet→cyan).
const fs = require("node:fs");
const path = require("node:path");

const clamp = (v) => (v < 0 ? 0 : v > 255 ? 255 : v | 0);
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (e0, e1, x) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};
// Hexagone à sommet plat : distance signée (négatif = intérieur), r = rayon inscrit.
function hexDist(px, py, r) {
  px = Math.abs(px);
  py = Math.abs(py);
  return Math.max(px * 0.8660254 + py * 0.5, py) - r;
}

const VOID_TOP = [16, 20, 38];
const VOID_BOT = [7, 9, 18];
const PURPLE = [124, 92, 255];
const VIOLET = [157, 123, 255];
const CYAN = [34, 211, 238];

// Construit un shader (x,y) → [r,g,b] pour un emblème centré en (cx,cy), rayon R.
function makeShader(W, H, cx, cy, R) {
  return (x, y) => {
    const dx = x - cx;
    const dy = y - cy;

    // Fond : dégradé vertical + halo violet ambiant autour de l'emblème.
    const vt = y / H;
    let r = lerp(VOID_TOP[0], VOID_BOT[0], vt);
    let g = lerp(VOID_TOP[1], VOID_BOT[1], vt);
    let b = lerp(VOID_TOP[2], VOID_BOT[2], vt);
    const rad = Math.sqrt(dx * dx + dy * dy);
    const ambient = Math.exp(-(rad * rad) / (2 * (R * 1.6) ** 2)) * 0.5;
    r += PURPLE[0] * ambient * 0.3;
    g += PURPLE[1] * ambient * 0.22;
    b += PURPLE[2] * ambient * 0.4;
    // Lueur cyan douce en bas.
    const cy2 = H * 0.92;
    const rb = Math.sqrt(dx * dx + (y - cy2) ** 2);
    const bottomGlow = Math.exp(-(rb * rb) / (2 * (W * 0.7) ** 2)) * 0.28;
    r += CYAN[0] * bottomGlow * 0.15;
    g += CYAN[1] * bottomGlow * 0.25;
    b += CYAN[2] * bottomGlow * 0.3;

    // Emblème hexagonal.
    const d = hexDist(dx, dy, R);
    const glow = Math.exp(-Math.max(d, 0) / (R * 0.28));
    r += VIOLET[0] * glow * 0.5;
    g += VIOLET[1] * glow * 0.5;
    b += VIOLET[2] * glow * 0.6;
    if (d < 0) {
      const t = smooth(-R, R, dx * 0.7 + dy * 0.7);
      const fr = lerp(PURPLE[0], CYAN[0], t);
      const fg = lerp(PURPLE[1], CYAN[1], t);
      const fb = lerp(PURPLE[2], CYAN[2], t);
      const shade = lerp(0.55, 1.0, smooth(R, -R, dy));
      r = lerp(r, fr * shade, 0.92);
      g = lerp(g, fg * shade, 0.92);
      b = lerp(b, fb * shade, 0.92);
    }
    // Liseré clair sur l'arête.
    const rim = 1 - smooth(0, R * 0.06, Math.abs(d));
    r = lerp(r, 240, rim * 0.85);
    g = lerp(g, 245, rim * 0.85);
    b = lerp(b, 255, rim * 0.85);
    // Anneau hexagonal intérieur.
    const d2 = hexDist(dx, dy, R * 0.57);
    const ring = 1 - smooth(0, R * 0.045, Math.abs(d2));
    r = lerp(r, 255, ring * 0.7);
    g = lerp(g, 255, ring * 0.7);
    b = lerp(b, 255, ring * 0.7);
    // Étincelle centrale 4 branches.
    const spark =
      Math.exp(-(Math.abs(dx) + Math.abs(dy * 4)) / (R * 0.32)) +
      Math.exp(-(Math.abs(dy) + Math.abs(dx * 4)) / (R * 0.32));
    const sp = Math.min(1, spark);
    r = lerp(r, 235, sp * 0.9);
    g = lerp(g, 250, sp * 0.9);
    b = lerp(b, 255, sp * 0.9);

    return [r, g, b];
  };
}

// Écrit un BMP 24 bits (bottom-up, lignes alignées sur 4 octets).
function writeBMP(file, W, H, shade) {
  const rowSize = Math.floor((24 * W + 31) / 32) * 4;
  const dataSize = rowSize * H;
  const fileSize = 54 + dataSize;
  const buf = Buffer.alloc(fileSize);
  buf.write("BM", 0);
  buf.writeUInt32LE(fileSize, 2);
  buf.writeUInt32LE(54, 10); // offset des pixels
  buf.writeUInt32LE(40, 14); // taille DIB header
  buf.writeInt32LE(W, 18);
  buf.writeInt32LE(H, 22); // hauteur positive → bottom-up
  buf.writeUInt16LE(1, 26);
  buf.writeUInt16LE(24, 28); // bpp
  buf.writeUInt32LE(0, 30); // BI_RGB
  buf.writeUInt32LE(dataSize, 34);
  buf.writeInt32LE(2835, 38);
  buf.writeInt32LE(2835, 42);
  for (let i = 0; i < H; i++) {
    const y = H - 1 - i; // ligne fichier 0 = bas de l'image
    let off = 54 + i * rowSize;
    for (let x = 0; x < W; x++) {
      const [r, g, b] = shade(x, y);
      buf[off++] = clamp(b);
      buf[off++] = clamp(g);
      buf[off++] = clamp(r);
    }
  }
  fs.writeFileSync(file, buf);
  console.log(`[installer-art] ${path.basename(file)} (${W}×${H})`);
}

// Sidebar 164×314 : emblème en haut, texte de l'assistant en dessous (géré par NSIS).
const W = 164;
const H = 314;
const shade = makeShader(W, H, W / 2, H * 0.34, W * 0.3);
writeBMP(path.join(__dirname, "installerSidebar.bmp"), W, H, shade);
writeBMP(path.join(__dirname, "uninstallerSidebar.bmp"), W, H, shade);
