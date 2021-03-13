import { app, BrowserWindow, ipcMain, dialog, remote } from 'electron';
import fs from 'fs';
const csv = require('csv-parser');
const Datastore = require('nedb');

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: any;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const db = new Datastore({
  autoload: true,
  filename: `${app.getPath('userData')}/nedb/data`
});

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 800,
    width: 1200,
    webPreferences: {
      //nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
ipcMain.on('user-has-data',(event, arg) => {
  console.log('was geht?');
  db.count({}, (err: any, count: number) => {
    event.reply('user-has-data', count);
  });
});

ipcMain.on('open-file-dialog', (event, arg) => {
  console.log(app.getPath('userData'));
  dialog.showOpenDialog({
    title: 'Select your data',
    filters: [
      { name: 'CSV', extensions: ['csv'] }
    ],
    properties: ['openFile']
  }).then(result => {
    if (!result.canceled) {
      const parsedData: [any?] = [],
        columnsToRead: string[] = ['Zeit', 'Temperatur', 'Luftfeuchtigkeit', 'Luftdruck'];

      fs.createReadStream(result.filePaths[0])
        // TODO: Create timestamp.
        .pipe(csv({
          separator: ',',
          mapHeaders: ({ header}) => columnsToRead.includes(header) ? header : null
        }))
        .on('data', (data: any) =>  parsedData.push(data))
        .on('end', () => {
          console.log(parsedData);
          db.insert(parsedData, () => {
            event.reply('user-has-data', parsedData.length);
            event.reply('loaded-raw-csv-data', parsedData);
            event.reply('app-is-loading', false);
          });
        });

    } else {
      event.reply('app-is-loading', false);
    }
  }).catch(err => {
    console.log(err);
  });
});