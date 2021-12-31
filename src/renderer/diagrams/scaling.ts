import { dataItem } from './types';
import moment from "moment";

export type dateTimeElement = {
  time: number,
  date: string,
  values: number[]
}

export type propertyParameter = 'humidity' | 'pressure' | 'temperature' | 'rain' | 'solar' | 'uvi' | 'wind' | 'gust' | 'wind_direction' | 'dew_point' | 'felt_temperature';

export type Precision = 'day' | 'week' | 'month' | 'year';

interface Dates {
  [key: string]: dateTimeElement
}

/**
 * Calculates the time difference in days of the first and the last element in
 * a data array.
 *
 * @param data the data to process.
 */
const getTimeDifferenceInDays = (data: dataItem[]): number => {
  const firstDate = moment.unix(data[0].time),
    lastDate = moment.unix(data[data.length - 1].time);

  return lastDate.diff(firstDate, 'days');
};

const calculateScaling = (dateItem: dateTimeElement, method: 'max' | 'average' | 'sum' | 'min'): string | number => {
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

const bundleData = (data: dataItem[], property: propertyParameter, precision?: Precision): Dates => {
  let dates: Dates = {};

  // Loop over all date elements and create an object to hold all data per day.
  for (let key = 0; key < data.length; key++) {
    let date: string;

    switch (precision) {
      case 'week': {
        date = moment.unix(data[key].time).utc().format('wwYYYY');
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

const scaleMax = (data: dataItem[], property: propertyParameter, precision: Precision): dataItem[] => {
  return scale(
    data,
    property,
    'max',
    precision
  );
}

const scaleSum = (data: dataItem[], property: propertyParameter, precision: 'week' | 'month' | 'year'): dataItem[] => {
  return scale(
    scale(data, property, 'max', 'day'),
    property,
    'sum',
    precision
  );
}

const scaleMin = (data: dataItem[], property: propertyParameter, precision: Precision): dataItem[] => {
  return scale(
    precision === 'day' ? data : scale(data, property, 'max'),
    property,
    'min',
    precision
  );
}

const scaleMinMaxAvg = (data: dataItem[], property: propertyParameter, precision: Precision): dataItem[] => {
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

/**
 * Calculates an average value per day by summing up all values of a day and
 * dividing by the count of the values.
 *
 * @todo Rename in scaleAverage and add precision parameter.
 *
 * @param data The array of data to process.
 * @param property The property to process.
 */
const scaleAveragePerDay = (data: dataItem[], property: propertyParameter): dataItem[] => {
  return scale(data, property, 'average');
};

export {
  getTimeDifferenceInDays,
  scaleMax,
  scaleMin,
  scaleSum,
  scaleMinMaxAvg,
  scaleAveragePerDay,
  bundleData
};