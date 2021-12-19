import React, { FunctionComponent, useEffect, useState } from 'react';

import { Loading } from "carbon-components-react";
import { ResponsiveLine } from '@nivo/line'
import { TemperatureFeelsLike32 } from "@carbon/icons-react";

import { dataItem, DiagramBaseProps } from "../types";
import {getTimeDifferenceInDays, scaleMinPerDay, scaleMaxPerDay} from "../scaling";
import { TooltipLine} from "../tooltip";

export const FeltTemperatureBase:FunctionComponent<DiagramBaseProps> = (props: DiagramBaseProps): React.ReactElement => {
  const [dataMin, setDataMin] = useState([]);
  const [dataMax, setDataMax] = useState([]);
  const [loading, setLoading] = useState(true);
  const [daily, setDaily] = useState(false);

  const scale = () => {
    const timeDifferenceInDays = getTimeDifferenceInDays(props.data);

    let newDataMin: dataItem[],
      newDataMax: dataItem[];

    if (timeDifferenceInDays > 14) {
      setDaily(true);
      newDataMin = scaleMinPerDay(props.data, 'felt_temperature');
      newDataMax = scaleMaxPerDay(props.data, 'felt_temperature');
    } else {
      setDaily(false);
      newDataMin = props.data;
      newDataMax = props.data;
    }

    setDataMin(newDataMin);
    setDataMax(newDataMax);
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
    <div data-testid="dew-point-diagram">
      <h3>
        <TemperatureFeelsLike32 />
        {props.title}
      </h3>

      <div style={{ height: props.height }}>
        <ResponsiveLine
          data={[
            {
              id: 'Min',
              data: dataMin.map(item => ({
                x: item.timeParsed,
                y: item.felt_temperature
              }))
            },
            {
              id: 'Max',
              data: dataMax.map(item => ({
                x: item.timeParsed,
                y: item.felt_temperature
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
            min: Math.min.apply(Math, dataMin.map(item => item.felt_temperature)) - 3,
            max: Math.max.apply(Math, dataMax.map(item => item.felt_temperature)) + 3
          }}
          yFormat={value => `${value} °C`}
          margin={{ top: 20, right: 10, bottom: 20, left: 40 }}
          curve="natural"
          // @todo theme={}
          colors= {['#67C8FF', '#C41E3A']}
          lineWidth={2}
          enableArea={false}
          areaOpacity={0.07}
          enablePoints={true}
          pointSize={5}
          enablePointLabel={false}
          pointLabel="yFormatted"
          axisLeft={{
            legend: '°C',
            legendOffset: -35,
            legendPosition: 'middle',
            tickSize: 0,
            tickPadding: 10
          }}
          axisBottom={{
            format: daily ? "%b %Y" : "%e",
            tickValues: daily ? "every month" : "every 3 days",
            tickSize: 0,
            tickPadding: 5
          }}
          isInteractive={true}
          tooltip={point => point.point.serieId === 'Min' ?
            <TooltipLine point={point.point} color="#67C8FF" colorDarken="#0072b3" /> :
            <TooltipLine point={point.point} color="#C41E3A" colorDarken="#620f1d" />
          }
          useMesh={true}
          enableCrosshair={true}
          markers={[
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
            },
          ]}
          legends={[
            {
              anchor: 'top-right',
              direction: 'row',
              itemWidth: 50,
              itemHeight: 20,
              itemsSpacing: 10
            }
          ]}
        />
      </div>

    </div>
  );
}