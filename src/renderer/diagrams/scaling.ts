import { dataItem } from './types';
import moment from "moment";
import {AxisProps} from "@nivo/axes";

export type dateTimeElement = {
  time: number,
  date: string,
  values: number[]
}

export type propertyParameter = 'humidity' |
  'pressure' |
  'temperature' |
  'rain' |
  'solar' |
  'uvi' |
  'wind' |
  'gust' |
  'wind_direction' |
  'dew_point' |
  'felt_temperature';

export type extendedPropertyParameter = propertyParameter |
  'timeParsed' |
  'temperature_min' |
  'temperature_max' |
  'temperature_average';

export type Precision = 'day' | 'week' | 'month' | 'year';

interface Dates {
  [key: string]: dateTimeElement
}

/**
 * Calculate axis bottom time series ticks for line charts.
 *
 * @param data the data to process.
 */
export const getTimeAxisScaling = (data: dataItem[]): AxisProps => {
  const timeDifferenceInDays = getTimeDifferenceInDays(data);
  const axisBottom: AxisProps = {};

  if (timeDifferenceInDays <= 2) {
    axisBottom.format = "%H:%M";
    axisBottom.tickValues = "every 6 hours";
  }
  else if (timeDifferenceInDays <= 6) {
    axisBottom.format = "%d %b";
    axisBottom.tickValues = "every day";
  }
  else if (timeDifferenceInDays <= 20) {
    axisBottom.format = "%d %b";
    axisBottom.tickValues = "every 2 days";
  }
  else if (timeDifferenceInDays <= 40) {
    axisBottom.format = "%d %b";
    axisBottom.tickValues = "every 5 days";
  }
  else if (timeDifferenceInDays <= 80) {
    axisBottom.format = "%d %b";
    axisBottom.tickValues = "every 10 days";
  }
  else if (timeDifferenceInDays <= 300) {
    axisBottom.format = "%b %y";
    axisBottom.tickValues = "every month";
  }
  else {
    axisBottom.format = "%b %y";
    axisBottom.tickValues = "every 2 months";
  }

  return axisBottom;
};

/**
 * Calculates the time difference in months of the first and the last element in
 * a data array.
 *
 * @todo Add tests.
 *
 * @param data the data to process.
 */
export const getTimeDifferenceInMonths = (data: dataItem[]): number => {
  const firstDate = moment.unix(data[0].time),
    lastDate = moment.unix(data[data.length - 1].time);

  let diff = (lastDate.year() - firstDate.year()) * 12;

  diff -= firstDate.month();
  diff += lastDate.month() + 1;

  return diff;
};

/**
 * Calculates the time difference in days of the first and the last element in
 * a data array.
 *
 * @param data the data to process.
 */
export const getTimeDifferenceInDays = (data: dataItem[]): number => {
  const firstDate = moment.unix(data[0].time),
    lastDate = moment.unix(data[data.length - 1].time);

  return lastDate.diff(firstDate, 'days');
};

/**
 * Scale the values of a dateTimeElement.
 *
 * @param dateItem The Element to scale.
 * @param method The method to use.
 */
export const calculateScaling = (dateItem: dateTimeElement, method: 'max' | 'average' | 'sum' | 'min'): string | number => {
  switch (method) {
    case 'max': {
      return Math.max(...dateItem.values);
    }
    case 'min': {
      return Math.min(...dateItem.values);
    }
    case 'average': {
      return (dateItem.values.reduce((a: number, b: number) => a + b, 0) / dateItem.values.length).toFixed(1);
    }
    case 'sum': {
      return (dateItem.values.reduce((a: number, b: number) => a + b, 0)).toFixed(1);
    }
  }
};

/**
 * Bundle given data for a given precision.
 *
 * @param data The input data.
 * @param property The data property, eg. temperature.
 * @param precision The precision to use.
 */
export const bundleData = (data: dataItem[], property: propertyParameter, precision?: Precision): Dates => {
  let dates: Dates = {};

  // Loop over all date elements and create an object to hold all data per day.
  for (let key = 0; key < data.length; key++) {
    let date: string;

    switch (precision) {
      case 'week': {
        date = moment.unix(data[key].time).utc().format('WWYYYY');
        break;
      }
      case 'month': {
        date = moment.unix(data[key].time).utc().format('MMYYYY');
        break;
      }
      case 'year': {
        date = moment.unix(data[key].time).utc().format('YYYY');
        break;
      }
      default: {
        date = moment.unix(data[key].time).utc().format('DDMMYYYY');
      }
    }

    if (!(date in dates)) {
      dates = {
        ...dates,
        [date]: {
          date: date,
          time: data[key].time,
          values: []
        }
      };
    }

    // Add all values of the day.
    dates[date].values = [ ...dates[date].values, data[key][property] ];
  }

  return dates;
}

/**
 * Build scaled data from input data.
 *
 * @param data The input data.
 * @param property The data property, e.g. temperature.
 * @param method The scaling method.
 * @param precision The precision to use.
 */
export const scale = (data: dataItem[], property: propertyParameter, method: 'max' | 'average' | 'sum' | 'min', precision?: Precision): dataItem[] => {
  let newData: dataItem[] = [];

  const dates = bundleData(data, property, precision);

  // Create the needed structure.
  for (const [key, dateItem] of Object.entries(dates)) {
    newData = [...newData, {
      time: dateItem.time,
      timeParsed: moment.unix(dateItem.time).toISOString(),
      [property]: calculateScaling(dateItem, method),
      id: key.toString(),
      _id: key
    }];
  }

  // Sort by date.
  newData.sort((a: { timeParsed: string }, b: { timeParsed: string }) => {
    return (a.timeParsed < b.timeParsed) ? -1 : ((a.timeParsed > b.timeParsed) ? 1 : 0);
  });

  return newData;
};

/**
 * Shortcut for average scaling.
 *
 * @param data The array of data to process.
 * @param property The property to process.
 * @param precision The precision to use.
 */
export const scaleAverage = (data: dataItem[], property: propertyParameter, precision: Precision): dataItem[] => {
  return scale(
    data,
    property,
    'average',
    precision
  );
};

/**
 * Shortcut for min scaling.
 *
 * @param data The input data.
 * @param property The data property, e.g. temperature.
 * @param precision The precision to use.
 */
export const scaleMin = (data: dataItem[], property: propertyParameter, precision: Precision): dataItem[] => {
  return scale(
    data,
    property,
    'min',
    precision
  );
}

/**
 * Shortcut for max scaling.
 *
 * @param data The input data.
 * @param property The data property, e.g. temperature.
 * @param precision The precision to use.
 */
export const scaleMax = (data: dataItem[], property: propertyParameter, precision: Precision): dataItem[] => {
  return scale(
    data,
    property,
    'max',
    precision
  );
}

/**
 * Shortcut for sum scaling.
 *
 * @param data The input data.
 * @param property The data property, e.g. temperature.
 * @param precision The precision to use.
 */
export const scaleSum = (data: dataItem[], property: propertyParameter, precision: 'week' | 'month' | 'year'): dataItem[] => {
  return scale(
    scale(data, property, 'max', 'day'),
    property,
    'sum',
    precision
  );
}

/**
 * Shortcut for scaling min, max and average in one call.
 *
 * @param data The input data.
 * @param property The data property, e.g. temperature.
 * @param precision The precision to use.
 */
export const scaleMinMaxAvg = (data: dataItem[], property: propertyParameter, precision: Precision): dataItem[] => {
  let newData: dataItem[] = [];

  const dates = bundleData(data, property, precision);

  // Create the needed structure.
  for (const [key, dateItem] of Object.entries(dates)) {
    newData = [...newData, {
      time: dateItem.time,
      timeParsed: moment.unix(dateItem.time).toISOString(),
      [`${property}_min`]: calculateScaling(dateItem, 'min'),
      [`${property}_max`]: calculateScaling(dateItem, 'max'),
      [`${property}_average`]: calculateScaling(dateItem, 'average'),
      id: key.toString(),
      _id: key
    }];
  }

  // Sort by date.
  newData.sort((a: { timeParsed: string }, b: { timeParsed: string }) => {
    return (a.timeParsed < b.timeParsed) ? -1 : ((a.timeParsed > b.timeParsed) ? 1 : 0);
  });

  return newData;
}