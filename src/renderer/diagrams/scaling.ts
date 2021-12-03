import { dataItem } from './types';
import moment from "moment";

type dateTimeElement = {
  time: number,
  group: string,
  values: any[number]
}

type propertyParameter = 'humidity' | 'pressure' | 'temperature';

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

/**
 * Calculates an average value per day by summing up all values of a day and
 * dividing by the count of the values.
 *
 * @param data The array of data to process.
 * @param property The property to process.
 */
const scaleAverage = (data: dataItem[], property: propertyParameter): dataItem[] => {
  let newData: dataItem[] = [];

  let dates: Dates = {};

  // Loop over all date elements and create an object to hold all data per day.
  for (let key = 0; key < data.length; key++) {
    const date = moment.unix(data[key].time).utc().format('DDMMYYYY');
    if (!(date in dates)) {
      dates = {
        ...dates,
        [date]: {
          group: data[key].group,
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
      group: dateItem.group,
      timeParsed: moment.unix(dateItem.time).toISOString(),
      [property]: (dateItem.values.reduce((a: number, b: number) => a + b, 0) / dateItem.values.length).toFixed(1)
    }];
  }

  // Sort by date.
  newData.sort((a: { timeParsed: string }, b: { timeParsed: string }) => {
    return (a.timeParsed < b.timeParsed) ? -1 : ((a.timeParsed > b.timeParsed) ? 1 : 0);
  });

  return newData;
};

export { getTimeDifferenceInDays, scaleAverage };