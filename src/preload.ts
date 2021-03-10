const { contextBridge, ipcRenderer } = require('electron')

declare interface Window {
  electron: {
    openFileDialog(): void
  }
}

contextBridge.exposeInMainWorld(
  'electron',
  {
    openFileDialog: () => ipcRenderer.send('open-file-dialog')
  }
)