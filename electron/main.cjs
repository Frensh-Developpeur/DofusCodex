const { app, BrowserWindow, shell, session, ipcMain, screen, protocol } = require("electron");
const path = require("node:path");
const https = require("node:https");
const fs = require("node:fs");
const os = require("node:os");
const { exec, spawn } = require("node:child_process");

const isDev = process.env.NODE_ENV === "development";
const DEV_URL = "http://localhost:5173";

let mainWindow = null;
let launcherWindow = null;
let launcherFlowRunning = false;
let startupLauncherDone = false;
let closingLauncherForMain = false;

// ── Liens profonds dofuscodex:// (réinitialisation de mot de passe, etc.) ──────────────
// L'e-mail de reset Supabase redirige vers `dofuscodex://reset#access_token=…` ; l'OS ouvre
// alors l'app avec cette URL, qu'on transmet au renderer (cf. handleAuthDeepLink côté React).
const PROTOCOL = "dofuscodex";
const NEWS_IMAGE_PROTOCOL = "dofuscodex-news-image";
let pendingDeepLink = null; // lien arrivé avant que le renderer soit prêt (cold start / course)

protocol.registerSchemesAsPrivileged([
  { scheme: NEWS_IMAGE_PROTOCOL, privileges: { secure: true, standard: true, supportFetchAPI: true } },
]);

// Mode overlay = la fenêtre principale se transforme en fenêtre compacte flottante au-dessus du jeu.
// Dimensions/position persistées sur disque ; les dimensions normales sont restaurées à la sortie.
const OVERLAY_MIN = { width: 240, height: 140 };
let overlayWin = null;
let overlayBounds = null; // dernières dimensions/position de l'overlay
let overlayMode = false;
let normalBounds = null;
let saveBoundsTimer = null;
let overlayTimer = null; // boucle : ré-impose le premier plan (+ accroche Dofus si activée)
let snapMode = false; // accroche à la fenêtre Dofus activée ?

const overlayBoundsFile = () => path.join(app.getPath("userData"), "overlay-bounds.json");
function loadOverlayBounds() {
  try {
    overlayBounds = JSON.parse(fs.readFileSync(overlayBoundsFile(), "utf8"));
  } catch {
    overlayBounds = null;
  }
}
function saveOverlayBoundsDebounced() {
  if (saveBoundsTimer) clearTimeout(saveBoundsTimer);
  saveBoundsTimer = setTimeout(() => {
    try {
      if (overlayBounds) fs.writeFileSync(overlayBoundsFile(), JSON.stringify(overlayBounds));
    } catch {
      /* best-effort */
    }
  }, 600);
}

function decodeNewsImageUrl(requestUrl) {
  try {
    const u = new URL(requestUrl);
    const encoded = u.pathname.replace(/^\/+/, "") || u.hostname;
    const raw = Buffer.from(encoded.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
    const target = new URL(raw);
    if (!["https:", "http:"].includes(target.protocol)) return null;
    target.protocol = "https:";
    const host = target.hostname.toLowerCase();
    if (host !== "ankama.com" && !host.endsWith(".ankama.com") && host !== "dofus.com" && !host.endsWith(".dofus.com")) {
      return null;
    }
    return target;
  } catch {
    return null;
  }
}

function inferImageContentType(target) {
  const ext = path.extname(target.pathname).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  if (ext === ".svg") return "image/svg+xml";
  if (ext === ".avif") return "image/avif";
  return "image/jpeg";
}

function fetchNewsImage(target) {
  return new Promise((resolve) => {
    const req = https.request(
      target,
      {
        method: "GET",
        headers: {
          Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
          "Accept-Language": "fr-FR,fr;q=0.9",
          Referer: "https://www.dofus.com/fr",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        timeout: 15000,
      },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          const status = res.statusCode || 0;
          const contentType = res.headers["content-type"] || inferImageContentType(target);
          resolve({ status, contentType, body: Buffer.concat(chunks) });
        });
      },
    );
    req.on("error", () => resolve(null));
    req.on("timeout", () => {
      req.destroy();
      resolve(null);
    });
    req.end();
  });
}

// Maintient la fenêtre overlay au premier plan, y compris au-dessus d'un jeu en plein écran
// fenêtré. Re-appliqué au blur car perdre le focus la ferait sinon repasser derrière.
function enforceOverlayOnTop() {
  const win = overlayWindow();
  if (!win) return;
  win.setAlwaysOnTop(true, "screen-saver");
  if (process.platform === "darwin") {
    // CanJoinAllSpaces + FullScreenAuxiliary → la fenêtre apparaît AUSSI par-dessus un jeu en
    // plein écran natif (qui vit dans un Espace dédié). skipTransformProcessType : garde l'app
    // « normale » (sinon l'icône du Dock peut sauter).
    win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true, skipTransformProcessType: true });
  }
}

// Position par défaut : coin haut-droit de l'écran de la fenêtre principale.
function defaultOverlayBounds() {
  const ref = mainWindow && !mainWindow.isDestroyed() ? mainWindow.getBounds() : screen.getPrimaryDisplay().bounds;
  const wa = screen.getDisplayMatching(ref).workArea;
  const width = 380;
  const height = 600;
  const margin = 16;
  return { x: wa.x + wa.width - width - margin, y: wa.y + margin, width, height };
}

function overlayRoute(target) {
  if (typeof target === "number" && Number.isFinite(target)) return `/guides/${target}`;
  const raw = String(target || "").trim();
  if (/^\/[a-z0-9/_-]+$/i.test(raw)) return raw;
  const n = Number(raw);
  if (Number.isFinite(n)) return `/guides/${n}`;
  return "/guides";
}

function loadOverlayRoute(route) {
  const win = overlayWindow();
  if (!win) return;
  win.webContents.send("overlay:state", { active: true, route });
}

function openOverlayWindow(target) {
  const route = overlayRoute(target);
  if (!mainWindow || mainWindow.isDestroyed()) return;
  if (overlayMode) {
    loadOverlayRoute(route);
    mainWindow.focus();
    return;
  }
  overlayMode = true;
  normalBounds = mainWindow.getBounds();
  const b = overlayBounds || defaultOverlayBounds();
  mainWindow.setMinimumSize(OVERLAY_MIN.width, OVERLAY_MIN.height);
  mainWindow.setBounds(b);
  mainWindow.setResizable(true);
  mainWindow.setAlwaysOnTop(true, "screen-saver");
  mainWindow.setFullScreenable(false);
  mainWindow.setBackgroundColor("#00000000");
  if (process.platform === "darwin") mainWindow.setWindowButtonVisibility(false);
  startOverlayLoop();
  loadOverlayRoute(route);
  mainWindow.focus();
  const remember = () => {
    if (overlayMode && mainWindow && !mainWindow.isDestroyed()) {
      overlayBounds = mainWindow.getBounds();
      saveOverlayBoundsDebounced();
    }
  };
  mainWindow.on("resize", remember);
  mainWindow.on("move", remember);
}

function closeOverlayWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  if (overlayWin && !overlayWin.isDestroyed()) overlayWin.close();
  overlayMode = false;
  stopOverlayLoop();
  snapMode = false;
  mainWindow.setAlwaysOnTop(false);
  mainWindow.setVisibleOnAllWorkspaces(false);
  mainWindow.setFullScreenable(true);
  mainWindow.setMinimumSize(1040, 680);
  mainWindow.setBackgroundColor("#070912");
  if (process.platform === "darwin") mainWindow.setWindowButtonVisibility(true);
  if (normalBounds) mainWindow.setBounds(normalBounds);
  mainWindow.webContents.send("overlay:state", { active: false });
  mainWindow.show();
}

function overlayWindow() {
  if (overlayWin && !overlayWin.isDestroyed()) return overlayWin;
  if (overlayMode && mainWindow && !mainWindow.isDestroyed()) return mainWindow;
  return null;
}

// Détecte si un process Dofus tourne (sans module natif ni permission : simple liste de process).
function detectDofus() {
  return new Promise((resolve) => {
    const cmd = process.platform === "win32" ? "tasklist /FO CSV /NH" : "ps -axo comm";
    exec(cmd, { timeout: 4000, windowsHide: true, maxBuffer: 1024 * 1024 }, (err, stdout) => {
      if (err || !stdout) return resolve({ running: false });
      resolve({ running: /dofus/i.test(stdout) });
    });
  });
}

// Position/taille de la fenêtre Dofus, SANS module natif :
//  • macOS : osascript (System Events) → nécessite l'autorisation « Accessibilité » (sinon erreur).
//  • Windows : PowerShell + GetWindowRect (EncodedCommand → pas de souci d'échappement).
// Renvoie {x,y,width,height} ou null (→ repli sur le coin de l'écran).
function getDofusBounds() {
  return new Promise((resolve) => {
    const parse = (out) => {
      const n = (String(out || "").match(/-?\d+/g) || []).map(Number);
      if (n.length >= 4 && n[2] > 0 && n[3] > 0) resolve({ x: n[0], y: n[1], width: n[2], height: n[3] });
      else resolve(null);
    };
    if (process.platform === "darwin") {
      const osa =
        'tell application "System Events" to tell (first process whose name contains "Dofus") to get {position, size} of window 1';
      exec(`osascript -e '${osa}'`, { timeout: 4000 }, (err, stdout) => (err ? resolve(null) : parse(stdout)));
    } else if (process.platform === "win32") {
      const ps = [
        'Add-Type @"',
        "using System;using System.Runtime.InteropServices;",
        "public struct RECT { public int Left, Top, Right, Bottom; }",
        'public class Win { [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h, out RECT r); }',
        '"@',
        "$p = Get-Process | Where-Object { $_.MainWindowHandle -ne 0 -and $_.ProcessName -match 'dofus' } | Select-Object -First 1",
        "if ($p) { $r = New-Object RECT; [void][Win]::GetWindowRect($p.MainWindowHandle, [ref]$r); \"$($r.Left),$($r.Top),$($r.Right-$r.Left),$($r.Bottom-$r.Top)\" }",
      ].join("\n");
      const encoded = Buffer.from(ps, "utf16le").toString("base64");
      exec(
        `powershell -NoProfile -NonInteractive -EncodedCommand ${encoded}`,
        { timeout: 5000, windowsHide: true },
        (err, stdout) => (err ? resolve(null) : parse(stdout)),
      );
    } else {
      resolve(null);
    }
  });
}

// Accroche = SUIVRE la fenêtre Dofus en conservant la position choisie par l'utilisateur. On
// applique à l'overlay le même déplacement que celui de la fenêtre Dofus (delta), donc on reste
// libre de placer l'overlay où on veut sur le jeu — il se contente de suivre. Si Dofus est
// introuvable (process absent / permission refusée), on ne bouge rien (placement totalement libre).
let lastDofusBounds = null;
async function dockOverlay() {
  const win = overlayWindow();
  if (!win) return;
  const db = await getDofusBounds();
  if (!db) {
    lastDofusBounds = null;
    return;
  }
  if (lastDofusBounds) {
    const dx = db.x - lastDofusBounds.x;
    const dy = db.y - lastDofusBounds.y;
    if (dx !== 0 || dy !== 0) {
      const b = win.getBounds();
      win.setPosition(Math.round(b.x + dx), Math.round(b.y + dy));
    }
  }
  lastDofusBounds = db;
}
// Boucle active tant que l'overlay est ouvert : ré-impose le premier plan (clé pour réapparaître
// quand Dofus bascule en plein écran), et suit la fenêtre Dofus si l'accroche est activée.
function startOverlayLoop() {
  stopOverlayLoop();
  enforceOverlayOnTop();
  overlayTimer = setInterval(() => {
    enforceOverlayOnTop();
    if (snapMode) dockOverlay();
  }, 1500);
}
function stopOverlayLoop() {
  if (overlayTimer) clearInterval(overlayTimer);
  overlayTimer = null;
}

const isDeepLink = (s) => typeof s === "string" && s.startsWith(`${PROTOCOL}://`);

function focusMainWindow() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  }
}

function handleDeepLink(url) {
  if (!isDeepLink(url)) return;
  if (mainWindow && !mainWindow.isDestroyed() && mainWindow.webContents) {
    mainWindow.webContents.send("deeplink", url);
    focusMainWindow();
  } else {
    pendingDeepLink = url; // récupéré au montage du renderer via deeplink:peek
  }
}

// Une seule instance : sur Windows/Linux, le clic sur un lien profond relance l'exécutable avec
// l'URL en argv → on la capte dans `second-instance` et on garde la fenêtre existante.
const gotSingleInstanceLock = app.requestSingleInstanceLock();
if (!gotSingleInstanceLock) {
  app.quit();
} else {
  app.on("second-instance", (_event, argv) => {
    const url = argv.find(isDeepLink);
    if (url) handleDeepLink(url);
    else focusMainWindow();
  });
}

// macOS : le lien profond arrive via l'événement open-url (peut précéder la fenêtre).
app.on("open-url", (event, url) => {
  event.preventDefault();
  handleDeepLink(url);
});

// Enregistre l'app comme gestionnaire du schéma. En dev (electron lancé via un script), il faut
// préciser l'exécutable + le script ; en prod, l'appel simple suffit (Info.plist sur mac via
// la config `protocols`, registre HKCU sur Windows au 1er lancement).
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient(PROTOCOL);
}

// Windows/Linux cold start : l'URL est passée dans argv au tout premier lancement.
{
  const initial = process.argv.find(isDeepLink);
  if (initial) pendingDeepLink = initial;
}

// Page de téléchargement des releases (dérivée de la config publish de package.json).
let RELEASES_URL = "https://github.com";
try {
  const pub = require("../package.json").build?.publish?.[0];
  if (pub?.owner && pub?.repo) RELEASES_URL = `https://github.com/${pub.owner}/${pub.repo}/releases/latest`;
} catch {
  /* package.json indisponible */
}

// ── Moteur macros Windows natif ───────────────────────────────────────────────────────
// Le helper est un petit exe Win32/.NET autonome (hooks globaux + SendInput). Electron ne fait
// que sauvegarder la config JSON et gérer le cycle de vie du process.
let macroProc = null;
let macroLastEvent = null;
let macroLastError = null;

function macroConfigPath() {
  return path.join(app.getPath("userData"), "macro-helper-config.json");
}

function macroAhkPath() {
  return path.join(app.getPath("userData"), "dofuscodex-macros.ahk");
}

function macroHelperCandidates() {
  const exe = "DofusCodex.MacroHelper.exe";
  const devRoot = path.join(__dirname, "..", "native", "win-macro-helper");
  return [
    process.env.DOFUS_CODEX_MACRO_HELPER,
    app.isPackaged ? path.join(process.resourcesPath, "macro-helper", exe) : null,
    path.join(devRoot, "bin", "Release", "net8.0-windows", "win-x64", "publish", exe),
    path.join(__dirname, "..", "build", "macro-helper", "win", exe),
  ].filter(Boolean);
}

function findMacroHelper() {
  if (process.platform !== "win32") return null;
  return macroHelperCandidates().find((p) => fs.existsSync(p)) || null;
}

function normalizeMacroConfig(config) {
  const macros = Array.isArray(config?.macros) ? config.macros : [];
  return {
    version: 1,
    enabled: config?.enabled !== false,
    suppressHotkeys: config?.suppressHotkeys !== false,
    debounceMs: Math.max(0, Math.min(5000, Number(config?.debounceMs ?? 180) || 0)),
    focusDelayMs: Math.max(0, Math.min(1000, Number(config?.focusDelayMs ?? 120) || 0)),
    macros: macros
      .filter((m) => m && typeof m === "object")
      .slice(0, 24)
      .map((m, i) => ({
        id: String(m.id || `macro-${i + 1}`),
        enabled: m.enabled !== false,
        label: String(m.label || `Macro ${i + 1}`).slice(0, 80),
        hotkey: String(m.hotkey || "").slice(0, 40),
        target: m.target === "dofus" ? "dofus" : "active",
        steps: (Array.isArray(m.steps) ? m.steps : [])
          .filter((s) => s && typeof s === "object")
          .slice(0, 60)
          .map((s) => ({
            ...(s.key ? { key: String(s.key).slice(0, 40) } : {}),
            ...(s.text ? { text: String(s.text).slice(0, 500) } : {}),
            ...(s.mouse ? { mouse: String(s.mouse).slice(0, 40) } : {}),
            ...(s.sleepMs != null ? { sleepMs: Math.max(0, Math.min(10000, Number(s.sleepMs) || 0)) } : {}),
            ...(s.delayMs != null ? { delayMs: Math.max(0, Math.min(10000, Number(s.delayMs) || 0)) } : {}),
            ...(s.repeat != null ? { repeat: Math.max(1, Math.min(50, Number(s.repeat) || 1)) } : {}),
          })),
      })),
  };
}

async function loadMacroConfig() {
  try {
    return JSON.parse(await fs.promises.readFile(macroConfigPath(), "utf8"));
  } catch {
    return null;
  }
}

async function saveMacroConfig(config) {
  const clean = normalizeMacroConfig(config);
  await fs.promises.mkdir(path.dirname(macroConfigPath()), { recursive: true });
  await fs.promises.writeFile(macroConfigPath(), JSON.stringify(clean, null, 2), "utf8");
  return clean;
}

async function saveAhkScript(script) {
  const text = String(script || "").slice(0, 300_000);
  await fs.promises.mkdir(path.dirname(macroAhkPath()), { recursive: true });
  await fs.promises.writeFile(macroAhkPath(), text, "utf8");
  return { ok: true, path: macroAhkPath() };
}

async function openAhkScript(script) {
  const saved = await saveAhkScript(script);
  const error = await shell.openPath(saved.path);
  if (error) {
    await shell.openExternal("https://www.autohotkey.com/v2/");
    return { ok: false, reason: "ahk-not-associated", path: saved.path, error };
  }
  return { ok: true, path: saved.path };
}

function stopMacroHelper() {
  if (!macroProc) return { ok: true, running: false };
  const proc = macroProc;
  macroProc = null;
  try {
    proc.kill();
  } catch {
    /* already gone */
  }
  return { ok: true, running: false };
}

async function startMacroHelper(config) {
  if (process.platform !== "win32") return { ok: false, reason: "windows-only" };
  const helper = findMacroHelper();
  if (!helper) return { ok: false, reason: "helper-missing", candidates: macroHelperCandidates() };
  const clean = await saveMacroConfig(config || (await loadMacroConfig()) || {});
  stopMacroHelper();
  macroLastError = null;
  macroLastEvent = null;
  macroProc = spawn(helper, [macroConfigPath()], {
    cwd: path.dirname(helper),
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
  });
  macroProc.stdout?.on("data", (buf) => {
    for (const line of String(buf).split(/\r?\n/).filter(Boolean)) {
      try {
        macroLastEvent = JSON.parse(line);
      } catch {
        macroLastEvent = { type: "log", message: line };
      }
    }
  });
  macroProc.stderr?.on("data", (buf) => {
    macroLastError = String(buf).trim();
  });
  macroProc.on("exit", (code, signal) => {
    macroLastEvent = { type: "exit", message: signal || `code ${code}` };
    macroProc = null;
  });
  return { ok: true, running: true, pid: macroProc.pid, config: clean };
}

function macroStatus() {
  const helper = findMacroHelper();
  return {
    platform: process.platform,
    available: !!helper,
    helperPath: helper,
    ahkPath: app.isReady() ? macroAhkPath() : null,
    configPath: app.isReady() ? macroConfigPath() : null,
    running: !!macroProc,
    pid: macroProc?.pid ?? null,
    lastEvent: macroLastEvent,
    lastError: macroLastError,
  };
}

// Hosts the renderer is allowed to talk to.
const API_HOSTS =
  "https://api.dofusdu.de https://api.dofusdb.fr https://*.dofusdb.fr https://ganymede-app.com https://barbofus.com https://skinator.barbofus.com https://www.metamob.fr https://*.supabase.co wss://*.supabase.co";
const FONT_CSS = "https://fonts.googleapis.com";
const FONT_FILES = "https://fonts.gstatic.com";

function buildCsp() {
  // Dev needs inline scripts (React Refresh preamble) and the Vite HMR websocket.
  const scriptSrc = isDev ? "'self' 'unsafe-inline'" : "'self'";
  const connectSrc = isDev
    ? `'self' ${API_HOSTS} ws://localhost:5173 http://localhost:5173`
    : `'self' ${API_HOSTS}`;
  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    `style-src 'self' 'unsafe-inline' ${FONT_CSS}`,
    `font-src ${FONT_FILES}`,
    // Les guides Ganymède embarquent des images hébergées sur des hôtes variés
    // (i.ibb.co, ganymede-dofus.com, etc.) → on autorise toute image https.
    `img-src 'self' data: https: ${NEWS_IMAGE_PROTOCOL}: ${API_HOSTS}`,
    `connect-src ${connectSrc}`,
    "frame-src https://barbofus.com https://skinator.barbofus.com",
    "object-src 'none'",
    "base-uri 'self'",
  ].join("; ");
}

function launcherHtml() {
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DofusCodex Launcher</title>
  <style>
    * { box-sizing: border-box; }
    html, body { width: 100%; height: 100%; margin: 0; overflow: hidden; background: #070912; color: #f8fafc; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    body {
      -webkit-app-region: drag;
      display: grid;
      place-items: center;
      background:
        radial-gradient(120% 80% at 22% 0%, rgba(124, 92, 255, 0.28), transparent 50%),
        radial-gradient(100% 70% at 100% 100%, rgba(43, 211, 255, 0.14), transparent 55%),
        #070912;
    }
    .card { width: 100%; height: 100%; padding: 30px; display: flex; flex-direction: column; justify-content: space-between; border: 1px solid rgba(255,255,255,0.08); background: linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.018)); }
    .top { display: flex; align-items: center; justify-content: space-between; gap: 14px; }
    .brand { display: flex; align-items: center; gap: 12px; min-width: 0; }
    .logo { width: 42px; height: 42px; border-radius: 15px; display: grid; place-items: center; background: linear-gradient(135deg, rgba(124,92,255,0.38), rgba(43,211,255,0.2)); border: 1px solid rgba(255,255,255,0.12); box-shadow: 0 14px 36px rgba(0,0,0,0.3); }
    .logo svg { width: 23px; height: 23px; color: #d8ccff; }
    .eyebrow { margin: 0; color: #a993ff; font-size: 11px; font-weight: 800; text-transform: uppercase; }
    .appname { margin: 2px 0 0; font-size: 18px; font-weight: 900; letter-spacing: 0; white-space: nowrap; }
    .close { -webkit-app-region: no-drag; width: 32px; height: 32px; border: 0; border-radius: 11px; background: rgba(255,255,255,0.06); color: #94a3b8; cursor: pointer; font-size: 18px; }
    .close:hover { background: rgba(255,255,255,0.12); color: white; }
    .center { text-align: center; display: grid; justify-items: center; gap: 14px; padding: 8px 0; }
    .orb { width: 84px; height: 84px; border-radius: 28px; display: grid; place-items: center; background: rgba(124,92,255,0.13); border: 1px solid rgba(169,147,255,0.26); position: relative; overflow: hidden; }
    .orb::before { content: ""; position: absolute; inset: 11px; border-radius: 22px; border: 2px solid rgba(255,255,255,0.08); border-top-color: #a993ff; animation: spin 1s linear infinite; }
    .orb.done::before, .orb.error::before, .orb.wait::before { animation: none; border-color: rgba(255,255,255,0.12); }
    .orb span { position: relative; z-index: 1; font-size: 26px; font-weight: 900; color: #d8ccff; }
    h1 { margin: 0; max-width: 330px; font-size: 25px; line-height: 1.12; letter-spacing: 0; }
    .detail { margin: 0; max-width: 330px; min-height: 44px; color: #aeb8ca; font-size: 13px; line-height: 1.6; }
    .progress-wrap { width: 100%; display: grid; gap: 8px; }
    .progress-meta { display: flex; justify-content: space-between; gap: 12px; color: #718096; font-size: 11px; }
    .bar { height: 9px; width: 100%; border-radius: 999px; overflow: hidden; background: rgba(255,255,255,0.09); }
    .fill { height: 100%; width: 8%; border-radius: inherit; background: linear-gradient(90deg, #8b6dff, #2bd3ff); transition: width 220ms ease; }
    .footer { display: grid; gap: 12px; }
    .versions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .box { border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.035); border-radius: 14px; padding: 11px 12px; min-width: 0; }
    .box span { display: block; color: #64748b; font-size: 10px; font-weight: 800; text-transform: uppercase; }
    .box strong { display: block; margin-top: 3px; color: white; font-size: 15px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .actions { -webkit-app-region: no-drag; display: flex; gap: 8px; justify-content: flex-end; flex-wrap: wrap; min-height: 38px; }
    button.action { border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 10px 13px; background: rgba(255,255,255,0.055); color: #dbe4f0; font-size: 12px; font-weight: 800; cursor: pointer; }
    button.action:hover { background: rgba(255,255,255,0.1); color: white; }
    button.primary { border-color: rgba(169,147,255,0.45); background: rgba(124,92,255,0.22); color: white; }
    button.primary:hover { background: rgba(124,92,255,0.32); }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <main class="card">
    <div class="top">
      <div class="brand">
        <div class="logo">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3l7 4v6c0 4.4-2.9 7.2-7 8-4.1-.8-7-3.6-7-8V7l7-4z" stroke="currentColor" stroke-width="2"/><path d="M9 12l2 2 4-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div>
          <p class="eyebrow">Launcher</p>
          <p class="appname">DofusCodex</p>
        </div>
      </div>
      <button class="close" id="quit" title="Quitter">×</button>
    </div>
    <section class="center">
      <div class="orb" id="orb"><span id="symbol">↻</span></div>
      <h1 id="title">Préparation du lancement</h1>
      <p class="detail" id="detail">Vérification de la dernière version avant d'ouvrir l'app.</p>
      <div class="progress-wrap">
        <div class="progress-meta"><span id="phase">Initialisation</span><span id="percent">0%</span></div>
        <div class="bar"><div class="fill" id="fill"></div></div>
      </div>
    </section>
    <footer class="footer">
      <div class="versions">
        <div class="box"><span>Installée</span><strong id="current">—</strong></div>
        <div class="box"><span>Dernière</span><strong id="latest">—</strong></div>
      </div>
      <div class="actions" id="actions"></div>
    </footer>
  </main>
  <script>
    const api = window.dofusCodexLauncher;
    const el = (id) => document.getElementById(id);
    const fmtBytes = (value) => {
      if (!value || value <= 0) return "—";
      const units = ["o", "Ko", "Mo", "Go"];
      let n = value;
      let i = 0;
      while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
      return n.toFixed(i === 0 ? 0 : 1) + " " + units[i];
    };
    const button = (label, action, primary) => {
      const b = document.createElement("button");
      b.className = "action" + (primary ? " primary" : "");
      b.textContent = label;
      b.onclick = action;
      return b;
    };
    function setActions(actions) {
      const root = el("actions");
      root.innerHTML = "";
      actions.forEach((a) => root.appendChild(a));
    }
    function render(s) {
      const state = s && s.state ? s.state : "checking";
      const version = s && s.version ? "v" + s.version : "—";
      const current = s && s.current ? "v" + s.current : "—";
      const percent = Math.max(0, Math.min(100, Math.round(s && s.percent ? s.percent : 0)));
      el("current").textContent = current;
      el("latest").textContent = version;
      const ready = state === "not-available" || state === "dev" || state === "unavailable";
      el("percent").textContent = (ready || state === "installing") ? "100%" : percent + "%";
      el("fill").style.width = (ready || state === "installing" ? 100 : Math.max(8, percent)) + "%";
      el("orb").className = "orb";
      el("symbol").textContent = "↻";
      setActions([]);
      if (state === "checking") {
        el("title").textContent = "Recherche de mise à jour";
        el("detail").textContent = "Le launcher vérifie GitHub Releases avant d'ouvrir DofusCodex.";
        el("phase").textContent = "Connexion";
      } else if (state === "available") {
        el("orb").className = "orb wait";
        el("symbol").textContent = "↓";
        el("title").textContent = "Mise à jour obligatoire";
        el("detail").textContent = s.isMac ? "Télécharge et installe la dernière version pour lancer DofusCodex." : "Nouvelle version trouvée. Le téléchargement va commencer automatiquement.";
        el("phase").textContent = s.isMac ? "Téléchargement manuel requis" : "En attente du téléchargement";
        if (s.isMac) setActions([button("Télécharger", () => api.openReleases(), true), button("Quitter", () => api.quit(), false)]);
      } else if (state === "downloading") {
        el("title").textContent = "Téléchargement de la mise à jour";
        el("detail").textContent = fmtBytes(s.transferred) + " / " + fmtBytes(s.total) + (s.bytesPerSecond ? " · " + fmtBytes(s.bytesPerSecond) + "/s" : "");
        el("phase").textContent = "Téléchargement";
      } else if (state === "downloaded") {
        el("orb").className = "orb done";
        el("symbol").textContent = "✓";
        el("title").textContent = "Mise à jour prête";
        el("detail").textContent = "Installation et redémarrage de DofusCodex.";
        el("phase").textContent = "Installation";
      } else if (state === "installing") {
        el("title").textContent = "Installation en cours";
        el("detail").textContent = "DofusCodex va redémarrer automatiquement.";
        el("phase").textContent = "Installation";
      } else if (state === "not-available" || state === "dev" || state === "unavailable") {
        el("orb").className = "orb done";
        el("symbol").textContent = "✓";
        el("title").textContent = "DofusCodex est prêt";
        el("detail").textContent = state === "dev" ? "Mode développement : le launcher est prêt à ouvrir l'app." : "Aucune mise à jour obligatoire. Tu peux ouvrir l'app.";
        el("phase").textContent = "Prêt";
        setActions([button("Démarrer", () => api.continueToApp(), true), button("Quitter", () => api.quit(), false)]);
      } else {
        el("orb").className = "orb error";
        el("symbol").textContent = "!";
        el("title").textContent = "Vérification impossible";
        el("detail").textContent = s.error || "Le launcher n'a pas pu vérifier les mises à jour.";
        el("phase").textContent = "Erreur";
        setActions([button("Réessayer", () => api.retry(), true), button("Lancer quand même", () => api.continueToApp(), false)]);
      }
    }
    api.onState(render);
    api.retry();
    el("quit").onclick = () => api.quit();
  </script>
</body>
</html>`;
}

function createLauncherWindow() {
  if (launcherWindow && !launcherWindow.isDestroyed()) {
    launcherWindow.focus();
    return launcherWindow;
  }
  const win = new BrowserWindow({
    width: 430,
    height: 540,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    show: false,
    frame: false,
    backgroundColor: "#070912",
    title: "DofusCodex Launcher",
    webPreferences: {
      preload: path.join(__dirname, "launcher-preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false,
    },
  });
  launcherWindow = win;
  win.once("ready-to-show", () => win.show());
  win.on("closed", () => {
    launcherWindow = null;
    if (!startupLauncherDone && !closingLauncherForMain) app.quit();
    closingLauncherForMain = false;
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://")) shell.openExternal(url);
    return { action: "deny" };
  });
  win.loadFile(path.join(__dirname, "launcher.html"));
  return win;
}

function sendLauncherState(payload) {
  if (launcherWindow && !launcherWindow.isDestroyed()) {
    launcherWindow.webContents.send("launcher:state", payload);
  }
}

function openMainFromLauncher() {
  startupLauncherDone = true;
  closingLauncherForMain = true;
  if (!mainWindow || mainWindow.isDestroyed()) createWindow();
  else focusMainWindow();
  if (launcherWindow && !launcherWindow.isDestroyed()) launcherWindow.close();
  else closingLauncherForMain = false;
  startUpdaterBackgroundChecks();
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 1040,
    minHeight: 680,
    show: false,
    backgroundColor: "#00000000",
    transparent: true,
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "hidden",
    titleBarOverlay:
      process.platform === "darwin"
        ? false
        : { color: "#070912", symbolColor: "#9d7bff", height: 40 },
    frame: process.platform === "darwin" ? undefined : false,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      webviewTag: true,
      spellcheck: false,
    },
  });

  mainWindow = win;
  win.once("ready-to-show", () => win.show());

  if (process.env.DOFUS_DEBUG) {
    // Electron 36+ : l'event « console-message » fournit un seul objet (level string,
    // message, sourceId, lineNumber) au lieu des anciens arguments positionnels.
    win.webContents.on("console-message", (e) => {
      console.log(`[renderer:${e.level}] ${e.message} @ ${e.sourceId}:${e.lineNumber}`);
    });
    win.webContents.on("did-fail-load", (_e, code, desc, url) => {
      console.log(`[did-fail-load] ${code} ${desc} ${url}`);
    });
    win.webContents.on("render-process-gone", (_e, d) => console.log("[render-gone]", JSON.stringify(d)));
    win.webContents.on("did-finish-load", () => console.log("[did-finish-load] ok"));
  }

  // Open external links (Ankama wiki, etc.) in the user's browser, never in-app.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://")) shell.openExternal(url);
    return { action: "deny" };
  });

  if (isDev) {
    win.loadURL(DEV_URL);
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    win.loadFile(path.join(__dirname, "..", "dist", "index.html"));
  }

  return win;
}

app.whenReady().then(() => {
  if (!gotSingleInstanceLock) return; // 2e instance : la 1re a déjà reçu le lien profond
  loadOverlayBounds(); // dimensions/position mémorisées de l'overlay
  protocol.handle(NEWS_IMAGE_PROTOCOL, async (request) => {
    const target = decodeNewsImageUrl(request.url);
    if (!target) return new Response(null, { status: 400 });
    const image = await fetchNewsImage(target);
    if (!image || image.status < 200 || image.status >= 300) return new Response(null, { status: 502 });
    return new Response(image.body, {
      status: 200,
      headers: {
        "Content-Type": image.contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  });
  session.defaultSession.webRequest.onHeadersReceived((details, cb) => {
    cb({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [buildCsp()],
      },
    });
  });

  ipcMain.handle("app:platform", () => process.platform);

  // Lit le conf.json de l'app Ganymède locale pour importer la progression du profil actif.
  // Chemin standard sur macOS et Windows. Renvoie null si Ganymède n'est pas installé / erreur.
  ipcMain.handle("ganymede:read-progress", async () => {
    try {
      const appData = process.platform === "darwin"
        ? path.join(os.homedir(), "Library", "Application Support", "com.ganymede.ganymede-app")
        : path.join(process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming"), "com.ganymede.ganymede-app");
      const confPath = path.join(appData, "conf.json");
      const raw = await fs.promises.readFile(confPath, "utf8");
      const conf = JSON.parse(raw);
      const activeId = conf.profileInUse;
      const profile =
        conf.profiles?.find((p) => p.id === activeId) || conf.profiles?.[0];
      if (!profile) return null;
      const progresses = Array.isArray(profile.progresses) ? profile.progresses : [];
      return { profileName: profile.name || "Profil", progresses };
    } catch {
      return null;
    }
  });
  ipcMain.handle("app:version", () => app.getVersion());

  // Maj : le renderer affiche un launcher complet ; le main ne fait que piloter electron-updater.
  ipcMain.handle("update:install", () => installUpdateNow());
  ipcMain.handle("update:open", () => shell.openExternal(RELEASES_URL));
  // État de maj déjà détecté (rejoue l'event manqué si le renderer s'est monté après le check).
  ipcMain.handle("update:peek", () => lastUpdatePayload);
  ipcMain.handle("update:status", () => lastUpdatePayload ?? baseUpdatePayload("idle"));
  ipcMain.handle("update:download", () => downloadUpdateNow());
  // Lien profond arrivé avant que le renderer soit prêt (cold start) → récupéré au montage.
  ipcMain.handle("deeplink:peek", () => {
    const u = pendingDeepLink;
    pendingDeepLink = null;
    return u;
  });

  // ── Mode overlay : fenêtre dédiée transparente au-dessus du jeu ───────────────────────
  ipcMain.handle("overlay:open", (_e, target) => openOverlayWindow(target));
  ipcMain.handle("overlay:close", () => closeOverlayWindow());
  ipcMain.handle("overlay:resize", (_e, size) => {
    const win = overlayWindow();
    if (!win || !size) return;
    const w = Math.max(OVERLAY_MIN.width, Math.round(Number(size.width) || OVERLAY_MIN.width));
    const h = Math.max(OVERLAY_MIN.height, Math.round(Number(size.height) || OVERLAY_MIN.height));
    win.setSize(w, h);
  });
  ipcMain.handle("overlay:snap-mode", (_e, on) => {
    snapMode = !!on;
    lastDofusBounds = null; // re-base le suivi (pas de saut au prochain tick)
    if (snapMode) dockOverlay();
  });
  ipcMain.handle("dofus:detect", () => detectDofus());
  ipcMain.handle("macros:status", () => macroStatus());
  ipcMain.handle("macros:load-config", () => loadMacroConfig());
  ipcMain.handle("macros:save-config", (_e, config) => saveMacroConfig(config));
  ipcMain.handle("macros:start", (_e, config) => startMacroHelper(config));
  ipcMain.handle("macros:stop", () => stopMacroHelper());
  ipcMain.handle("macros:save-ahk", (_e, script) => saveAhkScript(script));
  ipcMain.handle("macros:open-ahk", (_e, script) => openAhkScript(script));
  ipcMain.handle("macros:download-ahk", () => shell.openExternal("https://www.autohotkey.com/v2/"));

  ipcMain.handle("update:check", async () => {
    const result = await checkForUpdatesNow(true);
    return result;
  });
  ipcMain.handle("launcher:retry", async () => {
    await runStartupLauncherUpdateFlow();
    return { ok: true };
  });
  ipcMain.handle("launcher:ready", async () => {
    await runStartupLauncherUpdateFlow();
    return { ok: true };
  });
  ipcMain.handle("launcher:continue", () => {
    openMainFromLauncher();
    return { ok: true };
  });
  ipcMain.handle("launcher:install", () => installUpdateNow());
  ipcMain.handle("launcher:open-releases", () => shell.openExternal(RELEASES_URL));
  ipcMain.handle("launcher:quit", () => app.quit());

  // Rendu du personnage équipé via le renderer de DofusRoom (Barbofus/Ankama).
  // Fait depuis le process principal : l'endpoint exige un en-tête `Referer` dofusroom.com
  // (sinon 403) que `fetch`/undici interdit de poser → on utilise le module `https`.
  // Renvoie un data URL PNG, ou null (échec / timeout). Pas de CORS ici.
  ipcMain.handle("skin:render", (_e, payload) =>
    new Promise((resolve) => {
      let body;
      try {
        body = JSON.stringify(payload);
      } catch {
        return resolve(null);
      }
      const req = https.request(
        {
          hostname: "www.dofusroom.com",
          path: "/buildroom/skin/liveRenderAjax",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(body),
            "Referer": "https://www.dofusroom.com/buildroom",
            "User-Agent": "Mozilla/5.0",
          },
          timeout: 15000,
        },
        (res) => {
          if (res.statusCode !== 200) {
            res.resume();
            return resolve(null);
          }
          const chunks = [];
          res.on("data", (c) => chunks.push(c));
          res.on("end", () => {
            try {
              const json = JSON.parse(Buffer.concat(chunks).toString("utf8"));
              const skin = json && json.data && json.data.skin;
              resolve(typeof skin === "string" && skin.length > 0 ? `data:image/png;base64,${skin}` : null);
            } catch {
              resolve(null);
            }
          });
        },
      );
      req.on("error", () => resolve(null));
      req.on("timeout", () => {
        req.destroy();
        resolve(null);
      });
      req.write(body);
      req.end();
    }),
  );

  ipcMain.handle("dofusroom:spells", (_e, character) =>
    new Promise((resolve) => {
      if (typeof character !== "string" || !/^[a-z-]+$/.test(character)) {
        return resolve(null);
      }
      const body = JSON.stringify({ character });
      const req = https.request(
        {
          hostname: "www.dofusroom.com",
          path: "/buildroom/spell/getByCharacterAjax",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(body),
            "Referer": "https://www.dofusroom.com/buildroom",
            "User-Agent": "Mozilla/5.0",
          },
          timeout: 10000,
        },
        (res) => {
          if (res.statusCode !== 200) {
            res.resume();
            return resolve(null);
          }
          const chunks = [];
          res.on("data", (c) => chunks.push(c));
          res.on("end", () => {
            try {
              const json = JSON.parse(Buffer.concat(chunks).toString("utf8"));
              resolve(json && json.status === "success" ? json.data : null);
            } catch {
              resolve(null);
            }
          });
        },
      );
      req.on("error", () => resolve(null));
      req.on("timeout", () => {
        req.destroy();
        resolve(null);
      });
      req.write(body);
      req.end();
    }),
  );

  // Proxy de l'API Metamob depuis le process principal. L'API metamob.fr n'envoie AUCUN
  // en-tête CORS → un fetch depuis le renderer est bloqué (« Failed to fetch »). On relaie
  // donc la requête côté Node (pas de CORS). Hôte figé (www.metamob.fr), méthode/chemin/clé
  // fournis par le renderer. Renvoie { ok, status, data } (jamais de rejet).
  ipcMain.handle("metamob:request", (_e, opts) =>
    new Promise((resolve) => {
      const method = String(opts?.method || "GET").toUpperCase();
      const apiKey = typeof opts?.apiKey === "string" ? opts.apiKey : "";
      let reqPath = typeof opts?.path === "string" ? opts.path : "";
      // Sécurité : chemin relatif simple uniquement (pas de saut d'hôte / d'en-tête).
      if (!reqPath.startsWith("/") || /[\s\r\n]/.test(reqPath)) {
        return resolve({ ok: false, status: 0, error: "Chemin invalide." });
      }
      let payload = null;
      if (opts?.body != null) {
        try {
          payload = JSON.stringify(opts.body);
        } catch {
          return resolve({ ok: false, status: 0, error: "Corps invalide." });
        }
      }
      const req = https.request(
        {
          hostname: "www.metamob.fr",
          path: `/api/v1${reqPath}`,
          method,
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${apiKey}`,
            "User-Agent": "DofusCodex",
            ...(payload
              ? { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(payload) }
              : {}),
          },
          timeout: 15000,
        },
        (res) => {
          const chunks = [];
          res.on("data", (c) => chunks.push(c));
          res.on("end", () => {
            const text = Buffer.concat(chunks).toString("utf8");
            let data = null;
            try {
              data = text ? JSON.parse(text) : null;
            } catch {
              data = null;
            }
            const status = res.statusCode || 0;
            resolve({ ok: status >= 200 && status < 300, status, data });
          });
        },
      );
      req.on("error", (err) => resolve({ ok: false, status: 0, error: String(err?.message || err) }));
      req.on("timeout", () => {
        req.destroy();
        resolve({ ok: false, status: 0, error: "timeout" });
      });
      if (payload) req.write(payload);
      req.end();
    }),
  );

  // Flux RSS d'actualités Dofus (www.dofus.com/fr/rss/<cat>.xml). dofus.com est derrière
  // CloudFront, qui bloque les User-Agents non-navigateur (403) et n'envoie aucun en-tête CORS
  // → on relaie depuis le process principal avec un UA navigateur (pas de CORS, pas de blocage).
  // Catégorie validée contre une liste blanche (hôte/chemin figés).
  ipcMain.handle("dofus:news", (_e, category) =>
    new Promise((resolve) => {
      const cat = String(category || "news");
      if (!["news", "changelog", "devblog"].includes(cat)) {
        return resolve({ ok: false, status: 0, error: "Catégorie invalide." });
      }
      const req = https.request(
        {
          hostname: "www.dofus.com",
          path: `/fr/rss/${cat}.xml`,
          method: "GET",
          headers: {
            Accept: "application/xml,text/xml,*/*",
            "Accept-Language": "fr-FR,fr;q=0.9",
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
          timeout: 15000,
        },
        (res) => {
          const chunks = [];
          res.on("data", (c) => chunks.push(c));
          res.on("end", () => {
            const status = res.statusCode || 0;
            resolve({ ok: status >= 200 && status < 300, status, text: Buffer.concat(chunks).toString("utf8") });
          });
        },
      );
      req.on("error", (err) => resolve({ ok: false, status: 0, error: String(err?.message || err) }));
      req.on("timeout", () => {
        req.destroy();
        resolve({ ok: false, status: 0, error: "timeout" });
      });
      req.end();
    }),
  );

  // Page guide DofusPourLesNoobs (Weebly) : pas d'en-tête CORS → on relaie depuis le main.
  // Hôte figé, slug validé (un seul segment alphanum/tiret, pas de saut de chemin/d'hôte).
  ipcMain.handle("dpln:guide", (_e, slug) =>
    new Promise((resolve) => {
      const s = String(slug || "");
      if (!/^[a-z0-9-]+$/.test(s)) {
        return resolve({ ok: false, status: 0, error: "Slug invalide." });
      }
      const req = https.request(
        {
          hostname: "www.dofuspourlesnoobs.com",
          path: `/${s}.html`,
          method: "GET",
          headers: {
            Accept: "text/html,application/xhtml+xml",
            "Accept-Language": "fr-FR,fr;q=0.9",
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
          timeout: 15000,
        },
        (res) => {
          const chunks = [];
          res.on("data", (c) => chunks.push(c));
          res.on("end", () => {
            const status = res.statusCode || 0;
            resolve({ ok: status >= 200 && status < 300, status, text: Buffer.concat(chunks).toString("utf8") });
          });
        },
      );
      req.on("error", (err) => resolve({ ok: false, status: 0, error: String(err?.message || err) }));
      req.on("timeout", () => {
        req.destroy();
        resolve({ ok: false, status: 0, error: "timeout" });
      });
      req.end();
    }),
  );

  initAutoUpdater();
  createLauncherWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      if (!startupLauncherDone) createLauncherWindow();
      else createWindow();
    }
  });
});

// Mises à jour via GitHub Releases (electron-updater) — uniquement en app installée.
//  • Windows : téléchargement auto en fond → bandeau « Redémarrer pour installer ».
//  • macOS (non signé) : on ne télécharge pas (impossible à appliquer sans signature) →
//    bandeau « Nouvelle version dispo → Télécharger » qui ouvre la page des releases.
let autoUpdater = null;
const IS_MAC = process.platform === "darwin";
// Dernier état de maj connu. Le check au démarrage peut émettre `update-available` AVANT que le
// renderer ait enregistré son écouteur (course) → l'event serait perdu. On le mémorise donc, et
// le renderer le récupère au montage via `update:peek` (cf. preload / UpdateBanner).
let lastUpdatePayload = null;
let checkingUpdates = false;
let downloadingUpdate = false;

function updateInfoPayload(info) {
  if (!info) return {};
  return {
    version: info.version || null,
    releaseName: info.releaseName || null,
    releaseDate: info.releaseDate || null,
    releaseNotes: typeof info.releaseNotes === "string" ? info.releaseNotes : Array.isArray(info.releaseNotes) ? info.releaseNotes.map((n) => n?.note || "").filter(Boolean).join("\n") : null,
  };
}

function compareVersion(a, b) {
  const pa = String(a || "").split(".").map((n) => Number.parseInt(n, 10) || 0);
  const pb = String(b || "").split(".").map((n) => Number.parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] || 0) - (pb[i] || 0);
    if (d !== 0) return d > 0 ? 1 : -1;
  }
  return 0;
}

function baseUpdatePayload(state, extra = {}) {
  return {
    state,
    isMac: IS_MAC,
    isPackaged: app.isPackaged,
    current: app.getVersion(),
    releasesUrl: RELEASES_URL,
    canDownloadInApp: !!autoUpdater && !IS_MAC,
    canInstallInApp: !!autoUpdater && !IS_MAC,
    checkedAt: Date.now(),
    ...extra,
  };
}

function sendUpdate(payload) {
  lastUpdatePayload = baseUpdatePayload(payload.state || lastUpdatePayload?.state || "idle", {
    ...(lastUpdatePayload ?? {}),
    ...payload,
  });
  sendLauncherState(lastUpdatePayload);
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("update:event", lastUpdatePayload);
  }
}

// Vérifie sans relancer deux checks coup sur coup (le focus peut spammer).
let lastCheckAt = 0;
const MIN_CHECK_GAP = 1000 * 60 * 10; // 10 min mini entre deux vérifications
let updateFound = false; // une fois la maj détectée, inutile de re-vérifier
let updaterBackgroundStarted = false;

function checkForUpdatesThrottled() {
  if (!autoUpdater || updateFound) return;
  const now = Date.now();
  if (now - lastCheckAt < MIN_CHECK_GAP) return;
  checkForUpdatesNow(false).catch((e) => console.log("[updater] check échoué:", e?.message));
}

function startUpdaterBackgroundChecks() {
  if (!autoUpdater || updaterBackgroundStarted) return;
  updaterBackgroundStarted = true;
  setInterval(checkForUpdatesThrottled, 1000 * 60 * 30);
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.on("focus", checkForUpdatesThrottled);
  }
}

async function checkForUpdatesNow(manual) {
  if (!autoUpdater) {
    const payload = baseUpdatePayload(app.isPackaged ? "unavailable" : "dev", {
      error: app.isPackaged ? "Moteur de mise à jour indisponible." : "Disponible uniquement dans l'application installée.",
    });
    if (manual) sendUpdate(payload);
    return { ok: false, reason: payload.error, current: app.getVersion(), payload };
  }
  if (checkingUpdates) {
    return { ok: true, current: app.getVersion(), latest: lastUpdatePayload?.version ?? null, payload: lastUpdatePayload };
  }
  checkingUpdates = true;
  lastCheckAt = Date.now();
  sendUpdate({ state: "checking", manual });
  try {
    const result = await autoUpdater.checkForUpdates();
    return { ok: true, current: app.getVersion(), latest: result?.updateInfo?.version || null, payload: lastUpdatePayload };
  } catch (e) {
    const message = e?.message || String(e);
    sendUpdate({ state: "error", error: message });
    return { ok: false, reason: message, current: app.getVersion(), payload: lastUpdatePayload };
  } finally {
    checkingUpdates = false;
  }
}

async function downloadUpdateNow() {
  if (!autoUpdater) return { ok: false, reason: "Moteur de mise à jour indisponible." };
  if (IS_MAC) {
    shell.openExternal(RELEASES_URL);
    return { ok: false, reason: "macOS nécessite un téléchargement manuel." };
  }
  if (downloadingUpdate) return { ok: true };
  downloadingUpdate = true;
  sendUpdate({ state: "downloading", percent: lastUpdatePayload?.percent ?? 0 });
  try {
    await autoUpdater.downloadUpdate();
    return { ok: true };
  } catch (e) {
    const message = e?.message || String(e);
    sendUpdate({ state: "error", error: message });
    return { ok: false, reason: message };
  } finally {
    downloadingUpdate = false;
  }
}

function installUpdateNow() {
  if (!autoUpdater || IS_MAC) {
    shell.openExternal(RELEASES_URL);
    return { ok: false };
  }
  autoUpdater.quitAndInstall(false, true);
  return { ok: true };
}

async function runStartupLauncherUpdateFlow() {
  if (launcherFlowRunning) return;
  launcherFlowRunning = true;
  try {
    if (!autoUpdater) {
      const payload = baseUpdatePayload(app.isPackaged ? "unavailable" : "dev", {
        error: app.isPackaged ? "Moteur de mise à jour indisponible." : "Mode développement.",
      });
      sendLauncherState(payload);
      return;
    }

    sendUpdate({ state: "checking", percent: 0 });
    const result = await checkForUpdatesNow(true);
    let state = result?.payload?.state || lastUpdatePayload?.state;
    if ((state === "checking" || state === "available") && result?.latest) {
      state = compareVersion(result.latest, app.getVersion()) > 0 ? "available" : "not-available";
      sendUpdate({ state, version: result.latest });
    }

    if (state === "available" && !IS_MAC) {
      await downloadUpdateNow();
      if (lastUpdatePayload?.state === "downloaded") {
        sendLauncherState(baseUpdatePayload("installing", { ...(lastUpdatePayload ?? {}), percent: 100 }));
        setTimeout(() => installUpdateNow(), 900);
      }
      return;
    }

    if (state === "available" && IS_MAC) {
      sendLauncherState(lastUpdatePayload ?? baseUpdatePayload("available"));
      return;
    }

    if (state === "not-available") {
      return;
    }

    if (state === "dev" || state === "unavailable") {
      return;
    }

    if (!result?.ok) {
      sendLauncherState(lastUpdatePayload ?? baseUpdatePayload("error", { error: result?.reason || "Vérification impossible." }));
    } else {
      sendLauncherState(lastUpdatePayload ?? baseUpdatePayload("not-available"));
    }
  } catch (e) {
    sendLauncherState(baseUpdatePayload("error", { error: e?.message || String(e) }));
  } finally {
    launcherFlowRunning = false;
  }
}

function initAutoUpdater() {
  if (!app.isPackaged) return;
  try {
    autoUpdater = require("electron-updater").autoUpdater;
    autoUpdater.autoInstallOnAppQuit = false;
    autoUpdater.autoDownload = false;
    autoUpdater.allowPrerelease = false;
    autoUpdater.on("error", (e) => {
      console.log("[updater] error:", e?.message);
      sendUpdate({ state: "error", error: e?.message || String(e) });
    });
    autoUpdater.on("update-not-available", (i) => {
      console.log("[updater] à jour");
      sendUpdate({ state: "not-available", ...updateInfoPayload(i) });
    });
    autoUpdater.on("update-available", (i) => {
      updateFound = true; // stoppe les vérifications périodiques/focus
      sendUpdate({ state: "available", ...updateInfoPayload(i) });
    });
    autoUpdater.on("download-progress", (p) =>
      sendUpdate({
        state: "downloading",
        percent: Math.round(p?.percent ?? 0),
        bytesPerSecond: p?.bytesPerSecond ?? null,
        transferred: p?.transferred ?? null,
        total: p?.total ?? null,
      }),
    );
    autoUpdater.on("update-downloaded", (i) => sendUpdate({ state: "downloaded", ...updateInfoPayload(i), percent: 100 }));

    // Le check de démarrage est piloté par le launcher externe. Une fois l'app ouverte,
    // startUpdaterBackgroundChecks() reprend les vérifications périodiques/focus.
  } catch (e) {
    console.log("[updater] indisponible:", e?.message);
  }
}

app.on("window-all-closed", () => {
  stopMacroHelper();
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
  stopMacroHelper();
});
