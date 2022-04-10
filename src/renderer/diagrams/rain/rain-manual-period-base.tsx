import React, { FunctionComponent, useEffect, useState } from "react";

import {
  Column,
  ContentSwitcher,
  Loading,
  Row,
  Switch,
} from "carbon-components-react";
import { Rain32 } from "@carbon/icons-react";
import { ResponsiveBar } from "@nivo/bar";

import { dataItem, DiagramBaseProps } from "../types";
import { Precision, scaleMax, scaleSum } from "../scaling";
import { TABLE_SORT_DIRECTION } from "../../components/table-base/misc";
import TableBase from "../../components/table-base/table-base";
import { getRainBarBaseProps } from "./rain-base";
import { withEmptyCheck } from "../hoc";

const RainManualPeriodBase: FunctionComponent<DiagramBaseProps> = (
  props: DiagramBaseProps
): React.ReactElement => {
  const [data, setData] = useState(scaleMax(props.data, "rain", "day"));
  const [loading, setLoading] = useState(true);
  const [precision, setPrecision] = useState<Precision>("week");

  const scale = () => {
    switch (precision) {
      case "day":
        setData(scaleMax(props.data, "rain", "day"));
        break;
      case "week":
        setData(scaleSum(props.data, "rain", "week"));
        break;
      case "month":
        setData(scaleSum(props.data, "rain", "month"));
        break;
      case "year":
        setData(scaleSum(props.data, "rain", "year"));
        break;
    }

    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    scale();
  }, [props.data, precision]);

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
    <div data-testid="rain-manual-period-diagram">
      {props.title && (
        <h3>
          <Rain32 />
          {props.title}
        </h3>
      )}

      <Row>
        <Column sm={6} lg={6} max={6}>
          <ContentSwitcher size="md" selectedIndex={1}>
            <Switch text="Daily" onClick={() => setPrecision("day")} />
            <Switch text="Weekly" onClick={() => setPrecision("week")} />
            <Switch text="Monthly" onClick={() => setPrecision("month")} />
            <Switch text="Yearly" onClick={() => setPrecision("year")} />
          </ContentSwitcher>
        </Column>
      </Row>

      <Row className="content">
        <Column sm={12} lg={12} max={4}>
          <TableBase
            start={0}
            pageSize={20}
            pageSizes={[20]}
            rows={data.map((item: dataItem) => ({
              ...item,
              selected: false,
            }))}
            columns={[
              {
                title: "Time",
                id: "timeParsed",
                tooltip: "Date format is YYYY/MM/DD HH:mm",
                sortCycle: "tri-states-from-ascending",
              },
              {
                title: "Rain",
                small: `in ${props.config.unit_rain}`,
                id: "rain",
                sortCycle: "tri-states-from-ascending",
              },
            ]}
            hasSelection={false}
            sortInfo={{
              columnId: "timeParsed",
              direction: TABLE_SORT_DIRECTION.ASC,
            }}
            size="short"
            dateFormat={(() => {
              switch (precision) {
                case "day":
                  return "YYYY/MM/DD";
                case "week":
                  return "\\Www YY";
                case "month":
                  return "YYYY/MM";
                case "year":
                  return "YYYY";
              }
            })()}
          />
        </Column>
        <Column sm={12} lg={12} max={8}>
          <div style={{ height: props.height }} className="diagram">
            <ResponsiveBar
              {...getRainBarBaseProps(
                precision,
                data,
                "rain",
                props.config.unit_rain
              )}
              data={data}
            />
          </div>
        </Column>
      </Row>
    </div>
  );
};

export default withEmptyCheck(RainManualPeriodBase);
