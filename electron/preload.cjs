const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("dofusCodex", {
  getPlatform: () => ipcRenderer.invoke("app:platform"),
  getAppVersion: () => ipcRenderer.invoke("app:version"),
  renderSkin: (payload) => ipcRenderer.invoke("skin:render", payload),
  getDofusRoomSpells: (character) => ipcRenderer.invoke("dofusroom:spells", character),
  // Proxy API Metamob (contourne l'absence de CORS côté metamob.fr) :
  // { method, path, apiKey, body? } → { ok, status, data, error? }.
  metamobRequest: (opts) => ipcRenderer.invoke("metamob:request", opts),
  // ---- Mises à jour ----
  // cb reçoit { state: "available" | "downloading" | "downloaded", version?, percent?, isMac }
  onUpdate: (cb) => {
    const handler = (_e, payload) => cb(payload);
    ipcRenderer.on("update:event", handler);
    return () => ipcRenderer.removeListener("update:event", handler);
  },
  installUpdate: () => ipcRenderer.invoke("update:install"), // Windows : redémarre + installe
  openReleases: () => ipcRenderer.invoke("update:open"), // Mac : ouvre la page de téléchargement
  checkUpdate: () => ipcRenderer.invoke("update:check"), // vérification manuelle (page Paramètres)
  // Lit la progression du profil actif dans l'app Ganymède locale (conf.json).
  // Renvoie { profileName, progresses } ou null (Ganymède non installé / erreur).
  readGanymedeProgress: () => ipcRenderer.invoke("ganymede:read-progress"),
});
