import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

const validChannels = [
  "open-file-dialog",
  "app-is-loading",
  "query-data",
  "number-of-duplicates",
  "config",
  "config-saved",
  "delete",
  "delete-all",
];

declare global {
  interface Window {
    electron: {
      IpcSend(channel: string, data: unknown[]): void;
      IpcOn(
        channel: string,
        callback: (event: IpcRendererEvent, ...args: never) => void
      ): () => void;
    };
  }
}

/**
 * @see https://stackoverflow.com/questions/59993468/electron-contextbridge/63894861#63894861
 * @see https://www.npmjs.com/package/electron-typescript-ipc
 */
contextBridge.exposeInMainWorld("electron", {
  IpcSend: (channel: string, data: never) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  IpcOn: (
    channel: string,
    listener: (event: IpcRendererEvent, ...args: never) => void
  ) => {
    if (validChannels.includes(channel)) {
      const subscription = (event: IpcRendererEvent, ...args: never) =>
        listener(event, args);

      ipcRenderer.on(channel, subscription);
      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    }
  },
});
