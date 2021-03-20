import React from 'react';
import {connect} from 'react-redux';
import ReactDOMServer from 'react-dom/server';

import { enGB } from 'date-fns/locale'
import moment from 'moment';

import {LineChart} from "@carbon/charts-react";
import {Alignments, ScaleTypes} from "@carbon/charts/interfaces";

import { dataTemperatureAction } from "../../actions-app";

const mapStateToProps = (state: any) =>  state;

class TemperatureBase extends React.Component<{ appState?: any, dispatch?: (arg0: any) => void, title: string, height: string }> {
  state = {
    data: [] as any[]
  }

  getData = (event: any, arg: any[]): void => {
    this.props.dispatch(dataTemperatureAction(arg));
    // TODO: Filter per time props.
    this.setState({ data: arg });
  };

  componentDidMount() {
    if (this.props.appState.dataTemperature.length) {
      // TODO: Filter per time props.
      this.setState({ data: this.props.appState.dataTemperature });
    } else {
      window.electron.IpcSend('query-temperature', []);
      window.electron.IpcOn('query-temperature', this.getData);
    }
  }

  // TODO: Filter items if time changed.
  componentDidUpdate(prevProps: Readonly<{ appState?: any; dispatch?: (arg0: any) => void; title: string; height: string }>, prevState: Readonly<{}>, snapshot?: any) {
  }

  render() {
    return (
      <>
        <h3>{this.props.title}</h3>
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
              scale: {'Temperature': '#8B0000'},
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