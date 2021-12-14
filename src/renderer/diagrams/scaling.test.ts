import { getTimeDifferenceInDays, scaleAveragePerDay } from './scaling';
import { dataItem } from "./types";
import scalingInput from "../../../tests/data/scaling-input.json";

it('should get the correct day difference', () => {
  const data: dataItem[] = [
    {
      time: 1614884220,
      timeParsed: "2021-03-04T18:57:00.000Z",
      humidity: 100,
      temperature: 0,
      pressure: 1000,
      _id: 'ABC',
      id: '0',
      gust: 0,
      rain: 0,
      uvi: 0,
      dew_point: 0,
      solar: 0,
      wind: 0,
      felt_temperature: 0,
      wind_direction: 0,
    },
    {
      time: 1629041040,
      timeParsed: "2021-08-15T15:24:00.000Z",
      humidity: 100,
      temperature: 0,
      pressure: 1000,
      _id: 'DEF',
      id: '1',
      gust: 0,
      rain: 0,
      uvi: 0,
      dew_point: 0,
      solar: 0,
      wind: 0,
      felt_temperature: 0,
      wind_direction: 0,
    }
  ];

  const result = getTimeDifferenceInDays(data);

  expect(result).toBe(163);
});

it('should average scale correctly for daily temperature', () => {
  const result = scaleAveragePerDay(scalingInput, 'temperature');

  expect(result).toMatchSnapshot();
}); 