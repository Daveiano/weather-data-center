import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from "moment";

import { Row, Column, Tile } from 'carbon-components-react';

import { TemperatureBase } from '../diagrams/temperature/temperature-base';
import { HumidityBase } from "../diagrams/humidity/humidity-base";
import { PressureBase } from "../diagrams/pressure/pressure-base";
import { dataAction } from "../actions-app";

type Props = {
  appState: any,
  dispatch: (action: any) => void
};

const mapStateToProps = (state: any) => ({ appState: state.appState });

class Start extends Component<Props> {
  props: Props;

  state = {
    data: [] as any[]
  }

  filterDataPerTime = (): void => {
    const startDate = moment(this.props.appState.dateSetByUser.start, 'DD-MM-YYYY').unix();
    const endDate = moment(this.props.appState.dateSetByUser.end, 'DD-MM-YYYY').unix();

    const filteredData = this.props.appState.data.filter((dataItem: any) => dataItem.Zeit >= startDate && dataItem.Zeit <= endDate);

    this.setState({ data: filteredData });
  };

  getData = (event: any, arg: any[]): void => {
    this.setState({ data: arg });
    this.props.dispatch(dataAction(arg));
  };

  componentDidMount() {
    if (!this.state.data.length) {
      window.electron.IpcSend('query-data', []);
      window.electron.IpcOn('query-data', this.getData);
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any) {
    if (JSON.stringify(prevProps.appState.dateSetByUser) !== JSON.stringify(this.props.appState.dateSetByUser)) {
      this.filterDataPerTime();
    }
  }

  render() {
    if (this.props.appState.hasData) {
      return (
        <div className="start-overview">
          <Row>
            <Column>
              <h2 id="overview">Overview</h2>
            </Column>
          </Row>

          <Row className="start-tiles">
            <Column sm={4} md={4} lg={6} xlg={4}>
              <Tile>
                <TemperatureBase data={this.state.data} title="Temperature" height="300px" />
              </Tile>
            </Column>
            <Column sm={4} md={4} lg={6} xlg={4}>
              <Tile>
                <HumidityBase data={this.state.data} title="Humidity" height="300px" />
              </Tile>
            </Column>
            <Column sm={4} md={8} lg={6} xlg={4}>
              <Tile>
                <PressureBase data={this.state.data} title="Pressure" height="300px" />
              </Tile>
            </Column>
            <Column sm={4} md={8} lg={6} xlg={4}>
              <Tile>
                Rain
              </Tile>
            </Column>
            <Column sm={4} md={8} lg={6} xlg={4}>
              <Tile>
                Wind
              </Tile>
            </Column>
            <Column sm={4} md={8} lg={6} xlg={4}>
              <Tile>
                Wind direction
              </Tile>
            </Column>
          </Row>
          <Row className="start-tables">
            <Column>
              <Tile>
                Overview Table
              </Tile>
            </Column>
          </Row>
        </div>
      );
    }

    return (
      <div>
        <h2>Please import some data. <br/> This can be done via the icon on the top right.</h2>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Start);