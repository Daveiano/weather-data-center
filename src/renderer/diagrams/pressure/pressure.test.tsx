import React from "react";
import { render, screen } from "@testing-library/react";

import data from "../../../../tests/data/scaling-input.json";
import config from "../../../../tests/data/config.json";

import PressureBase from "./pressure-base";

test("pressure diagram with 11-day data", async () => {
  const { container } = render(
    <PressureBase
      title="Pressure"
      height="300px"
      data={data}
      property="pressure"
      config={config}
    />
  );

  expect(screen.getByTestId("pressure-diagram")).toHaveTextContent("Pressure");

  expect(container).toMatchSnapshot();
});
