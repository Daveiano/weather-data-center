import React, {FunctionComponent, useEffect, useState} from 'react';

import { UvIndex32 } from "@carbon/icons-react";
import {ResponsiveLine} from "@nivo/line";
import { Loading } from "carbon-components-react";

import {dataItem, DiagramBaseProps} from "../types";
import { getTimeDifferenceInDays, scaleMax } from "../scaling";
import { TooltipLine } from "../tooltip";
import { withEmptyCheck } from "../hoc";

const UviBase:FunctionComponent<DiagramBaseProps> = (props: DiagramBaseProps): React.ReactElement => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [daily, setDaily] = useState(false);

  const scale = () => {
    const timeDifferenceInDays = getTimeDifferenceInDays(props.data);

    let newData: dataItem[];

    if (timeDifferenceInDays > 14) {
      setDaily(true);
      newData = scaleMax(props.data, 'uvi', 'day');
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
    <div data-testid="uvi-diagram" className="diagram">
      <h3>
        <UvIndex32 />
        {props.title}
      </h3>

      <div style={{ height: props.height }}>
        <ResponsiveLine
          data={[
            {
              id: 'uvi',
              data: data.map(item => ({
                x: item.timeParsed,
                y: item.uvi
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
            max: 8
          }}
          yFormat={value => `${value}`}
          margin={{ top: 20, right: 10, bottom: 20, left: 40 }}
          curve="step"
          // @todo theme={}
          colors= {['#e61919']}
          lineWidth={2}
          enableArea={true}
          areaOpacity={0.07}
          enablePoints={true}
          pointSize={5}
          enablePointLabel={false}
          pointLabel="yFormatted"
          axisLeft={{
            legend: 'UVI',
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

export default withEmptyCheck(UviBase);