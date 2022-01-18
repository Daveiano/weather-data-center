import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'

import data from "../../../../tests/data/scaling-input.json";
import config from "../../../../tests/data/config.json";

import RainBase from "./rain-base";
import RainManualPeriodBase from "./rain-manual-period-base";

test('rain diagram with 11-day data', async () => {
  const { container } = render(<RainBase title="Rain" height="300px" data={data} property="rain" config={config} />);

  expect(screen.getByTestId('rain-diagram')).toHaveTextContent("Rain");

  expect(container).toMatchSnapshot();
});

test('rain manual period diagram with 11-day data', async () => {
  const { container } = render(<RainManualPeriodBase title="Rain Manual test" height="300px" data={data} property="rain" config={config} />);

  expect(screen.getByTestId('rain-manual-period-diagram')).toHaveTextContent("Rain Manual test");
  expect(container.querySelector('.bx--data-table-container .bx--pagination .bx--pagination__items-count')).toHaveTextContent('1–3 of 3 items');
  expect(container).toMatchSnapshot();

  fireEvent.click(screen.getByText('Daily'));
  expect(container.querySelector('.bx--data-table-container .bx--pagination .bx--pagination__items-count')).toHaveTextContent('1–11 of 11 items');
  expect(container).toMatchSnapshot();

  fireEvent.click(screen.getByText('Monthly'));
  expect(container.querySelector('.bx--data-table-container .bx--pagination .bx--pagination__items-count')).toHaveTextContent('1–1 of 1 items');
  expect(container).toMatchSnapshot();

  fireEvent.click(screen.getByText('Yearly'));
  expect(container.querySelector('.bx--data-table-container .bx--pagination .bx--pagination__items-count')).toHaveTextContent('1–1 of 1 items');
  expect(container).toMatchSnapshot();
});