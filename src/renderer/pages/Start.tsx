import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Row, Column, Tile } from 'carbon-components-react';

import TemperatureBase from "../diagrams/temperature/temperature-base";

type Props = {
  state: any
};

const mapStateToProps = (state: any) => ({ state });

class Start extends Component<Props> {
  props: Props;

  render() {
    if (this.props.state.appState.hasData) {
      return (
        <div className="start-view">
          <Row className="start-tiles">
            <Column sm={4} md={4} lg={6} xlg={4}>
              <Tile>
                <TemperatureBase title="Temperature" height="300px" />
              </Tile>
            </Column>
            <Column sm={4} md={4} lg={6} xlg={4}>
              <Tile>
                Humidity
              </Tile>
            </Column>
            <Column sm={4} md={8} lg={6} xlg={4}>
              <Tile>
                Pressure
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