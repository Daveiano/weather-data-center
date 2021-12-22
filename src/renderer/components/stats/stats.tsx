import React from "react";

import { ColumnSpan, Row, Column } from "carbon-components-react";
import moment from "moment";

import { dataItem } from "../../diagrams/types";
import { bundleData, propertyParameter } from "../../diagrams/scaling";
import { StatsItemNormal } from "./stats-item-normal";
import { StatsItemCompact } from "./stats-item-compact";

export type statsItem = {
  direction: 'min' | 'max' | 'extra',
  extra?: 'frost-days' | 'ice-days' | 'summer-days' | 'hot-days' | 'tropical-nights' | 'desert-days',
  property: propertyParameter,
  label: string,
  description?: string,
  unit: string,
  icon?: React.ReactElement
}

interface StatsProps {
  heading?: string,
  size: 'normal' | 'compact',
  columnSpanLg: ColumnSpan,
  columnSpan: ColumnSpan,
  data: dataItem[],
  stats: statsItem[]
}

/**
 * @todo Add second layout: more compact for temperature page without icons.
 *
 * @param props
 * @constructor
 */
export const Stats: React.FC<StatsProps> = (props: StatsProps): React.ReactElement  => {
  const output: React.ReactElement[] = [];

  for (const statsKey of props.stats) {
    let date: string,
      value: string;

    switch (statsKey.direction) {
      case "max":
      case "min": {
        const data = props.data.slice().sort((a, b) => statsKey.direction === 'max' ? b[statsKey.property] - a[statsKey.property] : a[statsKey.property] - b[statsKey.property]);

        date = moment(data[0].timeParsed).format('YYYY/MM/DD HH:mm');
        value = `${data[0][statsKey.property]} ${statsKey.unit}`;

        break;
      }
      case "extra": {
        switch (statsKey.extra) {
          case "frost-days": {
            const dataBundledPerDay = bundleData(props.data, 'temperature', 'day'),
              data = Object.values(dataBundledPerDay).slice().filter(item => Math.min(...item.values) < 0).length;

            value = data.toString();
            break;
          }
          case "ice-days": {
            const dataBundledPerDay = bundleData(props.data, 'temperature', 'day'),
              data = Object.values(dataBundledPerDay).slice().filter(item => Math.max(...item.values) < 0).length;

            value = data.toString();
            break;
          }
          case 'summer-days': {
            const dataBundledPerDay = bundleData(props.data, 'temperature', 'day'),
              data = Object.values(dataBundledPerDay).slice().filter(item => Math.max(...item.values) >= 25).length;

            value = data.toString();
            break;
          }
          case 'hot-days': {
            const dataBundledPerDay = bundleData(props.data, 'temperature', 'day'),
              data = Object.values(dataBundledPerDay).slice().filter(item => Math.max(...item.values) >= 30).length;

            value = data.toString();
            break;
          }
          case 'tropical-nights': {
            const dataBundledPerDay = bundleData(props.data.filter(item => parseInt(moment.unix(item.time).utc().format('HH')) >= 18 || parseInt(moment.unix(item.time).utc().format('HH')) < 6), 'temperature', 'day'),
              data = Object.values(dataBundledPerDay).slice().filter(item => Math.min(...item.values) >= 20).length;

            value = data.toString();
            break;
          }
          case 'desert-days': {
            const dataBundledPerDay = bundleData(props.data, 'temperature', 'day'),
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