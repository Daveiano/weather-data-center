import React, {FunctionComponent, useEffect, useState} from 'react';

import { Loading } from "carbon-components-react";
import { ResponsiveLine } from '@nivo/line'
import { Windy32 } from "@carbon/icons-react";

import { dataItem, DiagramBaseProps } from "../types";
import { getTimeDifferenceInDays, scaleAverage, scaleMax } from "../scaling";
import {sliceTooltip} from "../tooltip";
import { withEmptyCheck } from "../hoc";

const WindBase:FunctionComponent<DiagramBaseProps> = (props: DiagramBaseProps): React.ReactElement => {
  const [dataWind, setDataWind] = useState(props.data);
  const [dataGust, setDataGust] = useState(props.data);
  const [loading, setLoading] = useState(false);
  const [daily, setDaily] = useState(false);

  const scale = () => {
    const timeDifferenceInDays = getTimeDifferenceInDays(props.data);

    let newDataWind: dataItem[],
      newDataGust: dataItem[];

    if (timeDifferenceInDays > 14) {
      setDaily(true);
      newDataWind = scaleAverage(props.data, 'wind', 'day');
      newDataGust = scaleMax(props.data, 'gust', 'day');
    } else {
      setDaily(false);
      newDataWind = props.data;
      newDataGust = props.data;
    }

    setDataWind(newDataWind);
    setDataGust(newDataGust);
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
    <div data-testid="wind-diagram">
      {props.title &&
        <h3>
          <Windy32 />
          {props.title}
        </h3>
      }

      <div style={{ height: props.height }} className="diagram">
        <ResponsiveLine
          data={[
            {
              id: 'Wind (Ø / day)',
              data: dataWind.map(item => ({
                x: item.timeParsed,
                y: item.wind
              }))
            },
            {
              id: 'Gust (Max / day)',
              data: dataGust.map(item => ({
                x: item.timeParsed,
                y: item.gust
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
            max: Math.max.apply(Math, dataGust.map(item => item.gust)) + 5
          }}
          yFormat={value => `${value} ${props.config.unit_wind}`}
          margin={{ top: 20, right: 10, bottom: 20, left: 40 }}
          curve="cardinal"
          colors= {['#ffc000', '#666666']}
          lineWidth={2}
          enableArea={true}
          areaOpacity={0.5}
          areaBlendMode="normal"
          enablePoints={true}
          pointSize={5}
          enablePointLabel={false}
          pointLabel="yFormatted"
          axisLeft={{
            legend: props.config.unit_wind,
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
          enableSlices="x"
          sliceTooltip={(slice) => sliceTooltip(slice)}
          useMesh={true}
          enableCrosshair={true}
          legends={[
            {
              anchor: 'top-right',
              direction: 'column',
              itemWidth: 105,
              itemHeight: 20,
              itemsSpacing: 10
            }
          ]}
        />
      </div>

    </div>
  );
};

export default withEmptyCheck(WindBase);