import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Column, Row, Tile } from "carbon-components-react";
import { TemperatureLow } from '@carbon/pictograms-react';

import { RootState } from "../renderer";
import { Stats } from "../components/stats/stats";
import { Empty } from "../components/empty";
import {TemperatureBase} from "../diagrams/temperature/temperature-base";
import TableBase from "../components/table-base/table-base";
import {TABLE_SORT_DIRECTION} from "../components/table-base/misc";
import {dataItem} from "../diagrams/types";
import {TemperatureCombinedBase} from "../diagrams/temperature/temperature-combined-base";
import {FeltTemperatureBase} from "../diagrams/temperature/felt-temperature-base";
import {TemperatureMinMaxBase} from "../diagrams/temperature/temperature-min-max-base";

/**
 * @see https://www.dwd.de/DE/service/lexikon/Functions/glossar.html?lv2=101334&lv3=101452
 */
export const TemperaturePage: React.FC = (): React.ReactElement  => {
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
            <h1>Temperature</h1>

            <Row className="tiles">
              <Column sm={12} lg={12} max={12}>
                <Tile className="combined-tile-stats-diagram">
                  <Row>
                    <Column sm={12} lg={12} max={12}>
                      <h3>Minimum / Maximum values & Climatological days</h3>
                    </Column>
                  </Row>
                  <Row>
                    <Column sm={12} lg={12} max={3}>
                      <Stats
                        data={data}
                        columnSpanLg={3}
                        columnSpan={6}
                        size="compact"
                        stats={[
                          {
                            property: 'temperature',
                            direction: 'max',
                            label: 'Maximum',
                            unit: '°C'
                          },
                          {
                            property: 'temperature',
                            direction: 'min',
                            label: 'Minimum',
                            unit: '°C',
                            icon: <TemperatureLow />
                          },
                          {
                            property: 'temperature',
                            direction: 'day',
                            extra: 'summer-days',
                            label: 'Summer days',
                            description: 'T<sub>max</sub> ≥ 25 °C',
                            unit: '°C'
                          },
                          {
                            property: 'temperature',
                            direction: 'day',
                            extra: 'frost-days',
                            label: 'Frost days',
                            description: 'T<sub>min</sub> < 0 °C',
                            unit: '°C'
                          },
                          {
                            property: 'temperature',
                            direction: 'day',
                            extra: 'hot-days',
                            label: 'Hot days',
                            description: 'T<sub>max</sub> ≥ 30 °C',
                            unit: '°C'
                          },
                          {
                            property: 'temperature',
                            direction: 'day',
                            extra: 'ice-days',
                            label: 'Ice days',
                            description: 'T<sub>max</sub> < 0 °C',
                            unit: '°C'
                          },
                          {
                            property: 'temperature',
                            direction: 'day',
                            extra: 'tropical-nights',
                            label: 'Tropical nights',
                            description: 'T<sub>min</sub> ≥ 20 °C',
                            tooltip: '18:00 UTC - 06:00 UTC',
                            unit: '°C'
                          },
                          {
                            property: 'temperature',
                            direction: 'day',
                            extra: 'desert-days',
                            label: 'Desert days',
                            description: 'T<sub>max</sub> ≥ 35 °C',
                            unit: '°C'
                          }
                        ]}
                      />
                    </Column>
                    <Column sm={12} lg={12} max={9}>
                      {/* @todo Add annotations. */}
                      <TemperatureBase height="450px" data={data} />
                    </Column>
                  </Row>
                </Tile>
              </Column>
              <Column sm={12} lg={12} max={12}>
                <Tile id="temp-01-felt-dew">
                  <TemperatureCombinedBase data={data} title="Temperature, Felt temperature and Dew point (Ø per day)" height="600px" />
                </Tile>
              </Column>
              <Column sm={12} lg={12} max={12}>
                <Tile id="temp-02-min-max-felt">
                  <FeltTemperatureBase height="600px" data={data} title="Felt temperature Minimum & Maximum (Min/Max per day)" />
                </Tile>
              </Column>
              <Column sm={12} lg={12} max={12}>
                <Tile className="table-combined" id="temp-03-combined">
                  <TemperatureMinMaxBase height="650px" data={data} title="Minimum, maximum and average temperature" />
                </Tile>
              </Column>
              <Column sm={12} lg={12} max={12} id="temp-04-table">
                <TableBase
                  start={0}
                  pageSize={25}
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
                      title: 'Temperature',
                      small: 'in °C',
                      id: 'temperature',
                      sortCycle: 'tri-states-from-ascending',
                    },
                    {
                      title: 'Felt temperature',
                      small: 'in °C',
                      id: 'felt_temperature',
                      sortCycle: 'tri-states-from-ascending',
                    },
                    {
                      title: 'Dew point',
                      small: 'in °C',
                      id: 'dew_point',
                      sortCycle: 'tri-states-from-ascending',
                    }
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
        </Row>
      </div>
    );
  }

  return (
    <Empty />
  );
};