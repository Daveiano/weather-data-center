import React from "react";

import { Row, Column } from "carbon-components-react";
import type { ColumnSpan } from "carbon-components-react";
import moment from "moment";

import { dataItem } from "../../diagrams/types";
import { bundleData, propertyParameter, scale, dateTimeElement } from "../../diagrams/scaling";
import { StatsItemNormal } from "./stats-item-normal";
import { StatsItemCompact } from "./stats-item-compact";

export type statsItem = {
  direction: 'min' | 'max' | 'extra',
  extra?: 'frost-days'
    | 'ice-days'
    | 'summer-days'
    | 'hot-days'
    | 'tropical-nights'
    | 'desert-days'
    | 'rain-days'
    | 'rain-days-consecutive'
    | 'rain-days-consecutive-sum'
    | 'max-rain-week'
    | 'max-rain-month'
    | 'max-rain-year'
    | 'driest-month'
    | 'storm-days',
  property: propertyParameter,
  label: string,
  description?: string,
  unit: string,
  icon?: React.ReactElement,
  tooltip?: string,
}

interface StatsProps {
  heading?: string,
  size: 'normal' | 'compact',
  columnSpanLg: ColumnSpan,
  columnSpan: ColumnSpan,
  data: dataItem[],
  stats: statsItem[]
}

const getRainPeriods = (data: dateTimeElement[]) => {
  let splitIntoSeries: Array<dateTimeElement[]> = [];

  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      splitIntoSeries = [
        [data[i]]
      ];
    } else {
      let added = false;

      for (let k = 0; k < splitIntoSeries.length; k++) {
        if (moment.unix(splitIntoSeries[k][splitIntoSeries[k].length - 1].time).utc().add(1, 'days').format('DDMMYYYY') === moment.unix(data[i].time).utc().format('DDMMYYYY')) {
          splitIntoSeries[k] = [...splitIntoSeries[k], data[i]];
          added = true;
        }
      }

      if (!added) {
        splitIntoSeries = [
          ...splitIntoSeries,
          [data[i]]
        ]
      }
    }
  }

  const maxPeriod = Math.max(...splitIntoSeries.map(item => item.length));

  return splitIntoSeries.filter(item => item.length === maxPeriod);
};

// @todo Property 'property' makes no sense for 'extra' - it's everytime property bound.
// @todo Add 'precision' for eg. driest-month and all max rains.
// @todo Unit required?
export const Stats: React.FC<StatsProps> = (props: StatsProps): React.ReactElement  => {
  const output: React.ReactElement[] = [];

  for (const statsKey of props.stats) {
    let date: string,
      value: string;

    switch (statsKey.direction) {
      case "max":
      case "min": {
        const data = props.data.slice().sort((a, b) => statsKey.direction === 'max' ? b[statsKey.property] - a[statsKey.property] : a[statsKey.property] - b[statsKey.property]);

        date = moment(data[0].timeParsed).format('YYYY/MM/DD');
        value = `${data[0][statsKey.property]} ${statsKey.unit}`;

        break;
      }
      case "extra": {
        switch (statsKey.extra) {
          case 'storm-days': {
            const dataBundledPerDay = bundleData(props.data, statsKey.property, 'day'),
              data = Object.values(dataBundledPerDay).slice().filter(item => Math.max(...item.values) >= 62).length;

            value = data.toString();

            break;
          }
          case "max-rain-week": {
            const data = scale(
              scale(props.data, statsKey.property, 'max', 'day'),
              statsKey.property,
              'sum',
              'week'
            ).sort((a, b) => b[statsKey.property] - a[statsKey.property]);

            date = moment(data[0].timeParsed).format("\\Www\\/YY");
            value = `${data[0][statsKey.property]} ${statsKey.unit}`;
            break;
          }
          case 'max-rain-month': {
            const data = scale(
              scale(props.data, statsKey.property, 'max', 'day'),
              statsKey.property,
              'sum',
              'month'
            ).sort((a, b) => b[statsKey.property] - a[statsKey.property]);

            date = moment(data[0].timeParsed).format("MMM YY");
            value = `${data[0][statsKey.property]} ${statsKey.unit}`;
            break;
          }
          case 'driest-month': {
            const data = scale(
              scale(props.data, statsKey.property, 'max', 'day'),
              statsKey.property,
              'sum',
              'month'
            ).sort((a, b) => a[statsKey.property] - b[statsKey.property]);

            date = moment(data[0].timeParsed).format("MMM YY");
            value = `${data[0][statsKey.property]} ${statsKey.unit}`;
            break;
          }
          case 'max-rain-year': {
            const data = scale(
              scale(props.data, statsKey.property, 'max', 'day'),
              statsKey.property,
              'sum',
              'year'
            ).sort((a, b) => b[statsKey.property] - a[statsKey.property]);

            date = moment(data[0].timeParsed).format("YYYY");
            value = `${data[0][statsKey.property]} ${statsKey.unit}`;
            break;
          }
          case 'rain-days': {
            const dataBundledPerDay = bundleData(props.data, statsKey.property, 'day'),
              data = Object.values(dataBundledPerDay).slice().filter(item => Math.max(...item.values) >= 0.1).length;

            value = data.toString();
            break;
          }
          case 'rain-days-consecutive': {
            const dataBundledPerDay = bundleData(props.data, statsKey.property, 'day'),
              data = Object.values(dataBundledPerDay).slice().filter(item => Math.max(...item.values) >= 0.1).sort((a, b) => a.time - b.time);

            const periods = getRainPeriods(data);

            value = periods[0].length.toString();
            statsKey.tooltip = periods.map(item =>
              `${moment.unix(item[0].time).utc().format('YYYY/MM/DD')} - ${moment.unix(item[item.length - 1].time).utc().format('YYYY/MM/DD')}`
            ).join(', ');
            break;
          }
          case 'rain-days-consecutive-sum': {
            const dataBundledPerDay = bundleData(props.data, statsKey.property, 'day'),
              data = Object.values(dataBundledPerDay).slice().filter(item => Math.max(...item.values) >= 0.1).sort((a, b) => a.time - b.time);

            const periods = getRainPeriods(data);
            const amount = periods.map(item => ({
              ...item,
              amount: item.reduce((a, b) => a + Math.max(...b.values), 0)
            })).sort((a, b) => b.amount - a.amount);

            value = `${amount[0].amount.toString()} ${statsKey.unit}`;
            statsKey.tooltip = `${moment.unix(periods[0][0].time).utc().format('YYYY/MM/DD')} - ${moment.unix(periods[0][periods[0].length - 1].time).utc().format('YYYY/MM/DD')}`;
            break;
          }
          case "frost-days": {
            const dataBundledPerDay = bundleData(props.data, statsKey.property, 'day'),
              data = Object.values(dataBundledPerDay).slice().filter(item => Math.min(...item.values) < 0).length;

            value = data.toString();
            break;
          }
          case "ice-days": {
            const dataBundledPerDay = bundleData(props.data, statsKey.property, 'day'),
              data = Object.values(dataBundledPerDay).slice().filter(item => Math.max(...item.values) < 0).length;

            value = data.toString();
            break;
          }
          case 'summer-days': {
            const dataBundledPerDay = bundleData(props.data, statsKey.property, 'day'),
              data = Object.values(dataBundledPerDay).slice().filter(item => Math.max(...item.values) >= 25).length;

            value = data.toString();
            break;
          }
          case 'hot-days': {
            const dataBundledPerDay = bundleData(props.data, statsKey.property, 'day'),
              data = Object.values(dataBundledPerDay).slice().filter(item => Math.max(...item.values) >= 30).length;

            value = data.toString();
            break;
          }
          case 'tropical-nights': {
            const dataBundledPerDay = bundleData(props.data.filter(item => parseInt(moment.unix(item.time).utc().format('HH')) >= 18 || parseInt(moment.unix(item.time).utc().format('HH')) < 6), statsKey.property, 'day'),
              data = Object.values(dataBundledPerDay).slice().filter(item => Math.min(...item.values) >= 20).length;

            value = data.toString();
            break;
          }
          case 'desert-days': {
            const dataBundledPerDay = bundleData(props.data, statsKey.property, 'day'),
              data = Object.values(dataBundledPerDay).slice().filter(item => Math.max(...item.values) >= 35).length;

            value = data.toString();
            break;
          }
        }
      }
    }

    switch (props.size) {
      case "compact": {
        output.push(
          <StatsItemCompact
            key={`${statsKey.property}${statsKey.direction}${statsKey.extra}`}
            columnSpanLg={props.columnSpanLg}
            columnSpan={props.columnSpan}
            item={statsKey}
            date={date ? date : false}
            value={value}
            tooltip={statsKey.tooltip}
          />
        );
        break;
      }
      default: {
        output.push(
          <StatsItemNormal
            key={`${statsKey.property}${statsKey.direction}${statsKey.extra}`}
            columnSpanLg={props.columnSpanLg}
            columnSpan={props.columnSpan}
            item={statsKey}
            date={date}
            value={value}
          />
        );
      }
    }
  }

  return (
    <Row className={`stats ${props.size}`}>
      {props.heading &&
        <Column sm={12} lg={12} max={12}>
          <h3 className="heading">
            {props.heading}
          </h3>
        </Column>
      }
      {output}
    </Row>
  );
};