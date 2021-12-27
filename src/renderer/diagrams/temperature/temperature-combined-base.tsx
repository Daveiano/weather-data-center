import React, { FunctionComponent, useEffect, useState } from 'react';

import { Loading } from "carbon-components-react";
import { Temperature32 } from "@carbon/icons-react";
import { ResponsiveLine} from '@nivo/line'

import { dataItem, DiagramBaseProps } from "../types";
import { getTimeDifferenceInDays, scaleAveragePerDay } from "../scaling";
import { TooltipLine } from "../tooltip";
import { getTemperatureLineBaseProps } from "./temperature-base";

export const TemperatureCombinedBase:FunctionComponent<DiagramBaseProps> = (props: DiagramBaseProps): React.ReactElement => {
  const [dataTemp, setDataTemp] = useState([]);
  const [dataDew, setDataDew] = useState([]);
  const [dataFelt, setDataFelt] = useState([]);
  const [loading, setLoading] = useState(true);
  const [daily, setDaily] = useState(false);
  const [hiddenSeries, setHiddenSeries] = useState([]);

  const scale = () => {
    const timeDifferenceInDays = getTimeDifferenceInDays(props.data);

    let newDataTemp: dataItem[],
      newDataDew: dataItem[],
      newDataFelt: dataItem[];

    if (timeDifferenceInDays > 14) {
      setDaily(true);
      // @todo useMemo?
      newDataTemp = scaleAveragePerDay(props.data, 'temperature');
      newDataDew = scaleAveragePerDay(props.data, 'dew_point');
      newDataFelt = scaleAveragePerDay(props.data, 'felt_temperature');
    } else {
      setDaily(false);
      newDataTemp = props.data;
      newDataDew = props.data;
      newDataFelt = props.data;
    }

    setDataTemp(newDataTemp);
    setDataDew(newDataDew);
    setDataFelt(newDataFelt);
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
    <div data-testid="temperature-combined-diagram">
      {props.title &&
        <h3>
          <Temperature32 />
          {props.title}
        </h3>
      }

      <div style={{ height: props.height }} className="diagram">
        <ResponsiveLine
          {...getTemperatureLineBaseProps(
            daily ? 'daily' : '',
            [
              ...dataFelt.map(item => {
                item.temperature = item.felt_temperature;
                return item;
              }),
              ...dataDew.map(item => {
                item.temperature = item.dew_point;
                return item;
              }),
              ...dataTemp
            ],
            'temperature'
          )}
          data={[
            {
              id: 'Temperature',
              data: dataTemp.map(item => ({
                x: item.timeParsed,
                y: item.temperature
              })),
              color: hiddenSeries.includes('Temperature') ? 'transparent' : '#000000'
            },
            {
              id: 'Dew point',
              data: dataDew.map(item => ({
                x: item.timeParsed,
                y: item.dew_point,
              })),
              color: hiddenSeries.includes('Dew point') ? 'transparent' : '#5F9EA0'
            },
            {
              id: 'Felt',
              data: dataFelt.map(item => ({
                x: item.timeParsed,
                y: item.felt_temperature
              })),
              color: hiddenSeries.includes('Felt') ? 'transparent' : '#C41E3A'
            },
          ]}
          // @todo theme={}
          colors={d => d.color}
          // @todo Add base for slice tooltip.
          enableSlices="x"
          sliceTooltip={({ slice }) => {
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
          }}
          legends={[
            {
              anchor: 'top-right',
              direction: 'row',
              itemWidth: 100,
              itemHeight: 20,
              itemsSpacing: 10,
              onClick: (d) => {
                let hidden = hiddenSeries;
                if (hidden.includes(d.id)) {
                  hidden = hidden.filter(item => item != d.id);
                }
                else {
                  hidden = [...hidden, d.id];
                }

                setHiddenSeries(hidden);
              }
            }
          ]}
        />
      </div>

    </div>
  );
}