import React, {FunctionComponent, useEffect, useState} from 'react';

import { Sun32 } from "@carbon/icons-react";
import {ResponsiveLine} from "@nivo/line";
import { Loading } from "carbon-components-react";

import {dataItem, DiagramBaseProps} from "../types";
import { getTimeDifferenceInDays, scaleAverage } from "../scaling";
import { TooltipLine } from "../tooltip";
import { withEmptyCheck } from "../hoc";

const SolarBase:FunctionComponent<DiagramBaseProps> = (props: DiagramBaseProps): React.ReactElement => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [daily, setDaily] = useState(false);

  const scale = () => {
    const timeDifferenceInDays = getTimeDifferenceInDays(props.data);

    let newData: dataItem[];

    if (timeDifferenceInDays > 14) {
      setDaily(true);
      newData = scaleAverage(props.data, 'solar', 'day');
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
    <div data-testid="solar-diagram">
      {props.title &&
        <h3>
          <Sun32 />
          {props.title}
        </h3>
      }

      <div style={{ height: props.height }} className="diagram">
        <ResponsiveLine
          data={[
            {
              id: 'solar',
              data: data.map(item => ({
                x: item.timeParsed,
                y: item.solar
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
            max: Math.max.apply(Math, data.map(item => item.solar)) + 25
          }}
          yFormat={value => `${value} w/m²`}
          margin={{ top: 20, right: 10, bottom: 20, left: 40 }}
          curve="basis"
          // @todo theme={}
          colors= {['#ff8c00']}
          lineWidth={2}
          enableArea={true}
          areaOpacity={0.07}
          enablePoints={true}
          pointSize={5}
          enablePointLabel={false}
          pointLabel="yFormatted"
          axisLeft={{
            legend: 'w/m²',
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

export default withEmptyCheck(SolarBase);