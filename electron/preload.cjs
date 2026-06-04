const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("dofusCodex", {
  getPlatform: () => ipcRenderer.invoke("app:platform"),
  getAppVersion: () => ipcRenderer.invoke("app:version"),
  renderSkin: (payload) => ipcRenderer.invoke("skin:render", payload),
  getDofusRoomSpells: (character) => ipcRenderer.invoke("dofusroom:spells", character),
  // ---- Mises à jour ----
  // cb reçoit { state: "available" | "downloading" | "downloaded", version?, percent?, isMac }
  onUpdate: (cb) => {
    const handler = (_e, payload) => cb(payload);
    ipcRenderer.on("update:event", handler);
    return () => ipcRenderer.removeListener("update:event", handler);
  },
  installUpdate: () => ipcRenderer.invoke("update:install"), // Windows : redémarre + installe
  openReleases: () => ipcRenderer.invoke("update:open"), // Mac : ouvre la page de téléchargement
});
