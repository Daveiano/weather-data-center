import React, { FunctionComponent, useEffect, useMemo, useState } from "react";

import { Loading } from "carbon-components-react";
import { Temperature32 } from "@carbon/icons-react";
import { ResponsiveLine } from "@nivo/line";
import type { DatumValue, SliceTooltip } from "@nivo/line";
import type {
  ScaleTimeSpec,
  ScaleLinearSpec,
} from "@nivo/scales/dist/types/types";
import type { CartesianMarkerProps, Box, ValueFormat } from "@nivo/core";
import type { AxisProps } from "@nivo/axes";

import { dataItem, DiagramBaseProps } from "../types";
import {
  getTimeDifferenceInDays,
  propertyParameter,
  scaleAverage,
  getTimeAxisScaling,
} from "../scaling";
import { sliceTooltip, TooltipLine } from "../tooltip";
import { withEmptyCheck } from "../hoc";

type TemperatureLineBasePropsTypes = {
  xScale: ScaleTimeSpec;
  yScale?: ScaleLinearSpec;
  xFormat?: ValueFormat<DatumValue>;
  yFormat?: ValueFormat<DatumValue>;
  axisLeft: AxisProps;
  axisBottom?: AxisProps;
  markers: CartesianMarkerProps[];
  useMesh: boolean;
  enableCrosshair: boolean;
  isInteractive: boolean;
  lineWidth: number;
  enableArea: boolean;
  areaOpacity: number;
  enablePoints: boolean;
  pointSize: number;
  enablePointLabel: boolean;
  pointLabel: string;
  curve:
    | "basis"
    | "cardinal"
    | "catmullRom"
    | "linear"
    | "monotoneX"
    | "monotoneY"
    | "natural"
    | "step"
    | "stepAfter"
    | "stepBefore";
  margin: Box;
  enableSlices?: "x" | "y" | false;
  sliceTooltip?: SliceTooltip;
};

const TemperatureLineBaseProps: TemperatureLineBasePropsTypes = {
  xScale: {
    type: "time",
    useUTC: true,
    format: "%Y-%m-%dT%H:%M:%S.000Z",
    precision: "day",
  },
  axisLeft: {
    legend: "°C",
    legendOffset: -35,
    legendPosition: "middle",
    tickSize: 0,
    tickPadding: 10,
  },
  markers: [
    {
      axis: "y",
      value: 0,
      lineStyle: {
        stroke: "#00BFFF",
        strokeWidth: 2,
        strokeOpacity: 0.75,
        strokeDasharray: "10, 10",
      },
      legend: "0 °C",
      legendOrientation: "horizontal",
    },
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
  margin: { top: 20, right: 10, bottom: 20, left: 40 },
};

export const getTemperatureLineBaseProps = (
  precision: string,
  data: dataItem[],
  property: propertyParameter,
  combinedTooltip: boolean,
  unit: string
): TemperatureLineBasePropsTypes => {
  const newTemperatureLineBaseProps = TemperatureLineBaseProps;

  newTemperatureLineBaseProps.axisBottom = {
    tickSize: 0,
    tickPadding: 5,
    ...getTimeAxisScaling(data),
  };

  newTemperatureLineBaseProps.yFormat = (value) => `${value} ${unit}`;
  newTemperatureLineBaseProps.axisLeft.legend = unit;

  // @see https://github.com/d3/d3-time-format
  switch (precision) {
    case "yearly":
      newTemperatureLineBaseProps.xScale.precision = "year";
      newTemperatureLineBaseProps.xFormat = "time:%Y";
      break;
    case "monthly":
      newTemperatureLineBaseProps.xScale.precision = "month";
      newTemperatureLineBaseProps.xFormat = "time:%Y/%m";
      break;
    case "daily":
      newTemperatureLineBaseProps.xScale.precision = "day";
      newTemperatureLineBaseProps.xFormat = "time:%Y/%m/%d";
      break;
    default:
      newTemperatureLineBaseProps.xScale.precision = "minute";
      newTemperatureLineBaseProps.xFormat = "time:%Y/%m/%d %H:%M";
      break;
  }

  newTemperatureLineBaseProps.yScale = {
    type: "linear",
    min: Math.min(...data.map((item) => item[property])) - 3,
    max: Math.max(...data.map((item) => item[property])) + 3,
  };

  if (combinedTooltip) {
    newTemperatureLineBaseProps.enableSlices = "x";
    newTemperatureLineBaseProps.sliceTooltip = (slice) => sliceTooltip(slice);
  }

  return newTemperatureLineBaseProps;
};

const TemperatureBase: FunctionComponent<DiagramBaseProps> = (
  props: DiagramBaseProps
): React.ReactElement => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [daily, setDaily] = useState(false);

  const scaledData = useMemo(
    () => scaleAverage(props.data, "temperature", "day"),
    [props.data]
  );
  const timeDifferenceInDays = useMemo(
    () => getTimeDifferenceInDays(props.data),
    [props.data]
  );

  const scale = () => {
    let newData: dataItem[];

    if (timeDifferenceInDays > 14) {
      setDaily(true);
      newData = scaledData;
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loading description="Active loading indicator" withOverlay={false} />
      </div>
    );
  }

  return (
    <div data-testid="temperature-diagram">
      {props.title && (
        <h3>
          <Temperature32 />
          {props.title}
        </h3>
      )}

      <div style={{ height: props.height }} className="diagram">
        <ResponsiveLine
          {...getTemperatureLineBaseProps(
            daily ? "daily" : "",
            data,
            "temperature",
            false,
            props.config.unit_temperature
          )}
          data={[
            {
              id: "temperature",
              data: data.map((item) => ({
                x: item.timeParsed,
                y: item.temperature,
              })),
            },
          ]}
          colors={["#8B0000"]}
          tooltip={(point) => <TooltipLine point={point.point} />}
        />
      </div>
    </div>
  );
};

export default withEmptyCheck(TemperatureBase);
