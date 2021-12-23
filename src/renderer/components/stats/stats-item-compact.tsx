import React from "react";

import {Column, Row, TooltipIcon} from "carbon-components-react";
import type { ColumnSpan } from "carbon-components-react";
import { Information16 } from "@carbon/icons-react";

import { statsItem } from "./stats";

interface StatsItemCompactProps {
  columnSpanLg: ColumnSpan,
  columnSpan: ColumnSpan,
  item: statsItem,
  value: string,
  date: string | boolean,
  tooltip?: string,
}

export const StatsItemCompact: React.FC<StatsItemCompactProps> = (props: StatsItemCompactProps): React.ReactElement  => {
  return (
    <Column key={`${props.item.property}-${props.item.direction}`} lg={props.columnSpanLg} max={props.columnSpan} className="stat-tile compact">
      <Row>

        <Column lg={12} max={12}>
          <h4 className="heading bx--type-expressive-heading-02">{props.item.label}</h4>

          <div
            style={{
              display: 'flex',
              alignItems: 'end'
            }}
          >
            {props.item.description &&
              <div className="date bx--type-body-short-01" dangerouslySetInnerHTML={{__html: props.item.description}}/>
            }

            {props.date &&
              <div className="date bx--type-body-short-01">on {props.date}</div>
            }

            {props.tooltip &&
              <TooltipIcon
                tooltipText={props.tooltip}
                renderIcon={Information16}
                direction="right"
              >
                <></>
              </TooltipIcon>
            }
          </div>

          <div className="value">
            {props.value}
          </div>
        </Column>

        {/*<Column lg={4} max={5} className="value-col">
          <div className="value">
            {props.value}
          </div>
        </Column>*/}

      </Row>
    </Column>
  );
};