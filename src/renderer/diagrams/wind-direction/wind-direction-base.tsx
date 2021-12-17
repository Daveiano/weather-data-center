import React, {FunctionComponent, useEffect, useState} from 'react';

import { WindStream32 } from "@carbon/icons-react";
import {ResponsiveLine} from "@nivo/line";
import { Loading } from "carbon-components-react";

import {dataItem, DiagramBaseProps} from "../types";
import {
  getTimeDifferenceInDays,
  scaleMaxPerDay,
  scaleMaxPerWeek,
  scaleMaxPerMonth,
  scaleAveragePerDay
} from "../scaling";
import { TooltipLine } from "../tooltip";

const degToCompass = (deg: number): string => {
  const value = Math.floor((deg / 22.5) + 0.5),
    compass = ["N","NNE","NE","ENE","E","ESE", "SE", "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];

  return compass[(value % 16)];
};

export const WindDirectionBase:FunctionComponent<DiagramBaseProps> = (props: DiagramBaseProps): React.ReactElement => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [daily, setDaily] = useState(false);

  const scale = () => {
    const timeDifferenceInDays = getTimeDifferenceInDays(props.data);

    let newData: dataItem[];

    setLoading(true);

    if (timeDifferenceInDays > 14) {
      setDaily(true);
      newData = scaleAveragePerDay(props.data, 'wind_direction');
    } else {
      setDaily(false);
      newData = props.data;
    }

    setData(newData);
    setLoading(false);
  };

  useEffect(() => {
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
    <div data-testid="wind-direction-diagram">
      <h3>
        <WindStream32 />
        {props.title}
      </h3>

      <div style={{ height: props.height }}>
        <ResponsiveLine
          data={[
            {
              id: 'wind_direction',
              data: data.map(item => ({
                x: item.timeParsed,
                y: item.wind_direction
              }))
            }
          ]}
          xScale={{
            type: "time",
            useUTC: true,
            format: "%Y-%m-%dT%H:%M:%S.000Z",
            precision: 'minute'
          }}
          xFormat={daily ? "time:%Y/%m/%d" : "time:%Y/%m/%d %H:%M"}
          yScale={{
            type: "linear",
            min: 0,
            max: 360
          }}
          yFormat={value => `${value}°`}
          margin={{ top: 20, right: 10, bottom: 20, left: 40 }}
          curve="basis"
          // @todo theme={}
          colors= {['#000000']}
          lineWidth={2}
          enableArea={true}
          areaOpacity={0.07}
          enablePoints={true}
          pointSize={5}
          enablePointLabel={false}
          pointLabel="yFormatted"
          axisLeft={{
            legend: '°',
            legendOffset: -35,
            legendPosition: 'middle',
            tickSize: 0,
            tickPadding: 5,
            format: value => degToCompass(value)
          }}
          axisBottom={{
            format: daily ? "%b %Y" : "%e",
            tickValues: daily ? "every month" : "every 3 days",
            tickSize: 0,
            tickPadding: 5
          }}
          isInteractive={true}
          tooltip={point => <TooltipLine point={point.point} color="#000000" colorDarken="#000000" />}
          useMesh={true}
          enableCrosshair={true}
        />
      </div>
    </div>
  );
}