import { getTimeDifferenceInDays, scaleAverage } from './scaling';
import { dataItem } from "./types";
import scalingInput from "../../../tests/data/scaling-input.json";

it('should get the correct day difference', () => {
  const data: dataItem[] = [
    {
      time: 1614884220,
      group: 'data',
      timeParsed: "2021-03-04T18:57:00.000Z",
      humidity: 100,
      temperature: 0,
      pressure: 1000
    },
    {
      time: 1629041040,
      group: 'data',
      timeParsed: "2021-08-15T15:24:00.000Z",
      humidity: 100,
      temperature: 0,
      pressure: 1000
    }
  ];

  const result = getTimeDifferenceInDays(data);

  expect(result).toBe(163);
});

it('should average scale correctly for daily temperature', () => {
  const result = scaleAverage(scalingInput, 'temperature');

  expect(result).toMatchSnapshot();
}); 