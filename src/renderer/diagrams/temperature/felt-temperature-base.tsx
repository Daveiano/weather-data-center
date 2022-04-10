import React, { FunctionComponent, useEffect, useState } from "react";

import { Loading } from "carbon-components-react";
import { ResponsiveLine } from "@nivo/line";
import { TemperatureFeelsLike32 } from "@carbon/icons-react";

import { dataItem, DiagramBaseProps } from "../types";
import { getTimeDifferenceInDays, scaleMin, scaleMax } from "../scaling";
import { getTemperatureLineBaseProps } from "./temperature-base";
import { withEmptyCheck } from "../hoc";

const FeltTemperatureBase: FunctionComponent<DiagramBaseProps> = (
  props: DiagramBaseProps
): React.ReactElement => {
  const [dataMin, setDataMin] = useState([]);
  const [dataMax, setDataMax] = useState([]);
  const [loading, setLoading] = useState(true);
  const [daily, setDaily] = useState(false);

  const scale = () => {
    const timeDifferenceInDays = getTimeDifferenceInDays(props.data);

    let newDataMin: dataItem[], newDataMax: dataItem[];

    if (timeDifferenceInDays > 14) {
      setDaily(true);
      newDataMin = scaleMin(props.data, "felt_temperature", "day");
      newDataMax = scaleMax(props.data, "felt_temperature", "day");
    } else {
      setDaily(false);
      newDataMin = props.data;
      newDataMax = props.data;
    }

    setDataMin(newDataMin);
    setDataMax(newDataMax);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    scale();
  }, [props.data]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loading description="Active loading indicator" withOverlay={false} />
      </div>
    );
  }

  return (
    <div data-testid="felt-temperature-diagram">
      <h3>
        <TemperatureFeelsLike32 />
        {props.title}
      </h3>

      <div style={{ height: props.height }} className="diagram">
        <ResponsiveLine
          {...getTemperatureLineBaseProps(
            daily ? "daily" : "",
            [...dataMin, ...dataMax],
            "felt_temperature",
            true,
            props.config.unit_temperature
          )}
          data={[
            {
              id: "Min",
              data: dataMin.map((item) => ({
                x: item.timeParsed,
                y: item.felt_temperature,
              })),
            },
            {
              id: "Max",
              data: dataMax.map((item) => ({
                x: item.timeParsed,
                y: item.felt_temperature,
              })),
            },
          ]}
          colors={["#67C8FF", "#C41E3A"]}
          legends={[
            {
              anchor: "top-right",
              direction: "row",
              itemWidth: 50,
              itemHeight: 20,
              itemsSpacing: 10,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default withEmptyCheck(FeltTemperatureBase);
