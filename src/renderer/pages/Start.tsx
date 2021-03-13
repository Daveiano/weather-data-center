import React, { Component } from 'react';
import { connect } from 'react-redux';

import { isLoadingAction } from '../actions-app';

type Props = {
  dispatch: (action: any) => void,
  state: any
};

const mapStateToProps = (state: any) => ({ state });

class Start extends Component<Props> {
  props: Props;

  selectFile = (): void => {
    this.props.dispatch(isLoadingAction(true));
    window.electron.IpcSend('open-file-dialog', []);
  };

  uploadFileListener = (event: any, arg: any): void => {
    console.log(event);
    console.log(arg);
  }

  componentDidMount() {
    window.electron.IpcOn('loaded-raw-csv-data', this.uploadFileListener);
  }

  render() {
    console.log(this.props);
    return (
      <div>
        <h1>Weather Data Center</h1>
        <button type="button" onClick={() => this.selectFile()}>Import Data from CSV</button>
        {this.props.state.appState.hasData &&
          <h2>We can render Data!</h2>
        }
      </div>
    );
  }
}

export default connect(mapStateToProps)(Start);