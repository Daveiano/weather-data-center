import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'

import data from "../../../../tests/data/scaling-input.json";

import { TemperatureBase } from './temperature-base';

test('temperature diagram with 11-day data', async () => {
  const { container } = render(<TemperatureBase title="Temperature" height="300px" data={data} />);

  expect(screen.getByTestId('temperature-diagram')).toHaveTextContent("Temperature");

  // Remove random generated classNames by carbon-charts.
  // @todo This probably belongs into general testing-library thing.
  const layoutChildren = container.querySelectorAll('.layout-child');
  for (let i = 0; i < layoutChildren.length; i++) {
    layoutChildren[i].classList.remove(...layoutChildren[i].className.match(/layout-child-[0-9]+/gi));
  }
  const btnMenu = container.querySelectorAll('button[id$="-control-toolbar-overflow-menu"]');
  for (let i = 0; i < btnMenu.length; i++) {
    btnMenu[i].removeAttribute('id');
  }
  const btnShow = container.querySelectorAll('button[id$="-control-toolbar-showasdatatable"]');
  for (let i = 0; i < btnShow.length; i++) {
    btnShow[i].removeAttribute('id');
  }

  expect(container).toMatchSnapshot();
});