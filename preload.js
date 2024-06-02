// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('poleAPI', {
  clear:    () => ipcRenderer.invoke('clear'),
  reset:    () => ipcRenderer.invoke('reset'),
  write:    (res) => ipcRenderer.send('write', res),
  connect:  (port) => ipcRenderer.send('connect', port),
  display:  (callback) => ipcRenderer.on('display', callback),
  ping:     () => ipcRenderer.invoke('ping')
});