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

  filterDataPerTime = (data: any[]): any[] => {
    return [];
  };

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
        {this.state.data.length &&
        <LineChart
          data={this.state.data}
          options={{
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
                mapsTo: "Temperatur",
                title: "Temperature in °C",
                scaleType: ScaleTypes.LINEAR,
                includeZero: true,
                // @todo: thresholds not working,
                //   It can not resolve the y values. Sandbox works
                //   https://codesandbox.io/s/happy-forest-2ybme?file=/src/index.tsx
                thresholds: [
                  {
                    value: 1,
                    fillColor: 'blue',
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