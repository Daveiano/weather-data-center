import React from "react";

import { PointTooltip } from "@nivo/line";

// @todo Build nice tooltip with styled-components.
export const Tooltip:PointTooltip = (point): React.ReactElement  => {
  return (
    <div style={{ padding: '7px', background: 'white', boxShadow: "4px 4px 15px 0px #000000" }}>
      <div>{point.point.data.xFormatted}</div>
      <div>{point.point.data.yFormatted}</div>
    </div>
  );
};