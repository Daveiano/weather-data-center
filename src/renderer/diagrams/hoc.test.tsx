import React from 'react'
import { render } from '@testing-library/react'

import data from "../../../tests/data/scaling-input.json";
import config from "../../../tests/data/config.json";

import TemperatureBase from "./temperature/temperature-base";

test('hoc no render when data is not available', async () => {
  const { container } = render(
    <TemperatureBase
      title="Temperature"
      height="300px"
      data={data.map(item => ({
        id: item.id,
        _id: item._id,
        timeParsed: item.timeParsed,
        time: item.time,
        rain: item.rain
      }))}
      property="temperature"
      config={config}
    />
  );

  expect(container).toMatchSnapshot();
});