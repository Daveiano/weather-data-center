import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {Column, Row, Tile} from "carbon-components-react";
import {RootState} from "../renderer";
import {Empty} from "../components/empty";
import {Stats} from "../components/stats/stats";
import PressureBase from "../diagrams/pressure/pressure-base";
import TableBase from "../components/table-base/table-base";
import {dataItem} from "../diagrams/types";
import {TABLE_SORT_DIRECTION} from "../components/table-base/misc";

export const PressurePage: React.FC = (): React.ReactElement => {
  const dataFilteredFromStore = useSelector((state: RootState) => state.appState.dataFilteredPerTime);
  const loading = useSelector((state: RootState) => state.appState.loading);
  const config = useSelector((state: RootState) => state.appState.config);

  const [data, setData] = useState(dataFilteredFromStore);

  useEffect(() => {
    setData(dataFilteredFromStore);
  }, [dataFilteredFromStore]);

  if (loading) {
    return null;
  }

  if (data.length > 0) {
    return (
      <div className="page">
        <Row>
          <Column>
            <h1>Pressure</h1>

            <Row className="tiles">
              <Column sm={12} lg={12} max={12}>
                <Row>
                  <Column sm={4} lg={4} max={3}>
                    <Tile>
                      <h3 className="p-left m-bottom">Minimum / Maximum values</h3>

                      <Stats
                        data={data}
                        columnSpanLg={12}
                        columnSpan={12}
                        size="compact"
                        stats={[
                          {
                            property: 'pressure',
                            direction: 'max',
                            label: 'Maximum',
                            unit: config.unit_pressure
                          },
                          {
                            property: 'pressure',
                            direction: 'min',
                            label: 'Minimum',
                            unit: config.unit_pressure
                          },
                          {
                            property: 'pressure',
                            direction: 'extra',
                            extra: 'min-max-diff-down',
                            label: 'Biggest fall per day',
                            unit: config.unit_pressure
                          },
                          {
                            property: 'pressure',
                            direction: 'extra',
                            extra: 'min-max-diff-up',
                            label: 'Biggest rise per day',
                            unit: config.unit_pressure
                          }
                        ]}
                      />
                    </Tile>
                  </Column>
                  <Column sm={8} lg={8} max={9} className="table-tile">
                    <TableBase
                      start={0}
                      pageSize={15}
                      rows={data.map((item: dataItem) => ({
                        ...item,
                        selected: false
                      }))}
                      columns={[
                        {
                          title: 'Time',
                          id: 'timeParsed',
                          tooltip: 'Date format is YYYY/MM/DD HH:mm',
                          sortCycle: 'tri-states-from-ascending',
                        },
                        {
                          title: 'Pressure',
                          small: `in ${config.unit_pressure}`,
                          id: 'pressure',
                          sortCycle: 'tri-states-from-ascending',
                        },
                        {
                          title: 'Wind',
                          small: `in ${config.unit_wind}`,
                          id: 'wind',
                          sortCycle: 'tri-states-from-ascending',
                        },
                        {
                          title: 'Temperature',
                          small: `in ${config.unit_temperature}`,
                          id: 'temperature',
                          sortCycle: 'tri-states-from-ascending',
                        },
                      ]}
                      title="All data"
                      hasSelection={false}
                      sortInfo={{
                        columnId: 'timeParsed',
                        direction: TABLE_SORT_DIRECTION.ASC,
                      }}
                      size="short"
                    />
                  </Column>
                </Row>
              </Column>

              <PressureBase height="600px" data={data} title="Pressure (Ø per day)" property="pressure" sm={12} lg={12} max={12} config={config} />
            </Row>
          </Column>
        </Row>
      </div>
    );
  }

  return (
    <Empty />
  );
}