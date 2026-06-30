const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("dofusCodex", {
  getPlatform: () => ipcRenderer.invoke("app:platform"),
  getAppVersion: () => ipcRenderer.invoke("app:version"),
  renderSkin: (payload) => ipcRenderer.invoke("skin:render", payload),
  getDofusRoomSpells: (character) => ipcRenderer.invoke("dofusroom:spells", character),
  // Proxy API Metamob (contourne l'absence de CORS côté metamob.fr) :
  // { method, path, apiKey, body? } → { ok, status, data, error? }.
  metamobRequest: (opts) => ipcRenderer.invoke("metamob:request", opts),
  // Actualités Dofus : récupère un flux RSS officiel (category: "news" | "changelog" | "devblog")
  // via le process principal (UA navigateur, pas de CORS). → { ok, status, text?, error? }.
  fetchDofusNews: (category) => ipcRenderer.invoke("dofus:news", category),
  // Page guide DofusPourLesNoobs (slug sans .html) via le main (pas de CORS). → { ok, status, text? }.
  fetchDplnGuide: (slug) => ipcRenderer.invoke("dpln:guide", slug),
  // ---- Mises à jour ----
  // cb reçoit l'état complet du launcher de mise à jour.
  onUpdate: (cb) => {
    const handler = (_e, payload) => cb(payload);
    ipcRenderer.on("update:event", handler);
    return () => ipcRenderer.removeListener("update:event", handler);
  },
  installUpdate: () => ipcRenderer.invoke("update:install"),
  openReleases: () => ipcRenderer.invoke("update:open"),
  checkUpdate: () => ipcRenderer.invoke("update:check"),
  downloadUpdate: () => ipcRenderer.invoke("update:download"),
  updateStatus: () => ipcRenderer.invoke("update:status"),
  peekUpdate: () => ipcRenderer.invoke("update:peek"), // état de maj déjà détecté (au montage du renderer)
  // ---- Liens profonds dofuscodex:// (reset de mot de passe) ----
  // cb reçoit l'URL complète (ex. "dofuscodex://reset#access_token=…&type=recovery").
  onDeepLink: (cb) => {
    const handler = (_e, url) => cb(url);
    ipcRenderer.on("deeplink", handler);
    return () => ipcRenderer.removeListener("deeplink", handler);
  },
  peekDeepLink: () => ipcRenderer.invoke("deeplink:peek"), // lien reçu avant le montage du renderer
  // ---- Mode overlay (fenêtre dédiée transparente au-dessus du jeu) ----
  overlayOpen: (target) => ipcRenderer.invoke("overlay:open", target), // (fenêtre principale) ouvre l'overlay sur un chemin interne
  overlayClose: () => ipcRenderer.invoke("overlay:close"), // (fenêtre overlay) ferme + réaffiche la principale
  overlayResize: (size) => ipcRenderer.invoke("overlay:resize", size), // redimensionnement custom {width,height}
  overlaySnapMode: (on) => ipcRenderer.invoke("overlay:snap-mode", on), // accroche+suit la fenêtre Dofus
  onOverlayState: (cb) => {
    const handler = (_e, payload) => cb(payload);
    ipcRenderer.on("overlay:state", handler);
    return () => ipcRenderer.removeListener("overlay:state", handler);
  },
  detectDofus: () => ipcRenderer.invoke("dofus:detect"), // { running } — process Dofus présent ?
  // ---- Moteur macros Windows natif ----
  macrosStatus: () => ipcRenderer.invoke("macros:status"),
  macrosLoadConfig: () => ipcRenderer.invoke("macros:load-config"),
  macrosSaveConfig: (config) => ipcRenderer.invoke("macros:save-config", config),
  macrosStart: (config) => ipcRenderer.invoke("macros:start", config),
  macrosStop: () => ipcRenderer.invoke("macros:stop"),
  macrosSaveAhk: (script) => ipcRenderer.invoke("macros:save-ahk", script),
  macrosOpenAhk: (script) => ipcRenderer.invoke("macros:open-ahk", script),
  macrosDownloadAhk: () => ipcRenderer.invoke("macros:download-ahk"),
  // Lit la progression du profil actif dans l'app Ganymède locale (conf.json).
  // Renvoie { profileName, progresses } ou null (Ganymède non installé / erreur).
  readGanymedeProgress: () => ipcRenderer.invoke("ganymede:read-progress"),
});
