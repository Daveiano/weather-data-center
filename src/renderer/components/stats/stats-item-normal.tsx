import React from "react";

import { Column, Row } from "carbon-components-react";
import type { ColumnSpan } from "carbon-components-react";

import { statsItem } from "./stats";

interface StatsItemNormalProps {
  columnSpanLg: ColumnSpan,
  columnSpan: ColumnSpan,
  item: statsItem,
  value: string,
  date: string,
}

export const StatsItemNormal: React.FC<StatsItemNormalProps> = (props: StatsItemNormalProps): React.ReactElement  => {
  return (
    <Column key={`${props.item.property}-${props.item.direction}`} lg={props.columnSpanLg} max={props.columnSpan} className="stat-tile normal">
      <Row>
        {props.item.icon &&
          <Column lg={4} max={3}>
            {props.item.icon}
          </Column>
        }

        <Column lg={props.item.icon ? 8 : 12} max={props.item.icon ? 9 : 12}>
          <h4 className="heading bx--type-expressive-heading-02">{props.item.label}</h4>
          <div className="value bx--type-expressive-heading-03">{props.value}</div>
          <div className="date bx--type-body-short-01">{`on ${props.date}`}</div>
        </Column>
      </Row>
    </Column>
  );
};