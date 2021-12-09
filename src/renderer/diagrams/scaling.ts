import { dataItem } from './types';
import moment from "moment";

type dateTimeElement = {
  time: number,
  values: any[number]
}

type propertyParameter = 'humidity' | 'pressure' | 'temperature' | 'rain';

interface Dates {
  [key: string]: dateTimeElement
}

/**
 * Calculates the time difference in days of the first and the last element in
 * an data array.
 *
 * @param data the data to process.
 */
const getTimeDifferenceInDays = (data: dataItem[]): number => {
  const firstDate = moment.unix(data[0].time),
    lastDate = moment.unix(data[data.length - 1].time);

  return lastDate.diff(firstDate, 'days');
};

const calculateScaling = (dateItem: dateTimeElement, method: 'max' | 'average' | 'sum'): string | number => {
  switch (method) {
    case 'max': {
      return Math.max(...dateItem.values);
    }
    case 'average': {
      return (dateItem.values.reduce((a: number, b: number) => a + b, 0) / dateItem.values.length).toFixed(1);
    }
    case 'sum': {
      return (dateItem.values.reduce((a: number, b: number) => a + b, 0)).toFixed(1);
    }
  }
};

const scale = (data: dataItem[], property: propertyParameter, method: 'max' | 'average' | 'sum', precision?: string): dataItem[] => {
  let newData: dataItem[] = [];

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
      default: {
        date = moment.unix(data[key].time).utc().format('DDMMYYYY');
      }
    }

    if (!(date in dates)) {
      dates = {
        ...dates,
        [date]: {
          time: data[key].time,
          values: []
        }
      };
    }

    // Add all values of the day.
    dates[date].values = [ ...dates[date].values, data[key][property] ];
  }

  // Create the needed structure.
  for (const [key, dateItem] of Object.entries(dates)) {
    newData = [...newData, {
      time: dateItem.time,
      timeParsed: moment.unix(dateItem.time).toISOString(),
      [property]: calculateScaling(dateItem, method)
    }];
  }

  // Sort by date.
  newData.sort((a: { timeParsed: string }, b: { timeParsed: string }) => {
    return (a.timeParsed < b.timeParsed) ? -1 : ((a.timeParsed > b.timeParsed) ? 1 : 0);
  });

  return newData;
};

const scaleMaxPerDay = (data: dataItem[], property: propertyParameter): dataItem[] => {
  return scale(data, property, 'max');
}

const scaleMaxPerWeek = (data: dataItem[], property: propertyParameter): dataItem[] => {
  const dailyData = scale(data, property, 'max');

  return scale(dailyData, 'rain', 'sum', 'week');
}

const scaleMaxPerMonth = (data: dataItem[], property: propertyParameter): dataItem[] => {
  const dailyData = scale(data, property, 'max');

  return scale(dailyData, 'rain', 'sum', 'month');
}

/**
 * Calculates an average value per day by summing up all values of a day and
 * dividing by the count of the values.
 *
 * @param data The array of data to process.
 * @param property The property to process.
 */
const scaleAveragePerDay = (data: dataItem[], property: propertyParameter): dataItem[] => {
  return scale(data, property, 'average');
};

export { getTimeDifferenceInDays, scaleMaxPerDay, scaleMaxPerWeek, scaleMaxPerMonth, scaleAveragePerDay };