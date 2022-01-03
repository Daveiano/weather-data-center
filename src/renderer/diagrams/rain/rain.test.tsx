import React from 'react'
import { render, screen } from '@testing-library/react'

import data from "../../../../tests/data/scaling-input.json";

import { RainBase } from "./rain-base";
import { RainManualPeriodBase } from "./rain-manual-period-base";

test('rain diagram with 11-day data', async () => {
  const { container } = render(<RainBase title="Rain" height="300px" data={data} />);

  expect(screen.getByTestId('rain-diagram')).toHaveTextContent("Rain");

  expect(container).toMatchSnapshot();
});

test('rain manual period diagram with 11-day data', async () => {
  const { container } = render(<RainManualPeriodBase title="Rain Manual test" height="300px" data={data} />);

  expect(screen.getByTestId('rain-manual-period-diagram')).toHaveTextContent("Rain Manual test");

  expect(container).toMatchSnapshot();
});