import React, { FunctionComponent } from 'react';
import ReactDOMServer from 'react-dom/server';

import { enGB } from 'date-fns/locale'
import moment from 'moment';

import {LineChart} from "@carbon/charts-react";
import {Alignments, ScaleTypes} from "@carbon/charts/interfaces";

import { DiagramBaseProps } from "../types";

export const TemperatureBase:FunctionComponent<DiagramBaseProps> = (props: DiagramBaseProps): React.ReactElement =>
  <>
    <h3>{props.title}</h3>
    {props.data && props.data.length > 0 &&
    <LineChart
      data={props.data}
      options={{
        data: {
          loading: !props.data || props.data.length === 0
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
            mapsTo: "temperature",
            title: "Temperature in °C",
            scaleType: ScaleTypes.LINEAR,
            includeZero: true,
            thresholds: [
              {
                value: 0,
                fillColor: '#191970',
                label: '0°C'
              }
            ]
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
          scale: { 'data': '#8B0000' }
        },
        tooltip: {
          showTotal: false,
          groupLabel: '',
          customHTML: (data: [{ temperature: number, time: number, timeParsed: string }], html: string) => {
            const tooltip =
              <ul className='multi-tooltip'>
                <li>
                  <div className="datapoint-tooltip ">
                    <p className="label">Date</p>
                    <p className="value">{moment(data[0].timeParsed).format('D.M.YY HH:mm')}</p>
                  </div>
                </li>
                <li>
                  <div className="datapoint-tooltip ">
                    <p className="label">°C</p>
                    <p className="value">{data[0].temperature}</p>
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
    }
  </>