import React, {FunctionComponent, useEffect, useState} from 'react';

import moment from 'moment';
import { ResponsiveBar } from '@nivo/bar'
import { Loading } from "carbon-components-react";

import {dataItem, DiagramBaseProps} from "../types";
import { getTimeDifferenceInDays, scaleMaxPerDay, scaleMaxPerWeek, scaleMaxPerMonth } from "../scaling";
import { TooltipBar } from "../tooltip";

export const RainBase:FunctionComponent<DiagramBaseProps> = (props: DiagramBaseProps): React.ReactElement => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [daily, setDaily] = useState(false);
  const [weekly, setWeekly] = useState(false);
  const [monthly, setMonthly] = useState(false);

  const scale = () => {
    const timeDifferenceInDays = getTimeDifferenceInDays(props.data);

    let newData: dataItem[];

    setLoading(true);

    if (timeDifferenceInDays > 18 && timeDifferenceInDays < 77) {
      setWeekly(true);
      newData = scaleMaxPerWeek(props.data, 'rain');
    } else if (timeDifferenceInDays >= 77) {
      setMonthly(true);
      newData = scaleMaxPerMonth(props.data, 'rain');
    } else {
      setDaily(true);
      newData = scaleMaxPerDay(props.data, 'rain');
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
    <div data-testid="rain-diagram">
      <h3>{props.title}</h3>

      <div style={{ height: props.height }}>
        <ResponsiveBar
          data={data}
          indexBy={"timeParsed"}
          keys={['rain']}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: false }}
          minValue={0}
          maxValue={Math.max.apply(Math, data.map(item => item.rain )) + 5}
          valueFormat={value => `${value} mm`}
          margin={{ top: 20, right: 10, bottom: 20, left: 40 }}
          colors= {['#0198E1']}
          enableLabel={false}
          labelSkipHeight={50}
          enableGridX={false}
          enableGridY={true}
          axisLeft={{
            legend: 'mm',
            legendOffset: -35,
            legendPosition: 'middle',
            tickSize: 0,
            tickPadding: 10
          }}
          axisBottom={{
            format: value => {
              if (daily) {
                return moment(value).format("Do");
              }
              if (weekly) {
                return moment(value).format('\\Www YY');
              }
              if (monthly) {
                return moment(value).format('MMM YY');
              }
            },
            tickSize: 0,
            tickPadding: 5,
          }}
          isInteractive={true}
          tooltip={point => <TooltipBar formattedValue={point.formattedValue} time={point.data.time} color="#0198E1" colorDarken="#004c70" />}
        />
      </div>
    </div>
  );
}