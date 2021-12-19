import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Loading, Grid, Row, Column } from 'carbon-components-react';

import { AppHeader } from './components/app-header';
import { Start } from './pages/start';
import { TemperaturePage } from "./pages/temperature";
import { RootState } from "./renderer";

export const App: React.FC = (): React.ReactElement => {
  const loading = useSelector((state: RootState) => state.appState.loading);

  return (
    <main>
      {loading &&
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
              <Switch>
                <Route path="/" exact component={Start} />
                <Route path="/temperature" component={TemperaturePage} />
              </Switch>
            </Column>
          </Row>
        </Grid>
      </section>

    </main>
  );
}