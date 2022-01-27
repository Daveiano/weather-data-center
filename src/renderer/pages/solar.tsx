import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {Column, Row, Tile} from "carbon-components-react";
import {RootState} from "../renderer";
import {Empty} from "../components/empty";
import {Stats} from "../components/stats/stats";
import SolarBase from "../diagrams/solar/solar-base";
import UviBase from "../diagrams/uvi/uvi-base";
import TableBase from "../components/table-base/table-base";
import {dataItem} from "../diagrams/types";
import {TABLE_SORT_DIRECTION} from "../components/table-base/misc";

export const SolarPage: React.FC = (): React.ReactElement => {
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
            <h1>Solar & UVI</h1>

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
                            property: 'solar',
                            direction: 'max',
                            label: 'Max Solar radiation',
                            unit: config.unit_solar
                          },
                          {
                            property: 'uvi',
                            direction: 'max',
                            label: 'Max UV Index',
                            unit: 'UVI'
                          },
                          {
                            property: 'solar',
                            direction: 'max',
                            scaling: 'average',
                            precision: 'day',
                            label: 'Brightest day',
                            tooltip: 'Highest Ø from all data',
                            unit: config.unit_solar
                          },
                          {
                            property: 'solar',
                            direction: 'min',
                            scaling: 'average',
                            precision: 'day',
                            label: 'Darkest day',
                            tooltip: 'Lowest Ø from all data',
                            unit: config.unit_solar
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
                          title: 'Solar radiation',
                          small: `in ${config.unit_solar}`,
                          id: 'solar',
                          sortCycle: 'tri-states-from-ascending',
                        },
                        {
                          title: 'UV Index',
                          small: 'in UVI',
                          id: 'uvi',
                          sortCycle: 'tri-states-from-ascending',
                        }
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

              <SolarBase height="600px" data={data} title="Solar radiation (Ø per day)" property="solar" sm={12} lg={12} max={12} config={config} />

              <UviBase height="600px" data={data} title="UV Index (Max per day)" property="uvi" sm={12} lg={12} max={12} tileId="solar-01-uvi" config={config} />
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