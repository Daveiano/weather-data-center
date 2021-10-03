import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Button } from 'carbon-components-react';

import { isLoadingAction } from '../actions-app';

type Props = {
  dispatch: (action: any) => void,
  state: any
};

type State = {
  numberOfDuplicated: number
};

const mapStateToProps = (state: any) => ({ state });

class Import extends Component<Props> {
  props: Props;

  state: State = {
    numberOfDuplicated: 0
  }

  selectFile = (): void => {
    this.props.dispatch(isLoadingAction(true));
    window.electron.IpcSend('open-file-dialog', []);
  };

  // @todo: Display notification: xx records imported.
  uploadFileListener = (event: any, arg: any): void => {
    console.log(arg);
    this.setState({ numberOfDuplicated: arg });
  }

  // TODO: Do we need this here? How to managed data in general?
  componentDidMount() {
    window.electron.IpcOn('number-of-duplicates', this.uploadFileListener);
  }

  render() {
    return (
      <div className="import-action">
        <Button kind='primary' onClick={() => this.selectFile()}>
          Import Data from CSV
        </Button>
        {this.state.numberOfDuplicated > 0 &&
        <>Deduplicated {this.state.numberOfDuplicated} items.</>
        }
      </div>
    );
  }
}

export default connect(mapStateToProps)(Import);