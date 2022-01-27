import React from 'react'
import { render, screen } from '@testing-library/react'

import {combineReducers, createStore} from "redux";
import {Provider} from "react-redux";

import {StartPage} from "./start";
import {dataAction, dataFilteredPerTimeAction, configAction} from "../actions-app";
import {appReducer, appReducerDefaultState} from "../reducer-app";

import data from "../../../tests/data/data-without-wind-direction-rain.json";
import config from "../../../tests/data/config.json";

const store = createStore(
  combineReducers({
    appState: appReducer
  }),
  {
    appState: appReducerDefaultState
  }
);

store.dispatch(dataAction(data));
store.dispatch(dataFilteredPerTimeAction(data));
store.dispatch(configAction(config));

test('rendering start page without rain and wind direction', () => {
  const { container } = render(
    <Provider store={store}>
      <StartPage />
    </Provider>
  );

  expect(screen.getByTestId('temperature-diagram')).toBeInTheDocument();
  expect(screen.getByTestId('pressure-diagram')).toBeInTheDocument();
  expect(screen.getByTestId('humidity-diagram')).toBeInTheDocument();
  expect(screen.getByTestId('wind-diagram')).toBeInTheDocument();
  expect(screen.getByTestId('felt-temperature-diagram')).toBeInTheDocument();
  expect(screen.getByTestId('solar-diagram')).toBeInTheDocument();
  expect(screen.getByTestId('uvi-diagram')).toBeInTheDocument();
  expect(screen.getByTestId('dew-point-diagram')).toBeInTheDocument();

  expect(screen.queryByTestId('rain-diagram')).not.toBeInTheDocument();
  expect(screen.queryByTestId('wind-direction-diagram')).not.toBeInTheDocument();

  expect(container).toMatchSnapshot();
});