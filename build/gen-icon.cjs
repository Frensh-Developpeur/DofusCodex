// Generates build/icon.png (1024×1024) without any image library.
// A dark panel + glowing hexagon emblem matching the app theme.
// electron-builder derives the .icns (mac) and .ico (win) from this PNG.
const zlib = require("node:zlib");
const fs = require("node:fs");
const path = require("node:path");

const S = 1024;
const buf = Buffer.alloc(S * S * 4);

function clamp(v) {
  return v < 0 ? 0 : v > 255 ? 255 : v | 0;
}
function set(x, y, r, g, b, a = 255) {
  const i = (y * S + x) * 4;
  buf[i] = clamp(r);
  buf[i + 1] = clamp(g);
  buf[i + 2] = clamp(b);
  buf[i + 3] = clamp(a);
}
function lerp(a, b, t) {
  return a + (b - a) * t;
}
// Flat-top hexagon signed distance (negative = inside), r = inradius in px.
function hexDist(px, py, r) {
  px = Math.abs(px);
  py = Math.abs(py);
  return Math.max(px * 0.8660254 + py * 0.5, py) - r;
}
function smooth(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

const cx = S / 2;
const cy = S / 2;

// Palette
const VOID_TOP = [16, 20, 38];
const VOID_BOT = [7, 9, 18];
const PURPLE = [124, 92, 255];
const VIOLET = [157, 123, 255];
const CYAN = [34, 211, 238];

for (let y = 0; y < S; y++) {
  for (let x = 0; x < S; x++) {
    const dx = x - cx;
    const dy = y - cy;

    // --- background: vertical gradient + radial purple glow ---
    const vt = y / S;
    let r = lerp(VOID_TOP[0], VOID_BOT[0], vt);
    let g = lerp(VOID_TOP[1], VOID_BOT[1], vt);
    let b = lerp(VOID_TOP[2], VOID_BOT[2], vt);
    const rad = Math.sqrt(dx * dx + dy * dy);
    const ambient = Math.exp(-(rad * rad) / (2 * 360 * 360)) * 0.5;
    r += PURPLE[0] * ambient * 0.25;
    g += PURPLE[1] * ambient * 0.2;
    b += PURPLE[2] * ambient * 0.35;

    // --- outer hexagon emblem ---
    const R = 300;
    const d = hexDist(dx, dy, R);

    // soft outer glow
    const glow = Math.exp(-Math.max(d, 0) / 70);
    r += VIOLET[0] * glow * 0.5;
    g += VIOLET[1] * glow * 0.5;
    b += VIOLET[2] * glow * 0.6;

    if (d < 0) {
      // diagonal purple→cyan fill
      const t = smooth(-R, R, dx * 0.7 + dy * 0.7);
      const fr = lerp(PURPLE[0], CYAN[0], t);
      const fg = lerp(PURPLE[1], CYAN[1], t);
      const fb = lerp(PURPLE[2], CYAN[2], t);
      // darken core a touch for depth, brighten toward top
      const shade = lerp(0.55, 1.0, smooth(R, -R, dy));
      const fill = 0.92;
      r = lerp(r, fr * shade, fill);
      g = lerp(g, fg * shade, fill);
      b = lerp(b, fb * shade, fill);
    }

    // bright rim on the hexagon edge
    const rim = 1 - smooth(0, 10, Math.abs(d));
    r = lerp(r, 240, rim * 0.85);
    g = lerp(g, 245, rim * 0.85);
    b = lerp(b, 255, rim * 0.85);

    // --- inner hexagon ring (emblem) ---
    const d2 = hexDist(dx, dy, 170);
    const ring = 1 - smooth(0, 7, Math.abs(d2));
    r = lerp(r, 255, ring * 0.75);
    g = lerp(g, 255, ring * 0.75);
    b = lerp(b, 255, ring * 0.75);

    // --- central 4-point spark ---
    const spark =
      Math.exp(-(Math.abs(dx) + Math.abs(dy * 4)) / 26) +
      Math.exp(-(Math.abs(dy) + Math.abs(dx * 4)) / 26);
    const sp = Math.min(1, spark);
    r = lerp(r, 235, sp * 0.9);
    g = lerp(g, 250, sp * 0.9);
    b = lerp(b, 255, sp * 0.9);

    set(x, y, r, g, b, 255);
  }
}

// --- encode PNG (filter 0 per row) ---
const raw = Buffer.alloc(S * (S * 4 + 1));
for (let y = 0; y < S; y++) {
  raw[y * (S * 4 + 1)] = 0;
  buf.copy(raw, y * (S * 4 + 1) + 1, y * S * 4, (y + 1) * S * 4);
}
const idat = zlib.deflateSync(raw, { level: 9 });

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])) >>> 0, 0);
  return Buffer.concat([len, t, data, crc]);
}
function crc32(b) {
  let c = ~0;
  for (let i = 0; i < b.length; i++) {
    c ^= b[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c;
}

const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(S, 0);
ihdr.writeUInt32BE(S, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 6; // color type RGBA
const png = Buffer.concat([
  sig,
  chunk("IHDR", ihdr),
  chunk("IDAT", idat),
  chunk("IEND", Buffer.alloc(0)),
]);

const out = path.join(__dirname, "icon.png");
fs.writeFileSync(out, png);
console.log("Wrote", out, png.length, "bytes");
