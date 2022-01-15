import React, {FunctionComponent, useEffect, useState} from 'react';

import { Loading } from "carbon-components-react";
import { Pressure32 } from "@carbon/icons-react";
import { ResponsiveLine } from '@nivo/line'

import {dataItem, DiagramBaseProps} from "../types";
import { getTimeDifferenceInDays, scaleAverage } from "../scaling";
import { TooltipLine } from "../tooltip";
import { withEmptyCheck } from "../hoc";

const PressureBase:FunctionComponent<DiagramBaseProps> = (props: DiagramBaseProps): React.ReactElement => {
  const [data, setData] = useState(props.data);
  const [loading, setLoading] = useState(false);
  const [daily, setDaily] = useState(false);

  const scale = () => {
    const timeDifferenceInDays = getTimeDifferenceInDays(props.data);

    let newData: dataItem[];

    if (timeDifferenceInDays > 14) {
      setDaily(true);
      newData = scaleAverage(props.data, 'pressure', 'day');
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
    <div data-testid="pressure-diagram">
      {props.title &&
        <h3>
          <Pressure32 />
          {props.title}
        </h3>
      }

      <div style={{ height: props.height }} className="diagram">
        <ResponsiveLine
          data={[
            {
              id: 'pressure',
              data: data.map(item => ({
                x: item.timeParsed,
                y: item.pressure
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
            min: Math.min.apply(Math, data.map(item => item.pressure)) - 3,
            max: Math.max.apply(Math, data.map(item => item.pressure)) + 3
          }}
          yFormat={value => `${value} hPa`}
          margin={{ top: 20, right: 10, bottom: 20, left: 40 }}
          curve="cardinal"
          // @todo theme={}
          colors= {['#666666']}
          lineWidth={2}
          enableArea={true}
          areaOpacity={0.07}
          areaBaselineValue={Math.min.apply(Math, data.map(item => item.pressure)) - 3}
          enablePoints={true}
          pointSize={5}
          enablePointLabel={false}
          pointLabel="yFormatted"
          axisLeft={{
            legend: 'hPa',
            legendOffset: -35,
            legendPosition: 'middle',
            tickSize: 0,
            tickPadding: 5
          }}
          axisBottom={{
            format: daily ? "%b %Y" : "%e",
            tickValues: daily ? "every month" : "every 3 days",
            tickSize: 0,
            tickPadding: 5
          }}
          isInteractive={true}
          tooltip={point => <TooltipLine point={point.point} />}
          useMesh={true}
          enableCrosshair={true}
        />
      </div>

    </div>
  );
};

export default withEmptyCheck(PressureBase);