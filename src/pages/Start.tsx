import React, { Component } from 'react';
import { hot } from 'react-hot-loader';

type Props = {};

class Start extends Component<Props> {
  props: Props;

  selectFile = (): void => {
    window.electron.openFileDialog();
  };

  render() {
    return (
      <div>
        <h1>Weather Data Center</h1>
        <button type="button" onClick={() => this.selectFile()}>Import Data from CSV</button>
      </div>
    );
  }
}

export default hot(module)(Start);