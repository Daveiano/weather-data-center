import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';

import { Loading, Grid, Row, Column } from 'carbon-components-react';
import moment from "moment";

import { AppHeader } from './components/app-header';
import { StartPage } from './pages/start';
import { TemperaturePage } from "./pages/temperature";
import {PrecipitationPage} from "./pages/precipitation";
import {PressurePage} from "./pages/pressure";
import {WindPage} from "./pages/wind";
import {SolarPage} from "./pages/solar";
import {DataBasePage} from "./pages/database";
import { RootState } from "./renderer";
import { dataItem } from "./diagrams/types";
import { dataAction, dataFilteredPerTimeAction, isLoadingAction } from "./actions-app";

export const App: React.FC = (): React.ReactElement => {
  const loading = useSelector((state: RootState) => state.appState.loading);

  const dataFromStore = useSelector((state: RootState) => state.appState.data);
  const dateSetByUser = useSelector((state: RootState) => state.appState.dateSetByUser);

  const dispatch = useDispatch();

  const getData = (arg: [dataItem[]]): void => {
    if (arg[0].length) {
      dispatch(dataAction(arg[0]));
    }
    dispatch(isLoadingAction(false));
  };

  // Get data from electron.
  useEffect(() => {
    dispatch(isLoadingAction(true));
    const removeEventListener = window.electron.IpcOn('query-data', (event, arg) => getData(arg));

    if (!dataFromStore.length) {
      window.electron.IpcSend('query-data', null);
    } else {
      dispatch(isLoadingAction(false));
    }

    return () => {
      removeEventListener();
    };
  }, []);

  const filterDataPerTime = (): void => {
    const startDate = moment(dateSetByUser.start, 'DD-MM-YYYY').set({ hour: 0, minute: 0, second: 0 }).unix();
    const endDate = moment(dateSetByUser.end, 'DD-MM-YYYY').set({ hour: 23, minute: 59, second: 59 }).unix();

    const filteredData = dataFromStore.filter((dataItem: dataItem) => dataItem.time >= startDate && dataItem.time <= endDate);

    dispatch(dataFilteredPerTimeAction(filteredData));
    dispatch(isLoadingAction(false));
  };

  // Filter data when user changes dates.
  useEffect(() => {
    if (dataFromStore.length) {
      dispatch(isLoadingAction(true));
      filterDataPerTime();
    }
  }, [dateSetByUser]);

  return (
    <main>
      {loading &&
        <Loading
          data-testid="main-loading"
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
                <Route path="/" exact component={StartPage} />
                <Route path="/temperature" component={TemperaturePage} />
                <Route path="/precipitation" component={PrecipitationPage} />
                <Route path="/pressure" component={PressurePage} />
                <Route path="/wind" component={WindPage} />
                <Route path="/solar" component={SolarPage} />
                <Route path="/database" component={DataBasePage} />
              </Switch>
            </Column>
          </Row>
        </Grid>
      </section>

    </main>
  );
}