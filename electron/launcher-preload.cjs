const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("dofusCodexLauncher", {
  onState: (cb) => {
    const handler = (_e, payload) => cb(payload);
    ipcRenderer.on("launcher:state", handler);
    return () => ipcRenderer.removeListener("launcher:state", handler);
  },
  retry: () => ipcRenderer.invoke("launcher:retry"),
  ready: () => ipcRenderer.invoke("launcher:ready"),
  continueToApp: () => ipcRenderer.invoke("launcher:continue"),
  install: () => ipcRenderer.invoke("launcher:install"),
  openReleases: () => ipcRenderer.invoke("launcher:open-releases"),
  quit: () => ipcRenderer.invoke("launcher:quit"),
});
