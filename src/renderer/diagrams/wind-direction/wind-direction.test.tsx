import React from 'react'
import { render, screen } from '@testing-library/react'

import data from "../../../../tests/data/scaling-input.json";
import config from "../../../../tests/data/config.json";

import WindDirectionBase from "./wind-direction-base";

test('wind direction diagram with 11-day data', async () => {
  const { container } = render(<WindDirectionBase title="Wind direction" height="300px" data={data} property="wind_direction" config={config} />);

  expect(screen.getByTestId('wind-direction-diagram')).toHaveTextContent("Wind direction");
  expect(container).toMatchSnapshot();
});