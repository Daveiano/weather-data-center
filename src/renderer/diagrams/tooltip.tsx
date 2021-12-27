import React from "react";

import type { Point } from "@nivo/line";
import moment from 'moment';

interface TooltipPropsLine {
  point: Point,
  slice?: boolean
}

interface TooltipPropsBar {
  formattedValue: string,
  time: number,
  color: string,
  colorDarken: string
}

export const TooltipLine: React.FC<TooltipPropsLine> = (props: TooltipPropsLine): React.ReactElement  => {
  console.log(props);
  return (
    <div style={{ padding: '7px', background: 'rgb(57 57 57)', color: 'white', boxShadow: `0 2px 6px rgb(57 57 57)`, borderLeft: `5px solid ${props.point.serieColor}`, textAlign: 'right' }} className="diagram-tooltip">
      {!props.slice && <div style={{ marginBottom: '5px' }}>{props.point.data.xFormatted}</div>}
      <div>{props.point.data.yFormatted}</div>
    </div>
  );
};

export const TooltipBar: React.FC<TooltipPropsBar> = (props: TooltipPropsBar): React.ReactElement  => {
  return (
    <div style={{ padding: '7px', background: 'rgb(57 57 57)', color: 'white', boxShadow: `0 2px 6px rgb(57 57 57)`, borderLeft: `5px solid ${props.color}`, textAlign: 'right' }} className="diagram-tooltip">
      <div style={{ marginBottom: '5px' }}>
        {moment.unix(props.time).utc().format('YYYY/MM/DD')}
      </div>
      <div>
        {props.formattedValue}
      </div>
    </div>
  );
};