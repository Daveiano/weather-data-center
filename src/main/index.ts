import {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  session,
  shell,
  IpcMainEvent,
} from "electron";

import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";

import fs from "fs";
import async from "async";
import moment from "moment";
import csv from "csv-parser";
import Datastore from "@seald-io/nedb";

import { dataItem } from "../renderer/diagrams/types";
import { ImportSettingsFormValues } from "../renderer/components/import-settings-modal";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

type ConfigRecord = {
  type: string;
} & ImportSettingsFormValues;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const db = new Datastore({
  autoload: true,
  // On ubuntu this is /home/{username}/.config/weather-data-center.
  filename: `${app.getPath("userData")}/nedb/data`,
});

// Check if config record is present, if not create it.
let config: ConfigRecord = {
  type: "config",
  import_date_format: "YYYY/M/D k:mm",
  header_time: "Date",
  unit_temperature: "°C",
  header_temperature: "Outdoor Temperature (°C)",
  header_felt_temperature: "Feels Like (°C)",
  header_dew_point: "Dew Point (°C)",
  unit_rain: "mm",
  header_rain: "Daily Rain (mm)",
  unit_humidity: "%",
  header_humidity: "Outdoor Humidity (%)",
  unit_pressure: "hPa",
  header_pressure: "Relative Pressure (hPa)",
  unit_wind: "km/h",
  unit_wind_direction: "°",
  header_wind: "Wind Speed (kmh)",
  header_wind_direction: "Wind Direction (°)",
  header_gust: "Wind Gust (kmh)",
  unit_solar: "w/m²",
  header_solar: "Solar Radiation (W/m^2)",
  header_uvi: "Ultra-Violet Radiation Index",
};

db.find({ type: "config" })
  .limit(1)
  .exec((err, docs: ConfigRecord[]) => {
    if (docs.length) {
      config = docs[0];
    } else {
      db.insert(config);
    }
  });

type asyncCallback = (error: string | null, results: number | string) => void;
const count = (callback: asyncCallback) => {
  db.count({}, (err, count) => {
    callback(null, count);
  });
};
const start = (callback: asyncCallback) => {
  db.find({})
    .sort({ time: 1 })
    .limit(1)
    .exec((err, docs: { time: number }[]) => {
      if (docs.length > 0) {
        return callback(null, moment.unix(docs[0].time).format("DD-MM-YYYY"));
      }

      callback(null, 0);
    });
};
const end = (callback: asyncCallback) => {
  db.find({})
    .sort({ time: -1 })
    .limit(1)
    .exec((err, docs: { time: number }[]) => {
      if (docs.length > 0) {
        return callback(null, moment.unix(docs[0].time).format("DD-MM-YYYY"));
      }

      callback(null, 0);
    });
};

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 1000,
    width: 1920,
    minHeight: 768,
    minWidth: 1330,
    autoHideMenuBar: true,
    icon: `${__dirname
      .replace(".webpack/main", "")
      .replace(
        "out/weather-data-center-linux-x64/resources/app/",
        ""
      )}src/assets/weather-data-center-icon.png`,
    webPreferences: {
      //nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // Open weblinks in browser, not in electron mainWindow.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  async.parallel(
    {
      count,
      start,
      end,
    },
    (error, results) => {
      // Load the index.html of the app.
      mainWindow
        .loadURL(
          `${MAIN_WINDOW_WEBPACK_ENTRY}?has_data=${results.count}&start=${results.start}&end=${results.end}`
        )
        .then(() => {
          // Append the basic url data parameters to every main page call.
          session.defaultSession.webRequest.onBeforeRequest(
            { urls: ["*://*/main_window"] },
            (details, callback) => {
              async.parallel(
                {
                  count,
                  start,
                  end,
                },
                (error, results) => {
                  return callback({
                    redirectURL: `${details.url}?has_data=${results.count}&start=${results.start}&end=${results.end}`,
                  });
                }
              );
            }
          );
        });
    }
  );
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  if (process.env.NODE_ENV === "develop") {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => {
        console.log(`Added Extension:  ${name}`);
        createWindow();
      })
      .catch((err) => console.log("An error occurred: ", err));
  } else {
    createWindow();
  }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
const queryData = (
  event: IpcMainEvent,
  replies?: { name: string; data: boolean | number[] }[]
): void => {
  db.find({ time: { $exists: true } })
    .sort({ time: 1 })
    .exec((err, docs: { time: number }[]) => {
      event.reply(
        "query-data",
        docs.map((doc, index) => ({
          ...doc,
          timeParsed: moment.unix(doc.time).toISOString(),
          id: index.toString(),
        }))
      );

      if (replies && replies.length) {
        replies.forEach((reply) => event.reply(reply.name, reply.data));
      }
    });
};

ipcMain.on("query-data", (event) => {
  queryData(event);
});

ipcMain.on("config", (event, args) => {
  if (!args) {
    event.reply("config", config);
  } else {
    db.update({ type: "config" }, { $set: args[0] }, {}, () => {
      config = args[0];
      event.reply("config", config);
      event.reply("config-saved");
    });
  }
});

ipcMain.on("delete", (event, arg) => {
  db.remove(
    { _id: { $in: arg.map((item: dataItem) => item._id) } },
    {
      multi: arg.length > 1,
    },
    (error) => {
      if (!error) {
        queryData(event);
      }
    }
  );
});

ipcMain.on("delete-all", (event, arg) => {
  // @todo Implement & add test
  db.remove({ type: { $exists: false } }, { multi: true }, (error) => {
    if (!error) {
      queryData(event, [{ name: "app-is-loading", data: false }]);
    }
  });
});

ipcMain.on("open-file-dialog", (event) => {
  const columnsToRead = {
    [config.header_time]: "time",
    [config.header_temperature]: "temperature",
    [config.header_humidity]: "humidity",
    [config.header_pressure]: "pressure",
    [config.header_rain]: "rain",
    [config.header_solar]: "solar",
    [config.header_uvi]: "uvi",
    [config.header_wind]: "wind",
    [config.header_wind_direction]: "wind_direction",
    [config.header_gust]: "gust",
    [config.header_dew_point]: "dew_point",
    [config.header_felt_temperature]: "felt_temperature",
  };

  dialog
    .showOpenDialog({
      title: "Select your data",
      filters: [{ name: "CSV", extensions: ["csv"] }],
      properties: ["openFile"],
    })
    .then((result) => {
      if (!result.canceled) {
        const parsedData: dataItem[] = [],
          columnsToParseFloat = [
            "temperature",
            "humidity",
            "pressure",
            "rain",
            "solar",
            "wind",
            "gust",
            "dew_point",
            "felt_temperature",
          ],
          columnsToParseInt = ["uvi", "wind_direction"];

        fs.createReadStream(result.filePaths[0])
          // @todo This could be the point to analyze the data header names and units and automatically set it.
          //.pipe()
          .pipe(
            csv({
              separator: ",",
              mapHeaders: ({ header }) =>
                Object.keys(columnsToRead).includes(header)
                  ? columnsToRead[header]
                  : null,
              mapValues: ({ header, value }) => {
                if (header === "time") {
                  return moment(value, config.import_date_format).unix();
                }

                if (columnsToParseFloat.includes(header)) {
                  return parseFloat(value);
                }

                if (columnsToParseInt.includes(header)) {
                  return parseInt(value);
                }

                return value;
              },
            })
          )
          .on("data", (data) => parsedData.push(data))
          .on("end", () => {
            // Check for duplicates.
            let duplicates = 0,
              deDuplicatedData: dataItem[] = [];

            async.each(
              parsedData,
              (record, callback) => {
                db.count({ time: record.time }, (err, count) => {
                  if (count) {
                    duplicates += 1;
                  } else {
                    deDuplicatedData = [record, ...deDuplicatedData];
                  }
                  callback();
                });
              },
              () => {
                db.insert(deDuplicatedData, () => {
                  queryData(event, [
                    {
                      name: "number-of-duplicates",
                      data: [duplicates, deDuplicatedData.length],
                    },
                    { name: "app-is-loading", data: false },
                  ]);
                });
              }
            );
          });
      } else {
        event.reply("app-is-loading", false);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
