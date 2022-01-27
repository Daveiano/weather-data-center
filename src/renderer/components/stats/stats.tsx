import React from "react";

import { Row, Column } from "carbon-components-react";
import type { ColumnSpan } from "carbon-components-react";
import moment from "moment";

import { dataItem } from "../../diagrams/types";
import {bundleData, propertyParameter, scale, dateTimeElement, Precision} from "../../diagrams/scaling";
import { StatsItemNormal } from "./stats-item-normal";
import { StatsItemCompact } from "./stats-item-compact";
import {dataHasRecordsForProperty} from "../../diagrams/hoc";

export type statsItem = {
  property: propertyParameter,
  direction: 'min' | 'max' | 'day' | 'extra',
  scaling?: 'average' | 'sum',
  precision?: Precision,
  dateFormat?: string,
  extra?: 'frost-days'
    | 'ice-days'
    | 'summer-days'
    | 'hot-days'
    | 'tropical-nights'
    | 'desert-days'
    | 'rain-days'
    | 'storm-days'
    | 'rain-days-consecutive'
    | 'rain-days-consecutive-sum'
    | 'min-max-diff-up'
    | 'min-max-diff-down',
  label: string,
  description?: string,
  unit?: string,
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

const getRainPeriods = (input: dataItem[], property: propertyParameter) => {
  const dataBundledPerDay = bundleData(input, property, 'day'),
    data = Object.values(dataBundledPerDay).slice().filter(item => Math.max(...item.values) >= 0.1).sort((a, b) => a.time - b.time);

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

export const Stats: React.FC<StatsProps> = (props: StatsProps): React.ReactElement  => {
  const output: React.ReactElement[] = [];

  for (const statsKey of props.stats) {
    if (dataHasRecordsForProperty(statsKey.property, props.data)) {
      let date: string,
        value: string;

      switch (statsKey.direction) {
        case "max":
        case "min": {
          if (statsKey.scaling) {
            switch (statsKey.scaling) {
              case "sum": {
                const data = scale(
                  scale(props.data, statsKey.property, 'max', 'day'),
                  statsKey.property,
                  statsKey.scaling,
                  statsKey.precision
                ).sort((a, b) => statsKey.direction === 'max' ? b[statsKey.property] - a[statsKey.property] : a[statsKey.property] - b[statsKey.property]);

                date = moment(data[0].timeParsed).format(statsKey.dateFormat ? statsKey.dateFormat : "YYYY/MM/DD");
                value = `${data[0][statsKey.property]} ${statsKey.unit}`;
                break;
              }
              default: {
                const data = scale(props.data, statsKey.property, statsKey.scaling, statsKey.precision)
                  .sort((a, b) => statsKey.direction === 'max' ? b[statsKey.property] - a[statsKey.property] : a[statsKey.property] - b[statsKey.property]);

                date = moment(data[0].timeParsed).format("YYYY/MM/DD");
                value = `${data[0][statsKey.property]} ${statsKey.unit}`;
              }
            }
          } else {
            // Get the min / max value.
            const data = props.data.slice().sort((a, b) => statsKey.direction === 'max' ? b[statsKey.property] - a[statsKey.property] : a[statsKey.property] - b[statsKey.property]);

            date = moment(data[0].timeParsed).format('YYYY/MM/DD');
            value = `${data[0][statsKey.property]} ${statsKey.unit}`;
          }

          break;
        }
        case 'day': {
          const dataBundledPerDay = bundleData(props.data, statsKey.property, 'day');

          switch (statsKey.extra) {
            case 'storm-days': {
              const data = Object.values(dataBundledPerDay).slice().filter(item => Math.max(...item.values) >= 62).length;

              value = data.toString();

              break;
            }
            case 'rain-days': {
              const data = Object.values(dataBundledPerDay).slice().filter(item => Math.max(...item.values) >= 0.1).length;

              value = data.toString();
              break;
            }
            case "frost-days": {
              const data = Object.values(dataBundledPerDay).slice().filter(item => Math.min(...item.values) < 0).length;

              value = data.toString();
              break;
            }
            case "ice-days": {
              const data = Object.values(dataBundledPerDay).slice().filter(item => Math.max(...item.values) < 0).length;

              value = data.toString();
              break;
            }
            case 'summer-days': {
              const data = Object.values(dataBundledPerDay).slice().filter(item => Math.max(...item.values) >= 25).length;

              value = data.toString();
              break;
            }
            case 'hot-days': {
              const data = Object.values(dataBundledPerDay).slice().filter(item => Math.max(...item.values) >= 30).length;

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
              const data = Object.values(dataBundledPerDay).slice().filter(item => Math.max(...item.values) >= 35).length;

              value = data.toString();
              break;
            }
          }
          break;
        }
        case "extra": {
          switch (statsKey.extra) {
            case 'min-max-diff-up': {
              console.log(Object.values(bundleData(props.data, statsKey.property, 'day')));
              const dataBundledPerDay = Object.values(bundleData(props.data, statsKey.property, 'day')).map(item => {
                const minIndex = item.values.lastIndexOf(Math.min(...item.values)),
                  maxValue = Math.max(...item.values.slice(minIndex, item.values.length)),
                  minValue = Math.min(...item.values);

                return {
                  ...item,
                  min: minValue,
                  max: maxValue,
                  rise: maxValue - minValue
                };
              }).sort((a, b) => b.rise - a.rise);

              date = moment.unix(dataBundledPerDay[0].time).utc().format('YYYY/MM/DD');
              value = `+ ${dataBundledPerDay[0].rise.toFixed(1)} ${statsKey.unit}`;
              statsKey.tooltip = `Min: ${dataBundledPerDay[0].min.toFixed(1)} ${statsKey.unit}, Max: ${dataBundledPerDay[0].max.toFixed(1)} ${statsKey.unit}`;
              break;
            }
            case 'min-max-diff-down': {
              const dataBundledPerDay = Object.values(bundleData(props.data, statsKey.property, 'day')).map(item => {
                const maxIndex = item.values.lastIndexOf(Math.max(...item.values)),
                  minValue = Math.min(...item.values.slice(maxIndex, item.values.length)),
                  maxValue = Math.max(...item.values);

                return {
                  ...item,
                  min: minValue,
                  max: maxValue,
                  fall: minValue - maxValue
                };
              }).sort((a, b) => a.fall - b.fall);

              date = moment.unix(dataBundledPerDay[0].time).utc().format('YYYY/MM/DD');
              value = `${dataBundledPerDay[0].fall.toFixed(1)} ${statsKey.unit}`;
              statsKey.tooltip = `Min: ${dataBundledPerDay[0].min.toFixed(1)} ${statsKey.unit}, Max: ${dataBundledPerDay[0].max.toFixed(1)} ${statsKey.unit}`;
              break;
            }
            case 'rain-days-consecutive': {
              const periods = getRainPeriods(props.data, statsKey.property);

              value = periods[0].length.toString();
              statsKey.tooltip = periods.map(item =>
                `${moment.unix(item[0].time).utc().format('YYYY/MM/DD')} - ${moment.unix(item[item.length - 1].time).utc().format('YYYY/MM/DD')}`
              ).join(', ');
              break;
            }
            case 'rain-days-consecutive-sum': {
              const periods = getRainPeriods(props.data, statsKey.property);
              const amount = periods.map(item => ({
                ...item,
                amount: item.reduce((a, b) => a + Math.max(...b.values), 0)
              })).sort((a, b) => b.amount - a.amount);

              value = `${amount[0].amount.toString()} ${statsKey.unit}`;
              statsKey.tooltip = `${moment.unix(periods[0][0].time).utc().format('YYYY/MM/DD')} - ${moment.unix(periods[0][periods[0].length - 1].time).utc().format('YYYY/MM/DD')}`;
              break;
            }
          }
        }
      }

      switch (props.size) {
        case "compact": {
          output.push(
            <StatsItemCompact
              key={`${statsKey.property}${statsKey.direction}${statsKey.extra}${statsKey.precision}${statsKey.scaling}`}
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
              key={`${statsKey.property}${statsKey.direction}${statsKey.extra}${statsKey.precision}${statsKey.scaling}`}
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