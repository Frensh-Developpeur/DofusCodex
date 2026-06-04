const { app, BrowserWindow, shell, session, ipcMain } = require("electron");
const path = require("node:path");
const https = require("node:https");

const isDev = process.env.NODE_ENV === "development";
const DEV_URL = "http://localhost:5173";

let mainWindow = null;

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
  "https://api.dofusdu.de https://api.dofusdb.fr https://*.dofusdb.fr https://ganymede-app.com https://barbofus.com https://skinator.barbofus.com";
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
    win.webContents.on("console-message", (_e, level, message, line, source) => {
      console.log(`[renderer:${level}] ${message} @ ${source}:${line}`);
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
  session.defaultSession.webRequest.onHeadersReceived((details, cb) => {
    cb({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [buildCsp()],
      },
    });
  });

  ipcMain.handle("app:platform", () => process.platform);
  ipcMain.handle("app:version", () => app.getVersion());

  // Maj : Windows installe en SILENCE puis relance (true, true) → pas de wizard sur la maj,
  // alors que la 1ʳᵉ install (lancement manuel du .exe) garde l'assistant complet.
  ipcMain.handle("update:install", () => autoUpdater?.quitAndInstall(true, true));
  ipcMain.handle("update:open", () => shell.openExternal(RELEASES_URL));

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

function sendUpdate(payload) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("update:event", { isMac: IS_MAC, ...payload });
  }
}

function initAutoUpdater() {
  if (!app.isPackaged) return;
  try {
    autoUpdater = require("electron-updater").autoUpdater;
    // L'installeur est en mode assistant (oneClick:false) pour offrir tous les paramètres à la
    // 1ʳᵉ install. On évite donc l'install-au-quit (qui rejouerait le wizard) ; la maj passe
    // uniquement par quitAndInstall(true) → mode SILENCIEUX (cf. update:install).
    autoUpdater.autoInstallOnAppQuit = false;
    autoUpdater.autoDownload = !IS_MAC; // mac : juste détecter, pas télécharger
    autoUpdater.on("error", (e) => console.log("[updater] error:", e?.message));
    autoUpdater.on("update-not-available", () => console.log("[updater] à jour"));
    autoUpdater.on("update-available", (i) => sendUpdate({ state: "available", version: i?.version }));
    autoUpdater.on("download-progress", (p) =>
      sendUpdate({ state: "downloading", percent: Math.round(p?.percent ?? 0) }),
    );
    autoUpdater.on("update-downloaded", (i) => sendUpdate({ state: "downloaded", version: i?.version }));
    autoUpdater.checkForUpdates();
    setInterval(() => autoUpdater.checkForUpdates(), 1000 * 60 * 60 * 6);
  } catch (e) {
    console.log("[updater] indisponible:", e?.message);
  }
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
