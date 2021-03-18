import React from 'react';
import {connect} from 'react-redux';
import ReactDOMServer from 'react-dom/server';

import { enGB } from 'date-fns/locale'
import moment from 'moment';

import {LineChart} from "@carbon/charts-react";
import {Alignments, ScaleTypes} from "@carbon/charts/interfaces";

const mapStateToProps = (state: any) =>  state;

class TemperatureBase extends React.Component<{ appState?: any, title: string, height: string }> {
  state = {
    data: [] as any[]
  }

  getData = (event: any, arg: any): void => {
    this.setState({ data: arg });
  };

  componentDidMount() {
    // TODO: Store data in redux and just query if necessary.
    window.electron.IpcSend('query-temperature', []);
    window.electron.IpcOn('query-temperature', this.getData);
  }

  render() {
    return (
      <>
        <h2>{this.props.title}</h2>
        {this.state.data &&
        <LineChart
          data={this.state.data}
          options={{
            title: "",
            timeScale: {
              showDayName: false,
              addSpaceOnEdges: 0,
              localeObject: enGB
            },
            tooltip: {
              showTotal: false,
              groupLabel: '',
              valueFormatter: (arg: string) => {
                return arg;
              },
              customHTML: (data: [{ Temperatur: number, Zeit: number, timeParsed: string }], html: string) => {
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
                        <p className="value">{data[0].Temperatur}</p>
                      </div>
                    </li>
                  </ul>;

                return ReactDOMServer.renderToString(tooltip);
              }
            },
            axes: {
              bottom: {
                title: "Date",
                mapsTo: "timeParsed",
                scaleType: ScaleTypes.TIME,
              },
              left: {
                mapsTo: "Temperatur",
                title: "Temperature in °C",
                scaleType: ScaleTypes.LINEAR,
                includeZero: true,
                // TODO: thresholds not working.
                thresholds: [
                  {
                    value: 0.0,
                    fillColor: '#191970',
                    label: '0°C'
                  }
                ]
              }
            },
            data: {
              groupMapsTo: 'group'
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
              scale: {'Outdoor Temperature': '#8B0000'},
              gradient: {
                enabled: true
              }
            },
            curve: "curveMonotoneX",
            height: this.props.height
          }}
        />
        }
      </>
    );
  }
}

export default connect(mapStateToProps)(TemperatureBase);