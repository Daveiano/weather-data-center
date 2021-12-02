import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'

import data from "../../../../tests/data/scaling-input.json";

import { TemperatureBase } from './temperature-base';

test('temperature diagram with 11-day data', async () => {
  render(<TemperatureBase title="Temperature" height="300px" data={data} />);

  expect(screen.getByTestId('temperature-diagram')).toHaveTextContent("Temperature");
});