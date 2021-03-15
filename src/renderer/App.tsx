import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import RingLoader from "react-spinners/RingLoader";

import Import from './components/Import';
import Start from './pages/Start';

const mapStateToProps = (state: any) =>  state;

class App extends React.Component<{ appState?: any }> {
  render () {
    return (
      <main>
        {this.props.appState.loading &&
        <div id="loading" className="full">
          <RingLoader size={150} color={"#123abc"} loading={this.props.appState.loading} />
        </div>
        }

        <div>
          {this.props.appState.hasData &&
          <div>
            {this.props.appState.numberOfDocuments} records in DB
          </div>
          }

          <div>
            <Import />
          </div>
        </div>

        <section>
          <BrowserRouter>
            <Switch>
              <Route exact path="/main_window" component={Start} />
            </Switch>
          </BrowserRouter>
        </section>
      </main>
    );
  }
}

export default connect(mapStateToProps)(App);