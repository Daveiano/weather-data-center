import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import RingLoader from "react-spinners/RingLoader";

import Start from './pages/Start';

const mapStateToProps = (state: any) =>  state;

class App extends React.Component<{ appState?: any }> {
  render () {
    return (
      <>
        {this.props.appState.loading &&
        <div id="loading" className="full">
          <RingLoader size={150} color={"#123abc"} loading={this.props.appState.loading} />
        </div>
        }
        <BrowserRouter>
          <Switch>
            <Route exact path="/main_window" component={Start}/>
          </Switch>
        </BrowserRouter>
      </>
    );
  }
}

export default connect(mapStateToProps)(App);