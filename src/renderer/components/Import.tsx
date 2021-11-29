import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Button, InlineNotification } from 'carbon-components-react';

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
    window.electron.IpcSend('open-file-dialog', null);
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
        {this.state.numberOfDuplicated > 0 &&
        <InlineNotification
          kind={"error"}
          iconDescription="Close"
          subtitle={`${this.state.numberOfDuplicated} items were duplicate and are not imported.`}
          title="There were duplicate items!"
        />
        }

        <Button id="import" kind='primary' onClick={() => this.selectFile()}>
          Import Data from CSV
        </Button>

      </div>
    );
  }
}

export default connect(mapStateToProps)(Import);