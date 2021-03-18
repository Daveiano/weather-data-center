import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import { Loading, Grid, Row, Column } from 'carbon-components-react';

import AppHeader from './components/app-header';
import Start from './pages/Start';

const mapStateToProps = (state: any) =>  state;

class App extends React.Component<{ appState?: any }> {
  render () {
    return (
      <main>
        {this.props.appState.loading &&
        <Loading
          description="Active loading indicator"
          withOverlay={true}
        />
        }

        <AppHeader />

        <section className="main bx--content">
          <Grid fullWidth>
            <Row>
              <Column>
                  <BrowserRouter>
                    <Switch>
                      <Route exact path="/main_window" component={Start} />
                    </Switch>
                  </BrowserRouter>
              </Column>
            </Row>
          </Grid>
        </section>

      </main>
    );
  }
}

export default connect(mapStateToProps)(App);