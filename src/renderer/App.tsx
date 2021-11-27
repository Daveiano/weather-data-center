import * as React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import { Loading, Grid, Row, Column } from 'carbon-components-react';

import AppHeader from './components/app-header';
import Start from './pages/Start';

const mapStateToProps = (state: any) => ({ appState: state.appState });

type Props = {
  appState: any,
  dispatch: (action: any) => void
};

class App extends React.Component<Props> {
  props: Props;

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
                  <HashRouter>
                    <Switch>
                      <Route path="/" component={Start} />
                    </Switch>
                  </HashRouter>
              </Column>
            </Row>
          </Grid>
        </section>

      </main>
    );
  }
}

export default connect(mapStateToProps)(App);