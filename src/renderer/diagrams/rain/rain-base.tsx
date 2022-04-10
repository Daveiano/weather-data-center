import React, { FunctionComponent, useEffect, useState } from "react";

import moment from "moment";
import { ResponsiveBar } from "@nivo/bar";
import { Loading } from "carbon-components-react";
import { Rain32 } from "@carbon/icons-react";
import type { ScaleSpec, ScaleBandSpec } from "@nivo/scales";
import type { ValueFormat, Box, Theme } from "@nivo/core";
import type { AxisProps } from "@nivo/axes";
import type { BarTooltipProps } from "@nivo/bar/dist/types/types";

import { dataItem, DiagramBaseProps } from "../types";
import {
  getTimeDifferenceInDays,
  getTimeDifferenceInMonths,
  Precision,
  propertyParameter,
  scaleMax,
  scaleSum,
} from "../scaling";
import { TooltipBar } from "../tooltip";
import { withEmptyCheck } from "../hoc";

type RainBarBasePropsTypes = {
  indexBy: string;
  keys: string[];
  valueScale: ScaleSpec;
  indexScale: ScaleBandSpec;
  maxValue?: "auto" | number;
  minValue: "auto" | number;
  valueFormat?: ValueFormat<number>;
  margin?: Box;
  enableLabel: boolean;
  labelSkipHeight: number;
  enableGridX: boolean;
  enableGridY: boolean;
  axisLeft: AxisProps | null;
  axisBottom?: AxisProps | null;
  colors: string[];
  theme?: Theme;
  isInteractive: boolean;
  tooltip?: React.FC<BarTooltipProps<dataItem>>;
};

const RainBarBaseProps: RainBarBasePropsTypes = {
  indexBy: "timeParsed",
  keys: ["rain"],
  valueScale: { type: "linear" },
  indexScale: { type: "band", round: false },
  minValue: 0,
  margin: { top: 20, right: 10, bottom: 20, left: 40 },
  enableLabel: false,
  labelSkipHeight: 50,
  enableGridX: false,
  enableGridY: true,
  axisLeft: {
    legend: "mm",
    legendOffset: -35,
    legendPosition: "middle",
    tickSize: 0,
    tickPadding: 10,
  },
  colors: ["#0198E1"],
  isInteractive: true,
};

export const getRainBarBaseProps = (
  precision: Precision,
  data: dataItem[],
  property: propertyParameter,
  unit: string
): RainBarBasePropsTypes => {
  const timeDifferenceInDays = getTimeDifferenceInDays(data);
  const newRainBarBaseProps = RainBarBaseProps;
  const rotateTicks =
    precision === "day" ||
    precision === "week" ||
    getTimeDifferenceInMonths(data) >= 11;

  newRainBarBaseProps.valueFormat = (value) => `${value} ${unit}`;
  newRainBarBaseProps.axisLeft.legend = unit;

  newRainBarBaseProps.maxValue =
    Math.max(...data.map((item) => item[property])) + 5;
  newRainBarBaseProps.theme = {
    fontSize: precision === "day" ? 10 : 11,
  };

  newRainBarBaseProps.axisBottom = {
    format: (value) => {
      switch (precision) {
        case "day":
          if (timeDifferenceInDays >= 200) {
            if (moment(value).format("D") === "1") {
              return moment(value).format("Do MMM");
            }
            return "";
          } else {
            if (
              parseInt(moment(value).format("D")) % 2 == 0 ||
              moment(value).format("D") === "31"
            ) {
              return "";
            }
            if (moment(value).format("D") === "1") {
              return moment(value).format("Do MMM");
            }

            return moment(value).format("Do");
          }
        case "week":
          if (parseInt(moment(value).format("D")) <= 6) {
            return moment(value).format("MMM - [W]W\\/YY");
          }
          return moment(value).format("[W]W\\/YY");
        case "month":
          return moment(value).format("MMM YY");
        case "year":
          return moment(value).format("YY");
      }
    },
    tickSize: 0,
    tickPadding: 5,
    tickRotation: rotateTicks ? -65 : 0,
  };

  newRainBarBaseProps.tooltip = (point) => (
    <TooltipBar
      formattedValue={point.formattedValue}
      color="#0198E1"
      time={(() => {
        switch (precision) {
          case "day":
            return moment.unix(point.data.time).utc().format("YYYY/MM/DD");
          case "week":
            return `${moment
              .unix(point.data.time)
              .utc()
              .format("[W]W\\/YY")} <br/>${moment
              .unix(point.data.time)
              .utc()
              .day(1)
              .format("YYYY/MM/DD")} - ${moment
              .unix(point.data.time)
              .utc()
              .day(7)
              .format("YYYY/MM/DD")}`;
          case "month":
            return moment.unix(point.data.time).utc().format("YYYY/MM");
          case "year":
            return moment.unix(point.data.time).utc().format("YYYY");
        }
      })()}
    />
  );

  if (rotateTicks) {
    newRainBarBaseProps.margin.bottom = 80;
  }

  if (rotateTicks && precision === "month") {
    newRainBarBaseProps.margin.bottom = 40;
  }

  return newRainBarBaseProps;
};

const RainBase: FunctionComponent<DiagramBaseProps> = (
  props: DiagramBaseProps
): React.ReactElement => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [precision, setPrecision] = useState(
    props.precision ? props.precision : "day"
  );

  const scale = () => {
    const timeDifferenceInDays = getTimeDifferenceInDays(props.data);

    let newData: dataItem[];

    if (timeDifferenceInDays > 18 && timeDifferenceInDays < 77) {
      setPrecision("week");
      newData = scaleSum(props.data, "rain", "week");
    } else if (timeDifferenceInDays >= 77) {
      setPrecision("month");
      newData = scaleSum(props.data, "rain", "month");
    } else {
      setPrecision("day");
      newData = scaleMax(props.data, "rain", "day");
    }

    setData(newData);
    setLoading(false);
  };

  useEffect(() => {
    if (!props.precision) {
      setLoading(true);
      scale();
    } else {
      setPrecision(props.precision);
      setData(
        props.precision === "day"
          ? scaleMax(props.data, "rain", "day")
          : scaleSum(props.data, "rain", props.precision)
      );
      setLoading(false);
    }
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
    <div data-testid="rain-diagram">
      {props.title && (
        <h3>
          <Rain32 />
          {props.title}
        </h3>
      )}

      <div style={{ height: props.height }} className="diagram">
        <ResponsiveBar
          {...getRainBarBaseProps(
            precision,
            data,
            "rain",
            props.config.unit_rain
          )}
          data={data}
          annotations={props.annotations}
        />
      </div>
    </div>
  );
};

export default withEmptyCheck(RainBase);
