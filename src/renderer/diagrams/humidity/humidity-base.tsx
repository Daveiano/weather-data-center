import React, { FunctionComponent, useEffect, useState } from 'react';

import { Loading } from "carbon-components-react";
import { ResponsiveLine } from '@nivo/line'
import { Humidity32 } from "@carbon/icons-react";

import {dataItem, DiagramBaseProps} from "../types";
import { getTimeDifferenceInDays, scaleAverage } from "../scaling";
import { TooltipLine } from "../tooltip";
import { withEmptyCheck } from "../hoc";

const HumidityBase:FunctionComponent<DiagramBaseProps> = (props: DiagramBaseProps): React.ReactElement => {
  const [data, setData] = useState(props.data);
  const [loading, setLoading] = useState(false);
  const [daily, setDaily] = useState(false);

  const scale = () => {
    const timeDifferenceInDays = getTimeDifferenceInDays(props.data);

    let newData: dataItem[];

    // Calculate daily average by summing all measurements an dividing by the
    // number of values.
    if (timeDifferenceInDays > 14) {
      setDaily(true);
      newData = scaleAverage(props.data, 'humidity', 'day');
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
    <div data-testid="humidity-diagram">
      <h3>
        <Humidity32 />
        {props.title}
      </h3>

      <div style={{ height: props.height }} className="diagram">
        <ResponsiveLine
          data={[
            {
              id: 'humidity',
              data: data.map(item => ({
                x: item.timeParsed,
                y: item.humidity
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
            max: 103
          }}
          yFormat={value => `${value} %`}
          margin={{ top: 20, right: 10, bottom: 20, left: 40 }}
          curve="cardinal"
          // @todo theme={}
          colors= {['#0099CC']}
          lineWidth={2}
          enableArea={true}
          areaOpacity={0.07}
          enablePoints={true}
          pointSize={5}
          enablePointLabel={false}
          pointLabel="yFormatted"
          axisLeft={{
            legend: '%',
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
          tooltip={point => <TooltipLine point={point.point} />}
          useMesh={true}
          enableCrosshair={true}
        />
      </div>

    </div>
  );
};

export default withEmptyCheck(HumidityBase);