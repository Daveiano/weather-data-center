import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Row, Column } from 'carbon-components-react';

import TemperatureOverview from "../diagrams/temperature/temperature-overview";

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
            <Column sm={4} md={4} lg={4}>
              <TemperatureOverview />
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