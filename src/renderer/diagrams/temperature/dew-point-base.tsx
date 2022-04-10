import React, { FunctionComponent, useEffect, useMemo, useState } from "react";

import { Loading } from "carbon-components-react";
import { ResponsiveLine } from "@nivo/line";
import { DewPoint32 } from "@carbon/icons-react";

import { dataItem, DiagramBaseProps } from "../types";
import { getTimeDifferenceInDays, scaleAverage } from "../scaling";
import { TooltipLine } from "../tooltip";
import { getTemperatureLineBaseProps } from "./temperature-base";
import { withEmptyCheck } from "../hoc";

const DewPointBase: FunctionComponent<DiagramBaseProps> = (
  props: DiagramBaseProps
): React.ReactElement => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [daily, setDaily] = useState(false);

  const scaleData = useMemo(
    () => scaleAverage(props.data, "dew_point", "day"),
    [props.data]
  );
  const timeDifferenceInDays = useMemo(
    () => getTimeDifferenceInDays(props.data),
    [props.data]
  );

  const scale = () => {
    let newData: dataItem[];

    if (timeDifferenceInDays > 14) {
      setDaily(true);
      newData = scaleData;
    } else {
      setDaily(false);
      newData = props.data;
    }

    setData(newData);
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
    <div data-testid="dew-point-diagram">
      <h3>
        <DewPoint32 />
        {props.title}
      </h3>

      <div style={{ height: props.height }} className="diagram">
        <ResponsiveLine
          {...getTemperatureLineBaseProps(
            daily ? "daily" : "",
            data,
            "dew_point",
            false,
            props.config.unit_temperature
          )}
          data={[
            {
              id: "dew_point",
              data: data.map((item) => ({
                x: item.timeParsed,
                y: item.dew_point,
              })),
            },
          ]}
          colors={["#5F9EA0"]}
          tooltip={(point) => <TooltipLine point={point.point} />}
        />
      </div>
    </div>
  );
};

export default withEmptyCheck(DewPointBase);
