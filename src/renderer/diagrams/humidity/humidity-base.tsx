import React, { FunctionComponent, useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';

import { enGB } from 'date-fns/locale'
import moment from 'moment';

import {LineChart} from "@carbon/charts-react";
import {Alignments, ScaleTypes} from "@carbon/charts/interfaces";

import { DiagramBaseProps } from "../types";
import { getTimeDifferenceInDays, scaleAverage } from "../scaling";

export const HumidityBase:FunctionComponent<DiagramBaseProps> = (props: DiagramBaseProps): React.ReactElement => {
  const [data, setData] = useState(props.data);
  const [loading, setLoading] = useState(false);
  const [daily, setDaily] = useState(false);

  const scale = () => {
    const timeDifferenceInDays = getTimeDifferenceInDays(data);

    let newData: any = [];

    // Calculate daily average by summing all measurements an dividing by the
    // number of values.
    if (timeDifferenceInDays > 14) {
      setDaily(true);
      newData = scaleAverage(data, 'humidity');
    } else {
      newData = data;
    }

    setData(newData);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    scale();
  }, [props.data]);

  return (
    <>
      <h3>{props.title}</h3>
      <LineChart
        data={data}
        options={{
          data: {
            loading: !data || data.length === 0 || loading
          },
          title: "",
          timeScale: {
            showDayName: false,
            addSpaceOnEdges: 0,
            localeObject: enGB
          },
          axes: {
            bottom: {
              title: "Date",
              mapsTo: "timeParsed",
              scaleType: ScaleTypes.TIME,
            },
            left: {
              mapsTo: "humidity",
              title: "Humidity in %",
              scaleType: ScaleTypes.LINEAR,
              includeZero: true,
            }
          },
          legend: {
            alignment: Alignments.CENTER,
            clickable: false,
            enabled: false
          },
          points: {
            radius: 1,
            enabled: true
          },
          color: {
            scale: {'data': '#1e90ff'},
            gradient: {
              enabled: true
            }
          },
          tooltip: {
            showTotal: false,
            groupLabel: '',
            customHTML: (data: [{ humidity: number, time: number, timeParsed: string }], html: string) => {
              const tooltip =
                <ul className='multi-tooltip'>
                  <li>
                    <div className="datapoint-tooltip ">
                      <p className="label">Date</p>
                      <p className="value">
                        {daily ? (
                          <>{moment(data[0].timeParsed).format('D.M.YY')}</>
                        ) : (
                          <>{moment(data[0].timeParsed).format('D.M.YY HH:mm')}</>
                        )}
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="datapoint-tooltip ">
                      <p className="label">%</p>
                      <p className="value">{data[0].humidity}</p>
                    </div>
                  </li>
                </ul>;

              return ReactDOMServer.renderToString(tooltip);
            }
          },
          curve: "curveMonotoneX",
          height: props.height
        }}
      />
    </>
  );
}