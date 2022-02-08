import React from 'react'
import { render } from '@testing-library/react'
import moment from 'moment-timezone';

import data from "../../../../tests/data/scaling-input.json";

import { Stats } from "./stats";
import {RainyHeavy, Sunny, TemperatureHigh, TemperatureLow, Weather, Windy} from "@carbon/pictograms-react";

moment.tz.setDefault("Europe/Berlin");

test('stats (normal size) with overview items', async () => {
  const { container } = render(
    <Stats
      size={"normal"}
      columnSpanLg={6}
      columnSpan={6}
      data={data}
      stats={[
        {
          property: 'temperature',
          direction: 'max',
          label: 'Maximum Temperature',
          unit: '°C',
          icon: <TemperatureHigh />
        },
        {
          property: 'temperature',
          direction: 'min',
          label: 'Minimum Temperature',
          unit: '°C',
          icon: <TemperatureLow />
        },
        {
          property: 'gust',
          direction: 'max',
          label: 'Maximum Gust',
          unit: ' km/h',
          icon: <Windy />
        },
        {
          property: 'rain',
          direction: 'max',
          label: 'Maximum Rain in one day',
          unit: ' mm',
          icon: <RainyHeavy />
        },
        {
          property: 'pressure',
          direction: 'max',
          label: 'Maximum Pressure',
          unit: ' hPa',
          icon: <Sunny />
        },
        {
          property: 'pressure',
          direction: 'min',
          label: 'Minimum Pressure',
          unit: ' hPa',
          icon: <Weather />
        }
      ]}
    />
  );

  // Maximum temperature.
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(1) .value')).toHaveTextContent('10.3 °C');
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(1) .date')).toHaveTextContent('on 2021/03/13');

  // Minimum temperature.
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(2) .value')).toHaveTextContent('-3.5 °C');
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(2) .date')).toHaveTextContent('on 2021/03/06');

  // Maximum gust.
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(3) .value')).toHaveTextContent('36.7 km/h');
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(3) .date')).toHaveTextContent('on 2021/03/14');

  // Maximum rain.
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(4) .value')).toHaveTextContent('5.4 mm');
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(4) .date')).toHaveTextContent('on 2021/03/12');

  // Maximum pressure.
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(5) .value')).toHaveTextContent('1000.6 hPa');
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(5) .date')).toHaveTextContent('on 2021/03/06');

  // Minimum pressure.
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(6) .value')).toHaveTextContent('965.2 hPa');
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(6) .date')).toHaveTextContent('on 2021/03/13');

  expect(container).toMatchSnapshot();
});

test('stats (compact size) with temperature items', async () => {
  const { container } = render(
    <Stats
      size={"compact"}
      columnSpanLg={6}
      columnSpan={6}
      data={data}
      stats={[
        {
          property: 'temperature',
          direction: 'day',
          extra: 'summer-days',
          label: 'Summer days',
          description: 'T<sub>max</sub> ≥ 25 °C',
          unit: '°C'
        },
        {
          property: 'temperature',
          direction: 'day',
          extra: 'frost-days',
          label: 'Frost days',
          description: 'T<sub>min</sub> < 0 °C',
          unit: '°C'
        },
        {
          property: 'temperature',
          direction: 'day',
          extra: 'hot-days',
          label: 'Hot days',
          description: 'T<sub>max</sub> ≥ 30 °C',
          unit: '°C'
        },
        {
          property: 'temperature',
          direction: 'day',
          extra: 'ice-days',
          label: 'Ice days',
          description: 'T<sub>max</sub> < 0 °C',
          unit: '°C'
        },
        {
          property: 'temperature',
          direction: 'day',
          extra: 'tropical-nights',
          label: 'Tropical nights',
          description: 'T<sub>min</sub> ≥ 20 °C',
          tooltip: '18:00 UTC - 06:00 UTC',
          unit: '°C'
        },
        {
          property: 'temperature',
          direction: 'day',
          extra: 'desert-days',
          label: 'Desert days',
          description: 'T<sub>max</sub> ≥ 35 °C',
          unit: '°C'
        }
      ]}
    />
  );

  // Summer days.
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(1) .value')).toHaveTextContent('0');

  // Frost days.
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(2) .value')).toHaveTextContent('5');

  // Hot days.
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(3) .value')).toHaveTextContent('0');

  // Ice days.
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(4) .value')).toHaveTextContent('0');

  // Tropical nights.
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(5) .value')).toHaveTextContent('0');

  // Desert days.
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(6) .value')).toHaveTextContent('0');

  expect(container).toMatchSnapshot();
});

test('stats (compact size) with rain items', async () => {
  const { container } = render(
    <Stats
      size={"compact"}
      columnSpanLg={6}
      columnSpan={6}
      data={data}
      stats={[
        {
          property: 'rain',
          direction: 'day',
          extra: 'rain-days',
          label: 'Rain days',
          description: 'R<sub>min</sub> ≥ 0.1 mm'
        },
        {
          property: 'rain',
          direction: 'min',
          scaling: 'sum',
          precision: 'month',
          dateFormat: 'MMM YY',
          label: 'Driest month',
          unit: 'mm',
        },
        {
          property: 'rain',
          direction: 'max',
          label: 'Maximum per day',
          unit: 'mm'
        },
        {
          property: 'rain',
          direction: 'max',
          scaling: 'sum',
          precision: 'week',
          dateFormat: '\\Www\\/YY',
          label: 'Maximum per week',
          unit: 'mm'
        },
        {
          property: 'rain',
          direction: 'max',
          scaling: 'sum',
          precision: 'month',
          dateFormat: 'MMM YY',
          label: 'Maximum per month',
          unit: 'mm'
        },
        {
          property: 'rain',
          direction: 'max',
          scaling: 'sum',
          precision: 'year',
          dateFormat: 'YYYY',
          label: 'Maximum per year',
          unit: 'mm'
        },
        {
          property: 'rain',
          direction: 'extra',
          extra: 'rain-days-consecutive',
          label: 'Longest rain period',
          description: 'Consecutive days with rain',
          unit: '',
        },
        {
          property: 'rain',
          direction: 'extra',
          extra: 'rain-days-consecutive-sum',
          label: 'Longest rain period amount',
          description: 'Consecutive days with rain',
          unit: 'mm',
        }
      ]}
    />
  );

  // Rain days.
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(1) .value')).toHaveTextContent('8');

  // Driest month.
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(2) .value')).toHaveTextContent('15.5 mm');
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(2) .date')).toHaveTextContent('Mar 21');

  // Maximum per day.
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(3) .value')).toHaveTextContent('5.4 mm');
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(3) .date')).toHaveTextContent('2021/03/12');

  // Maximum per week.
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(4) .value')).toHaveTextContent('13.0 mm');
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(4) .date')).toHaveTextContent('W11/21');

  // Maximum per month.
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(5) .value')).toHaveTextContent('15.5 mm');
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(5) .date')).toHaveTextContent('Mar 21');

  // Maximum per year.
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(6) .value')).toHaveTextContent('15.5 mm');
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(6) .date')).toHaveTextContent('2021');

  // Longest rain period.
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(7) .value')).toHaveTextContent('4');
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(7) .bx--tooltip__trigger .bx--assistive-text')).toHaveTextContent('2021/03/11 - 2021/03/14');

  // Longest rain period amount.
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(8) .value')).toHaveTextContent('11.9 mm');
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(8) .bx--tooltip__trigger .bx--assistive-text')).toHaveTextContent('2021/03/11 - 2021/03/14');

  expect(container).toMatchSnapshot();
});

test('stats (compact size) with pressure items', async () => {
  const { container } = render(
    <Stats
      size={"compact"}
      columnSpanLg={6}
      columnSpan={6}
      data={data}
      stats={[
        {
          property: 'pressure',
          direction: 'extra',
          extra: 'min-max-diff-down',
          label: 'Biggest fall per day',
          unit: 'hPa',
        },
        {
          property: 'pressure',
          direction: 'extra',
          extra: 'min-max-diff-up',
          label: 'Biggest rise per day',
          unit: 'hPa',
        }
      ]}
    />
  );

  // Fall per day.
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(1) .value')).toHaveTextContent('-14.3 hPa');
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(1) .date')).toHaveTextContent('2021/03/11');
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(1) .bx--tooltip__trigger .bx--assistive-text')).toHaveTextContent('Min: 967.2 hPa, Max: 981.5 hPa');

  // Rise per day.
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(2) .value')).toHaveTextContent('+ 13.0 hPa');
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(2) .date')).toHaveTextContent('2021/03/05');
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(2) .bx--tooltip__trigger .bx--assistive-text')).toHaveTextContent('Min: 985.5 hPa, Max: 998.5 hPa');

  expect(container).toMatchSnapshot();
});

test('stats (compact size) with wind items', async () => {
  const { container } = render(
    <Stats
      size={"compact"}
      columnSpanLg={6}
      columnSpan={6}
      data={data}
      stats={[
        {
          property: 'gust',
          direction: 'day',
          extra: 'storm-days',
          label: 'Storm days',
          description: 'W ≥ 8 Beaufort',
        },
        {
          property: 'wind',
          direction: 'max',
          scaling: 'average',
          precision: 'day',
          label: 'Windiest day',
          tooltip: 'Highest Ø from all data',
          unit: 'km/h',
        }
      ]}
    />
  );

  // Storm days.
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(1) .value')).toHaveTextContent('0');

  // Windiest day.
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(2) .value')).toHaveTextContent('19.0 km/h');
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(2) .date')).toHaveTextContent('2021/03/14');

  expect(container).toMatchSnapshot();
});

test('stats (compact size) with solar items', async () => {
  const { container } = render(
    <Stats
      size={"compact"}
      columnSpanLg={6}
      columnSpan={6}
      data={data}
      stats={[
        {
          property: 'solar',
          direction: 'max',
          label: 'Max Solar radiation',
          unit: 'w/m²'
        },
        {
          property: 'uvi',
          direction: 'max',
          label: 'Max UV Index',
          unit: 'UVI'
        },
        {
          property: 'solar',
          direction: 'max',
          scaling: 'average',
          precision: 'day',
          label: 'Brightest day',
          tooltip: 'Highest Ø from all data',
          unit: 'w/m²'
        },
        {
          property: 'solar',
          direction: 'min',
          scaling: 'average',
          precision: 'day',
          label: 'Darkest day',
          tooltip: 'Lowest Ø from all data',
          unit: 'w/m²'
        }
      ]}
    />
  );

  // Max Solar radiation.
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(1) .value')).toHaveTextContent('511.3 w/m²');
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(1) .date')).toHaveTextContent('2021/03/08');

  // Max UV Index.
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(2) .value')).toHaveTextContent('4 UVI');
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(2) .date')).toHaveTextContent('2021/03/08');

  // Brightest day.
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(3) .value')).toHaveTextContent('89.0 w/m²');
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(3) .date')).toHaveTextContent('2021/03/08');

  // Darkest day.
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(4) .value')).toHaveTextContent('0.0 w/m²');
  expect(container.querySelector('.bx--row.stats .stat-tile:nth-child(4) .date')).toHaveTextContent('2021/03/04');

  expect(container).toMatchSnapshot();
});