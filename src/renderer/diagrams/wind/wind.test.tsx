import React from 'react'
import { render, screen } from '@testing-library/react'

import data from "../../../../tests/data/scaling-input.json";

import { WindBase } from "./wind-base";

test('wind diagram with 11-day data', async () => {
  const { container } = render(<WindBase title="Wind & Gust" height="300px" data={data} />);

  expect(screen.getByTestId('wind-diagram')).toHaveTextContent("Wind & Gust");

  expect(container).toMatchSnapshot();
});