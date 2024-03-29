import React from "react";
import { render, screen } from "@testing-library/react";

import data from "../../../../tests/data/scaling-input.json";
import config from "../../../../tests/data/config.json";

import HumidityBase from "./humidity-base";

test("humidity diagram with 11-day data", async () => {
  const { container } = render(
    <HumidityBase
      title="Humidity"
      height="300px"
      data={data}
      property="humidity"
      config={config}
    />
  );

  expect(screen.getByTestId("humidity-diagram")).toHaveTextContent("Humidity");

  expect(container).toMatchSnapshot();
});
