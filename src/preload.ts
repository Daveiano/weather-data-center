const { contextBridge, ipcRenderer } = require('electron');
const validChannels = ["open-file-dialog", "loaded-raw-csv-data", "app-is-loading", "query-data", "number-of-duplicates"];

declare interface Window {
  electron: {
    IpcSend(channel: string, data: any[]): void,
    IpcOn(channel: string, callback: (event: any, ...args: any) => void): () => void
  }
}

/**
 * @see https://stackoverflow.com/questions/59993468/electron-contextbridge/63894861#63894861
 * see https://stackoverflow.com/questions/68940343/remove-event-listener-from-preload-js-in-electron-created-by-react-component
 */
contextBridge.exposeInMainWorld(
  'electron',
  {
    IpcSend: (channel: string, data: any[]) => {
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    IpcOn: (channel: string, listener: (event: any, ...args: any) => void) => {
      if (validChannels.includes(channel)) {
        const subscription = (event: any, ...args: any) => listener(event, args);

        ipcRenderer.on(channel, subscription);
        return () => {
          ipcRenderer.removeListener(channel, subscription);
        };
      }
    }
  }
)