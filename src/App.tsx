import * as React from 'react';
import { Redirect, BrowserRouter, Route, Switch } from 'react-router-dom';
import { hot } from 'react-hot-loader';

import Start from './pages/Start';

declare global {
  interface Window { Bridge: any; }
}

window.Bridge = window.Bridge || {};

const App = () =>
    <BrowserRouter>
      <Switch>
        <Route exact path="/main_window" component={Start} />
      </Switch>
    </BrowserRouter>;

export default hot(module)(App);