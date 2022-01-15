import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {Column, Row, Tile} from "carbon-components-react";
import {RootState} from "../renderer";
import {Empty} from "../components/empty";
import {Stats} from "../components/stats/stats";
import WindBase from "../diagrams/wind/wind-base";
import WindDirectionBase from "../diagrams/wind-direction/wind-direction-base";
import TableBase from "../components/table-base/table-base";
import {dataItem} from "../diagrams/types";
import {TABLE_SORT_DIRECTION} from "../components/table-base/misc";

export const WindPage: React.FC = (): React.ReactElement => {
  const dataFilteredFromStore = useSelector((state: RootState) => state.appState.dataFilteredPerTime);
  const loading = useSelector((state: RootState) => state.appState.loading);

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
            <h1>Wind</h1>

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
                            property: 'gust',
                            direction: 'max',
                            label: 'Maximum Gust',
                            unit: 'km/h'
                          },
                          {
                            property: 'gust',
                            direction: 'day',
                            extra: 'storm-days',
                            label: 'Storm days',
                            description: 'W ≥ 8 Beaufort',
                          },
                          {
                            property: 'wind',
                            direction: 'max',
                            scaling: 'average',
                            precision: 'day',
                            label: 'Windiest day',
                            tooltip: 'Highest Ø from all data',
                            unit: 'km/h',
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
                          title: 'Wind',
                          small: 'in km/h',
                          id: 'wind',
                          sortCycle: 'tri-states-from-ascending',
                        },
                        {
                          title: 'Gust',
                          small: 'in km/h',
                          id: 'gust',
                          sortCycle: 'tri-states-from-ascending',
                        },
                        {
                          title: 'Wind direction',
                          small: 'in °',
                          id: 'wind_direction',
                          sortCycle: 'tri-states-from-ascending',
                        },
                      ]}
                      title="All data"
                      hasSelection={false}
                      sortInfo={{
                        columnId: 'timeParsed',
                        direction: TABLE_SORT_DIRECTION.ASCENDING,
                      }}
                      size="short"
                    />
                  </Column>
                </Row>
              </Column>

              <WindBase height="600px" data={data} title="Wind and Gust speed" sm={12} lg={12} max={12} property="wind" />

              <WindDirectionBase height="600px" data={data} title="Wind direction (Ø per day)" property="wind_direction" sm={12} lg={12} max={12} tileId="wind-01-direction" />
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