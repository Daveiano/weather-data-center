import { app, BrowserWindow, ipcMain, dialog, session } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import type { Document } from 'nedb';

import fs from 'fs';

import async from "async";
import moment from 'moment';
import csv from 'csv-parser';
import Datastore from 'nedb';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const db = new Datastore({
  autoload: true,
  // On ubuntu this is /home/{username}/.config/weather-data-center.
  filename: `${app.getPath('userData')}/nedb/data`
});

type asyncCallback = (error: string|null, results: number|string) => void;
const count = (callback: asyncCallback) => {
  db.count({}, (err, count) => {
    callback(null, count);
  });
};
const start = (callback: asyncCallback) => {
  db.find({}).sort({ time: 1 }).limit(1).exec((err, docs: Document<{ time: number }>[]) => {
    if (docs.length > 0) {
      return callback(null, moment.unix(docs[0].time).format('DD-MM-YYYY'));
    }

    callback(null, 0);
  });
};
const end = (callback: asyncCallback) => {
  db.find({}).sort({ time: -1 }).limit(1).exec((err, docs: Document<{ time: number }>[]) => {
    if (docs.length > 0) {
      return callback(null, moment.unix(docs[0].time).format('DD-MM-YYYY'));
    }

    callback(null, 0);
  });
};

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 1080,
    width: 1920,
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
          async.parallel({
              count,
              start,
              end
            },
            (error, results) => {
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
  if (process.env.NODE_ENV === 'develop') {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then(name => {
        console.log(`Added Extension:  ${name}`);
        createWindow();
      })
      .catch(err => console.log('An error occurred: ', err));
    } else {
      createWindow();
  }
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
const columnsToRead: string[] = ['time', 'temperature', 'humidity', 'pressure', 'rain', 'solar', 'uvi', 'wind', 'wind_direction', 'gust', 'dew_point', 'felt_temperature'];

ipcMain.on('query-data',(event) => {
  db.find({ time: { $exists: true } }).sort({ time: 1 }).exec((err, docs: Document<{ time: number }>[]) => {
    event.reply(
      'query-data',
      docs
        .map((doc, index) => ({
          ...doc,
          timeParsed: moment.unix(doc.time).toISOString(),
          id: index.toString()
        }))
    );
  });
});

ipcMain.on('open-file-dialog', (event) => {
  dialog.showOpenDialog({
    title: 'Select your data',
    filters: [
      { name: 'CSV', extensions: ['csv'] }
    ],
    properties: ['openFile']
  }).then(result => {
    if (!result.canceled) {
      const parsedData: [any?] = [],
        columnsToParseFloat: string[] = ['temperature', 'humidity', 'pressure', 'rain', 'solar', 'wind', 'gust', 'dew_point', 'felt_temperature'],
        columnsToParseInt: string[] = ['uvi', 'wind_direction'];

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

            if (columnsToParseInt.includes(header)) {
              return parseInt(value);
            }

            return value;
          }
        }))
        .on('data', data =>  parsedData.push(data))
        .on('end', () => {
          // Check for duplicates.
          let duplicates = 0,
            deDuplicatedData: any[] = [];

          async.each(parsedData, (record, callback) => {
            db.count({ "time": record.time },  (err, count)  => {
              if (count) {
                duplicates += 1;
              } else {
                deDuplicatedData = [record, ...deDuplicatedData];
              }
              callback();
            });
          }, () => {
            db.insert(deDuplicatedData, () => {
              db.find({ time: { $exists: true } }).sort({ time: 1 }).exec((err, docs: Document<{ time: number }>[]) => {
                event.reply(
                  'query-data',
                  docs
                    .map((doc, index) => ({
                      ...doc,
                      timeParsed: moment.unix(doc.time).toISOString(),
                      id: index.toString()
                    }))
                );

                event.reply('app-is-loading', false);
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