import React from 'react'
import { render, screen } from '@testing-library/react'

import data from "../../../../tests/data/scaling-input.json";

import UviBase from "./uvi-base";

test('uvi diagram with 11-day data', async () => {
  const { container } = render(<UviBase title="UVI" height="300px" data={data} property="uvi" />);

  expect(screen.getByTestId('uvi-diagram')).toHaveTextContent("UVI");

  expect(container).toMatchSnapshot();
});