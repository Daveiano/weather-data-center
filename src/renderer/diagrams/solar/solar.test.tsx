import React from 'react'
import { render, screen } from '@testing-library/react'

import data from "../../../../tests/data/scaling-input.json";
import config from "../../../../tests/data/config.json";

import SolarBase from "./solar-base";

test('solar diagram with 11-day data', async () => {
  const { container } = render(<SolarBase title="Solar" height="300px" data={data} property="solar" config={config} />);

  expect(screen.getByTestId('solar-diagram')).toHaveTextContent("Solar");

  expect(container).toMatchSnapshot();
});