import React from "react";

import { Point } from "@nivo/line";
import moment from 'moment';

interface TooltipPropsLine {
  point: Point,
  color: string,
  colorDarken: string
}

interface TooltipPropsBar {
  formattedValue: string,
  time: number,
  color: string,
  colorDarken: string
}

// @todo Build nice tooltip with styled-components.
export const TooltipLine: React.FC<TooltipPropsLine> = (props: TooltipPropsLine): React.ReactElement  => {
  return (
    <div style={{ padding: '7px', background: 'white', boxShadow: `4px 4px 15px 0px ${props.colorDarken}`, borderLeft: `3px solid ${props.color}` }}>
      <div style={{ marginBottom: '5px' }}>{props.point.data.xFormatted}</div>
      <div>{props.point.data.yFormatted}</div>
    </div>
  );
};

export const TooltipBar: React.FC<TooltipPropsBar> = (props: TooltipPropsBar): React.ReactElement  => {
  return (
    <div style={{ padding: '7px', background: 'white', boxShadow: `4px 4px 15px 0px ${props.colorDarken}`, borderLeft: `3px solid ${props.color}` }}>
      <div style={{ marginBottom: '5px' }}>
        {moment.unix(props.time).utc().format('YYYY/MM/DD')}
      </div>
      <div>
        {props.formattedValue}
      </div>
    </div>
  );
};