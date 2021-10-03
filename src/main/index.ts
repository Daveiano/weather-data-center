import { app, BrowserWindow, ipcMain, dialog, session, protocol } from 'electron';
import fs from 'fs';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
const async = require("async");
const moment = require('moment');
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
  // On linux this is /home/{username}/.config/weather-data-center.
  filename: `${app.getPath('userData')}/nedb/data`
});

//db.ensureIndex({ fieldName: 'Zeit' });

type asyncCallback = (error: any, results: any) => void;
const count = (callback: asyncCallback) => {
  db.count({}, (err: any, count: number) => {
    callback(null, count);
  });
};
const start = (callback: asyncCallback) => {
  db.find({}).sort({ time: 1 }).limit(1).exec((err: any, docs: any) => {
    if (docs.length > 0) {
      callback(null, moment.unix(docs[0].time).format('DD-MM-YYYY'));
    }

    callback(null, 0);
  });
};
const end = (callback: asyncCallback) => {
  db.find({}).sort({ time: -1 }).limit(1).exec((err: any, docs: any) => {
    if (docs.length > 0) {
      callback(null, moment.unix(docs[0].time).format('DD-MM-YYYY'));
    }

    callback(null, 0);
  });
};

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 800,
    width: 1200,
    minHeight: 600,
    minWidth: 1200,
    webPreferences: {
      //nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    }
  });

  async.parallel({
      count,
      start,
      end
    },
    (error, results) => {
      // Load the index.html of the app.
      mainWindow.loadURL(`${MAIN_WINDOW_WEBPACK_ENTRY}?has_data=${results.count}&start=${results.start}&end=${results.end}`).then(() => {
        // Append the basic url data parameters to every main page call.
        session.defaultSession.webRequest.onBeforeRequest({ urls: ["*://*/main_window"] }, (details, callback) => {
          console.log(details.url);
          async.parallel({
              count,
              start,
              end
            },
            (error: any, results: any) => {
              return callback({
                redirectURL: `${details.url}?has_data=${results.count}&start=${results.start}&end=${results.end}`
              });
            });
        });
      });
    });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name: string) => {
      console.log(`Added Extension:  ${name}`);
      createWindow();
    })
    .catch((err: any) => console.log('An error occurred: ', err));
});

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
ipcMain.on('query-temperature',(event, arg) => {
  db.find({ temperature: { $exists: true } }, { temperature: 1, time: 1 }).sort({ time: 1 }).exec((err, docs) => {
    event.reply(
      'query-temperature',
      docs
        .map(doc => ({ ...doc, group: 'Data', timeParsed: moment.unix(doc.time).toISOString() }))
    );
  });
});

ipcMain.on('query-data',(event, arg) => {
  db.find({ time: { $exists: true } }).sort({ time: 1 }).exec((err, docs) => {
    event.reply(
      'query-data',
      docs
        .map(doc => ({ ...doc, group: 'data', timeParsed: moment.unix(doc.time).toISOString() }))
    );
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
        columnsToRead: string[] = ['time', 'temperature', 'humidity', 'pressure', 'rain'],
        columnsToParseFloat: string[] = ['temperature', 'humidity', 'pressure', 'rain'];

      fs.createReadStream(result.filePaths[0])
        .pipe(csv({
          separator: ',',
          mapHeaders: ({ header}) => columnsToRead.includes(header) ? header : null,
          mapValues: ({ header, index, value }) => {
            if (header === 'time') {
              return moment(value, 'YYYY/M/D k:m').unix();
            }

            if (columnsToParseFloat.includes(header)) {
              return parseFloat(value);
            }

            return value;
          }
        }))
        .on('data', (data: any) =>  parsedData.push(data))
        .on('end', () => {
          // Check for duplicates.
          let duplicates = 0,
            deDuplicatedData: any[] = [];

          async.each(parsedData, (record: any, callback) => {
            db.count({ "time": record.time },  (err: any, count: number)  => {
              console.log('count', count);
              if (count) {
                duplicates += 1;
              } else {
                deDuplicatedData = [record, ...deDuplicatedData];
              }
              callback();
            });
          }, (error: any) => {
            db.insert(deDuplicatedData, () => {
              db.count({}, (err: any, count: number) => {
                event.reply('user-has-data', count);
                // @todo: Display in renderer.
                event.reply('query-data', deDuplicatedData);
                event.reply('app-is-loading', false);
                // @todo: Display in renderer.
                event.reply('number-of-duplicates', duplicates);
              });
            });
          });
        });

    } else {
      event.reply('app-is-loading', false);
    }
  }).catch(err => {
    console.log(err);
  });
});