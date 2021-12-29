import React, { FunctionComponent, useEffect, useState } from 'react';

import { Loading } from "carbon-components-react";
import { Temperature32 } from "@carbon/icons-react";
import {ResponsiveLine} from '@nivo/line'
import type { DatumValue, SliceTooltip } from '@nivo/line'
import type { ScaleTimeSpec, ScaleLinearSpec } from "@nivo/scales/dist/types/types";
import type { CartesianMarkerProps, Box, ValueFormat } from "@nivo/core";
import type { AxisProps } from "@nivo/axes";

import { dataItem, DiagramBaseProps } from "../types";
import {getTimeDifferenceInDays, propertyParameter, scaleAveragePerDay} from "../scaling";
import { TooltipLine } from "../tooltip";

type TemperatureLineBasePropsTypes = {
  xScale: ScaleTimeSpec,
  yScale?: ScaleLinearSpec,
  xFormat?: ValueFormat<DatumValue>,
  yFormat: ValueFormat<DatumValue>,
  axisLeft: AxisProps,
  axisBottom?: AxisProps,
  markers: CartesianMarkerProps[],
  useMesh: boolean,
  enableCrosshair: boolean,
  isInteractive: boolean,
  lineWidth: number,
  enableArea: boolean,
  areaOpacity: number,
  enablePoints: boolean,
  pointSize: number,
  enablePointLabel: boolean,
  pointLabel: string,
  curve: 'basis'
    | 'cardinal'
    | 'catmullRom'
    | 'linear'
    | 'monotoneX'
    | 'monotoneY'
    | 'natural'
    | 'step'
    | 'stepAfter'
    | 'stepBefore',
  margin: Box,
  enableSlices?: 'x' | 'y' | false,
  sliceTooltip?: SliceTooltip
}

const TemperatureLineBaseProps: TemperatureLineBasePropsTypes = {
  xScale: {
    type: "time",
    useUTC: true,
    format: "%Y-%m-%dT%H:%M:%S.000Z",
    precision: 'minute'
  },
  yFormat: value => `${value} °C`,
  axisLeft: {
    legend: '°C',
    legendOffset: -35,
    legendPosition: 'middle',
    tickSize: 0,
    tickPadding: 10
  },
  markers: [
    {
      axis: 'y',
      value: 0,
      lineStyle: {
        stroke: '#00BFFF',
        strokeWidth: 2,
        strokeOpacity: 0.75,
        strokeDasharray: "10, 10"
      },
      legend: '0 °C',
      legendOrientation: 'horizontal',
    }
  ],
  useMesh: true,
  enableCrosshair: true,
  isInteractive: true,
  lineWidth: 2,
  enableArea: false,
  areaOpacity: 0.07,
  enablePoints: true,
  pointSize: 5,
  enablePointLabel: false,
  pointLabel: "yFormatted",
  curve: "natural",
  margin: { top: 20, right: 10, bottom: 20, left: 40 }
};

export const getTemperatureLineBaseProps = (precision: string, data: dataItem[], property: propertyParameter, combinedTooltip: boolean): TemperatureLineBasePropsTypes => {
  const newTemperatureLineBaseProps = TemperatureLineBaseProps;

  newTemperatureLineBaseProps.axisBottom = {
    tickSize: 0,
    tickPadding: 5
  };

  // @see https://github.com/d3/d3-time-format
  switch (precision) {
    case 'yearly':
      newTemperatureLineBaseProps.xFormat = "time:%Y";
      newTemperatureLineBaseProps.axisBottom.format = "%Y";
      newTemperatureLineBaseProps.axisBottom.tickValues = "every year";
      break;
    case 'monthly':
      newTemperatureLineBaseProps.xFormat = "time:%Y/%m";
      newTemperatureLineBaseProps.axisBottom.format = "%b %Y";
      newTemperatureLineBaseProps.axisBottom.tickValues = "every month";
      break;
    case 'daily':
      newTemperatureLineBaseProps.xFormat = "time:%Y/%m/%d";
      newTemperatureLineBaseProps.axisBottom.format = "%b %Y";
      newTemperatureLineBaseProps.axisBottom.tickValues = "every month";
      break;
    default:
      newTemperatureLineBaseProps.xFormat = "time:%Y/%m/%d %H:%M";
      newTemperatureLineBaseProps.axisBottom.format = "%e";
      newTemperatureLineBaseProps.axisBottom.tickValues = "every 3 days";
      break;
  }

  newTemperatureLineBaseProps.yScale = {
    type: "linear",
    min: Math.min(...data.map(item => item[property])) - 3,
    max: Math.max(...data.map(item => item[property])) + 3
  };

  if (combinedTooltip) {
    newTemperatureLineBaseProps.enableSlices = 'x';
    newTemperatureLineBaseProps.sliceTooltip = ({ slice }) => {
      const tooltips = slice.points.map((item, index) =>
        <TooltipLine
          slice={true}
          key={index}
          point={item}
        />
      );

      return (
        <div
          style={{
            background: 'rgb(57 57 57)',
            boxShadow: `0 2px 6px rgb(57 57 57)`
          }}
          className="diagram-tooltip"
        >
          <header style={{
            textAlign: 'right',
            color: 'white',
            padding: '7px 7px 14px 20px',
            fontSize: '1.2em'
          }}>
            {slice.points[0].data.xFormatted}
          </header>
          {tooltips}
        </div>
      );
    };
  }

  return newTemperatureLineBaseProps;
}

export const TemperatureBase:FunctionComponent<DiagramBaseProps> = (props: DiagramBaseProps): React.ReactElement => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [daily, setDaily] = useState(false);

  const scale = () => {
    const timeDifferenceInDays = getTimeDifferenceInDays(props.data);

    let newData: dataItem[];

    if (timeDifferenceInDays > 14) {
      setDaily(true);
      // @todo useMemo?
      newData = scaleAveragePerDay(props.data, 'temperature');
    } else {
      setDaily(false);
      newData = props.data;
    }

    setData(newData);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    scale();
  }, [props.data]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loading
          description="Active loading indicator"
          withOverlay={false}
        />
      </div>
    );
  }

  return (
    <div data-testid="temperature-diagram">
      {props.title &&
        <h3>
          <Temperature32 />
          {props.title}
        </h3>
      }

      <div style={{ height: props.height }} className="diagram">
        <ResponsiveLine
          {...getTemperatureLineBaseProps(daily ? 'daily' : '', data, 'temperature', false)}
          data={[
            {
              id: 'temperature',
              data: data.map(item => ({
                x: item.timeParsed,
                y: item.temperature
              }))
            }
          ]}
          // @todo theme={}
          colors= {['#8B0000']}
          tooltip={point => <TooltipLine point={point.point} />}
        />
      </div>

    </div>
  );
}