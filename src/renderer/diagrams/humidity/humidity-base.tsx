import React, { FunctionComponent, useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';

import { enGB } from 'date-fns/locale'
import moment from 'moment';

import {LineChart} from "@carbon/charts-react";
import {Alignments, ScaleTypes} from "@carbon/charts/interfaces";

import { DiagramBaseProps } from "../types";

export const HumidityBase:FunctionComponent<DiagramBaseProps> = (props: DiagramBaseProps): React.ReactElement => {
  const [data, setData] = useState(props.data);

  const scale = () => {
    const firstDate = moment.unix(data[0].time),
      lastDate = moment.unix(data[data.length - 1].time),
      timeDifferenceInDays = lastDate.diff(firstDate, 'days');

      console.log('timeDifferenceInDays', timeDifferenceInDays);

      let newData: any = [];

      if (timeDifferenceInDays > 7 && timeDifferenceInDays <= 30) {
        for (let key = 0; key < data.length; key++) {
          if (key % 2 === 0) {
            newData = [...newData, data[key]];
          }
        }
        setData(newData);
      }

      if (timeDifferenceInDays > 30) {
        for (let key = 0; key < data.length; key++) {
          if (key % 20 === 0) {
            newData = [...newData, data[key]];
          }
        }
        setData(newData);
      }
  };

  useEffect(() => {
    scale();
  }, [props.data]);

  return (
    <>
      <h3>{props.title}</h3>
      <LineChart
        data={data}
        options={{
          data: {
            loading: !data || data.length === 0
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
                      <p
                        className="value">{moment(data[0].timeParsed).format('D.M.YY HH:mm')}</p>
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