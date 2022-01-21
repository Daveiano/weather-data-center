import { contextBridge, ipcRenderer } from 'electron';

const validChannels = [
  "open-file-dialog",
  "app-is-loading",
  "query-data",
  "number-of-duplicates",
  'config',
  'config-saved',
  'delete'
];

declare global {
  interface Window {
    electron: {
      IpcSend(channel: string, data: unknown[]): void,
      IpcOn(channel: string, callback: (event: unknown, ...args: any) => void): () => void
    }
  }
}

/**
 * @see https://stackoverflow.com/questions/59993468/electron-contextbridge/63894861#63894861
 * @see https://www.npmjs.com/package/electron-typescript-ipc
 */
contextBridge.exposeInMainWorld(
  'electron',
  {
    IpcSend: (channel: string, data: unknown[]) => {
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    IpcOn: (channel: string, listener: (event: unknown, ...args: any) => void) => {
      if (validChannels.includes(channel)) {
        const subscription = (event: unknown, ...args: any) => listener(event, args);

        ipcRenderer.on(channel, subscription);
        return () => {
          ipcRenderer.removeListener(channel, subscription);
        };
      }
    }
  }
)