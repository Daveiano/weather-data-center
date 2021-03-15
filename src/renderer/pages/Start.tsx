import React, { Component } from 'react';
import { connect } from 'react-redux';

type Props = {
  state: any
};

const mapStateToProps = (state: any) => ({ state });

class Start extends Component<Props> {
  props: Props;

  render() {
    return (
      <div>
        {this.props.state.appState.hasData &&
          <h2>We can render Data!</h2>
        }
      </div>
    );
  }
}

export default connect(mapStateToProps)(Start);