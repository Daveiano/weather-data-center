import React, { FunctionComponent, useEffect, useState } from 'react';

import { Loading } from "carbon-components-react";
import { ResponsiveLine } from '@nivo/line'
import { TemperatureFeelsLike32 } from "@carbon/icons-react";

import { dataItem, DiagramBaseProps } from "../types";
import { getTimeDifferenceInDays, scaleMinPerDay, scaleMaxPerDay } from "../scaling";
import { TooltipLine} from "../tooltip";
import { getTemperatureLineBaseProps } from './temperature-base';

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

      <div style={{ height: props.height }} className="diagram">
        <ResponsiveLine
          {...getTemperatureLineBaseProps(daily, [...dataMin, ...dataMax], 'felt_temperature')}
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
          // @todo theme={}
          colors= {['#67C8FF', '#C41E3A']}
          tooltip={point => point.point.serieId === 'Min' ?
            <TooltipLine point={point.point} color="#67C8FF" colorDarken="#0072b3" /> :
            <TooltipLine point={point.point} color="#C41E3A" colorDarken="#620f1d" />
          }
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