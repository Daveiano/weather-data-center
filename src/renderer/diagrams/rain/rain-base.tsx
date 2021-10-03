import React, { FunctionComponent } from 'react';
import ReactDOMServer from 'react-dom/server';

import { enGB } from 'date-fns/locale'
import moment from 'moment';

import {LineChart} from "@carbon/charts-react";
import {Alignments, ScaleTypes} from "@carbon/charts/interfaces";

import { DiagramBaseProps } from "../types";

export const RainBase:FunctionComponent<DiagramBaseProps> = (props: DiagramBaseProps): React.ReactElement =>
  <>
    <h3>{props.title}</h3>
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
            mapsTo: "pressure",
            title: "Pressure in hPa",
            scaleType: ScaleTypes.LINEAR,
            includeZero: false,
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
          // @todo Color does not work.
          scale: { 'data': '#808080' },
          gradient: {
            enabled: true
          }
        },
        tooltip: {
          showTotal: false,
          groupLabel: '',
          customHTML: (data: [{ pressure: number, time: number, timeParsed: string }], html: string) => {
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
                    <p className="label">hPa</p>
                    <p className="value">{data[0].pressure}</p>
                  </div>
                </li>
              </ul>;

            return ReactDOMServer.renderToString(tooltip);
          }
        },
        height: props.height
      }}
    />
  </>