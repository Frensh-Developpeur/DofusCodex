const { app, BrowserWindow, shell, session, ipcMain, screen } = require("electron");
const path = require("node:path");
const https = require("node:https");
const fs = require("node:fs");
const os = require("node:os");
const { exec } = require("node:child_process");

const isDev = process.env.NODE_ENV === "development";
const DEV_URL = "http://localhost:5173";

let mainWindow = null;

// ── Liens profonds dofuscodex:// (réinitialisation de mot de passe, etc.) ──────────────
// L'e-mail de reset Supabase redirige vers `dofuscodex://reset#access_token=…` ; l'OS ouvre
// alors l'app avec cette URL, qu'on transmet au renderer (cf. handleAuthDeepLink côté React).
const PROTOCOL = "dofuscodex";
let pendingDeepLink = null; // lien arrivé avant que le renderer soit prêt (cold start / course)

// Mode overlay = fenêtre DÉDIÉE transparente, flottante au-dessus du jeu (la fenêtre principale
// reste intacte, juste masquée). Dimensions/position persistées sur disque.
const OVERLAY_MIN = { width: 180, height: 120 };
let overlayWin = null;
let overlayBounds = null; // dernières dimensions/position de l'overlay
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

// Maintient la fenêtre overlay au premier plan, y compris au-dessus d'un jeu en plein écran
// fenêtré. Re-appliqué au blur car perdre le focus la ferait sinon repasser derrière.
function enforceOverlayOnTop() {
  if (!overlayWin || overlayWin.isDestroyed()) return;
  overlayWin.setAlwaysOnTop(true, "screen-saver");
  if (process.platform === "darwin") {
    // CanJoinAllSpaces + FullScreenAuxiliary → la fenêtre apparaît AUSSI par-dessus un jeu en
    // plein écran natif (qui vit dans un Espace dédié). skipTransformProcessType : garde l'app
    // « normale » (sinon l'icône du Dock peut sauter).
    overlayWin.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true, skipTransformProcessType: true });
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

function openOverlayWindow(guideId) {
  if (overlayWin && !overlayWin.isDestroyed()) {
    overlayWin.focus();
    return;
  }
  const b = overlayBounds || defaultOverlayBounds();
  overlayWin = new BrowserWindow({
    x: b.x,
    y: b.y,
    width: b.width,
    height: b.height,
    minWidth: OVERLAY_MIN.width,
    minHeight: OVERLAY_MIN.height,
    frame: false,
    transparent: true,
    resizable: true,
    hasShadow: false,
    backgroundColor: "#00000000",
    alwaysOnTop: true,
    fullscreenable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false,
    },
  });
  startOverlayLoop();
  overlayWin.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://")) shell.openExternal(url);
    return { action: "deny" };
  });
  if (isDev) {
    overlayWin.loadURL(`${DEV_URL}/?overlay=1#/guides/${guideId}`);
  } else {
    overlayWin.loadFile(path.join(__dirname, "..", "dist", "index.html"), {
      query: { overlay: "1" },
      hash: `/guides/${guideId}`,
    });
  }
  overlayWin.on("blur", enforceOverlayOnTop);
  const remember = () => {
    if (overlayWin && !overlayWin.isDestroyed()) {
      overlayBounds = overlayWin.getBounds();
      saveOverlayBoundsDebounced();
    }
  };
  overlayWin.on("resize", remember);
  overlayWin.on("move", remember);
  overlayWin.on("closed", () => {
    stopOverlayLoop();
    snapMode = false;
    overlayWin = null;
    if (mainWindow && !mainWindow.isDestroyed()) mainWindow.show();
  });
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.hide();
}

function closeOverlayWindow() {
  if (overlayWin && !overlayWin.isDestroyed()) overlayWin.close(); // 'closed' réaffiche la principale
  else if (mainWindow && !mainWindow.isDestroyed()) mainWindow.show();
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
  if (!overlayWin || overlayWin.isDestroyed()) return;
  const db = await getDofusBounds();
  if (!db) {
    lastDofusBounds = null;
    return;
  }
  if (lastDofusBounds) {
    const dx = db.x - lastDofusBounds.x;
    const dy = db.y - lastDofusBounds.y;
    if (dx !== 0 || dy !== 0) {
      const b = overlayWin.getBounds();
      overlayWin.setPosition(Math.round(b.x + dx), Math.round(b.y + dy));
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
    `img-src 'self' data: https: ${API_HOSTS}`,
    `connect-src ${connectSrc}`,
    "frame-src https://barbofus.com https://skinator.barbofus.com",
    "object-src 'none'",
    "base-uri 'self'",
  ].join("; ");
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 1040,
    minHeight: 680,
    show: false,
    backgroundColor: "#070912",
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

  // Maj : on lance l'installeur AVEC son UI (isSilent=false) → l'utilisateur voit la barre de
  // progression NSIS pendant la mise à jour, puis l'app se relance (isForceRunAfter=true).
  ipcMain.handle("update:install", () => autoUpdater?.quitAndInstall(false, true));
  ipcMain.handle("update:open", () => shell.openExternal(RELEASES_URL));
  // État de maj déjà détecté (rejoue l'event manqué si le renderer s'est monté après le check).
  ipcMain.handle("update:peek", () => lastUpdatePayload);
  // Lien profond arrivé avant que le renderer soit prêt (cold start) → récupéré au montage.
  ipcMain.handle("deeplink:peek", () => {
    const u = pendingDeepLink;
    pendingDeepLink = null;
    return u;
  });

  // ── Mode overlay : fenêtre dédiée transparente au-dessus du jeu ───────────────────────
  ipcMain.handle("overlay:open", (_e, guideId) => openOverlayWindow(Number(guideId)));
  ipcMain.handle("overlay:close", () => closeOverlayWindow());
  ipcMain.handle("overlay:resize", (_e, size) => {
    if (!overlayWin || overlayWin.isDestroyed() || !size) return;
    const w = Math.max(OVERLAY_MIN.width, Math.round(Number(size.width) || OVERLAY_MIN.width));
    const h = Math.max(OVERLAY_MIN.height, Math.round(Number(size.height) || OVERLAY_MIN.height));
    overlayWin.setSize(w, h);
  });
  ipcMain.handle("overlay:snap-mode", (_e, on) => {
    snapMode = !!on;
    lastDofusBounds = null; // re-base le suivi (pas de saut au prochain tick)
    if (snapMode) dockOverlay();
  });
  ipcMain.handle("dofus:detect", () => detectDofus());

  // Vérification manuelle (bouton page Paramètres). Renvoie la version locale + la dernière
  // version publiée ; si une maj existe, l'événement `update-available` déclenchera le bandeau.
  ipcMain.handle("update:check", async () => {
    if (!autoUpdater) return { ok: false, reason: app.isPackaged ? "unavailable" : "dev", current: app.getVersion() };
    try {
      lastCheckAt = Date.now(); // compte comme une vérification (évite un double check au focus)
      const r = await autoUpdater.checkForUpdates();
      return { ok: true, current: app.getVersion(), latest: r?.updateInfo?.version || null };
    } catch (e) {
      return { ok: false, reason: e?.message || "error", current: app.getVersion() };
    }
  });

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

  createWindow();
  initAutoUpdater();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
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

function sendUpdate(payload) {
  lastUpdatePayload = { isMac: IS_MAC, ...payload };
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("update:event", lastUpdatePayload);
  }
}

// Vérifie sans relancer deux checks coup sur coup (le focus peut spammer).
let lastCheckAt = 0;
const MIN_CHECK_GAP = 1000 * 60 * 10; // 10 min mini entre deux vérifications
let updateFound = false; // une fois la maj détectée, inutile de re-vérifier

function checkForUpdatesThrottled() {
  if (!autoUpdater || updateFound) return;
  const now = Date.now();
  if (now - lastCheckAt < MIN_CHECK_GAP) return;
  lastCheckAt = now;
  autoUpdater.checkForUpdates().catch((e) => console.log("[updater] check échoué:", e?.message));
}

function initAutoUpdater() {
  if (!app.isPackaged) return;
  try {
    autoUpdater = require("electron-updater").autoUpdater;
    // L'installeur est en mode assistant (oneClick:false). On évite l'install-au-quit
    // automatique ; la maj passe par quitAndInstall(false) → l'installeur s'affiche AVEC sa
    // barre de progression (visuel demandé), puis relance l'app (cf. update:install).
    autoUpdater.autoInstallOnAppQuit = false;
    autoUpdater.autoDownload = !IS_MAC; // mac : juste détecter, pas télécharger
    autoUpdater.on("error", (e) => console.log("[updater] error:", e?.message));
    autoUpdater.on("update-not-available", () => console.log("[updater] à jour"));
    autoUpdater.on("update-available", (i) => {
      updateFound = true; // stoppe les vérifications périodiques/focus
      sendUpdate({ state: "available", version: i?.version });
    });
    autoUpdater.on("download-progress", (p) =>
      sendUpdate({ state: "downloading", percent: Math.round(p?.percent ?? 0) }),
    );
    autoUpdater.on("update-downloaded", (i) => sendUpdate({ state: "downloaded", version: i?.version }));

    // 1) Au démarrage. 2) Toutes les 30 min tant que l'app reste ouverte.
    // 3) Au retour de focus sur la fenêtre (throttlé) → détection quasi immédiate après
    //    une release, sans attendre le tick périodique ni un redémarrage de l'app.
    lastCheckAt = Date.now();
    autoUpdater.checkForUpdates().catch((e) => console.log("[updater] check échoué:", e?.message));
    setInterval(checkForUpdatesThrottled, 1000 * 60 * 30);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.on("focus", checkForUpdatesThrottled);
    }
  } catch (e) {
    console.log("[updater] indisponible:", e?.message);
  }
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
