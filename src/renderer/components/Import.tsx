import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Button } from 'carbon-components-react';

import { isLoadingAction } from '../actions-app';

type Props = {
  dispatch: (action: any) => void,
  state: any
};

const mapStateToProps = (state: any) => ({ state });

class Import extends Component<Props> {
  props: Props;

  selectFile = (): void => {
    this.props.dispatch(isLoadingAction(true));
    window.electron.IpcSend('open-file-dialog', []);
  };

  // TODO: Display notification: xx records imported.
  uploadFileListener = (event: any, arg: any): void => {
    console.log(event);
    console.log(arg);
  }

  // TODO: Do we need this here? How to managed data in general?
  componentDidMount() {
    window.electron.IpcOn('loaded-raw-csv-data', this.uploadFileListener);
  }

  render() {
    return (
      <div>
        <Button kind='primary' onClick={() => this.selectFile()}>
          Import Data from CSV
        </Button>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Import);