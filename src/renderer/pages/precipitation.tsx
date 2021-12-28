import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {Column, Row, Tile} from "carbon-components-react";
import {TemperatureLow} from "@carbon/pictograms-react";

import {RootState} from "../renderer";
import {Stats} from "../components/stats/stats";
import {RainBase} from "../diagrams/rain/rain-base";
import {Empty} from "../components/empty";
import {RainManualPeriodBase} from "../diagrams/rain/rain-manual-period-base";

export const PrecipitationPage: React.FC = (): React.ReactElement  => {
  const dataFilteredFromStore = useSelector((state: RootState) => state.appState.dataFilteredPerTime);
  const loading = useSelector((state: RootState) => state.appState.loading);

  const [data, setData] = useState(dataFilteredFromStore);

  useEffect(() => {
    setData(dataFilteredFromStore);
  }, [dataFilteredFromStore]);

  console.log(data);

  if (loading) {
    return null;
  }

  if (data.length > 0) {
    return (
      <div className="page">
        <Row>
          <Column>
            <h1>Precipitation</h1>

            <Row className="tiles">

              <Column sm={12} lg={12} max={12}>
                <Tile className="combined-tile-stats-diagram">
                  <Row>
                    <Column sm={12} lg={12} max={12}>
                      <h3>Minimum/Maximum values & Climatological days</h3>
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
                            direction: 'extra',
                            extra: 'summer-days',
                            label: 'Summer days',
                            description: 'T<sub>max</sub> ≥ 25 °C',
                            unit: '°C'
                          },
                          {
                            property: 'temperature',
                            direction: 'extra',
                            extra: 'frost-days',
                            label: 'Frost days',
                            description: 'T<sub>min</sub> < 0 °C',
                            unit: '°C'
                          },
                          {
                            property: 'temperature',
                            direction: 'extra',
                            extra: 'hot-days',
                            label: 'Hot days',
                            description: 'T<sub>max</sub> ≥ 30 °C',
                            unit: '°C'
                          },
                          {
                            property: 'temperature',
                            direction: 'extra',
                            extra: 'ice-days',
                            label: 'Ice days',
                            description: 'T<sub>max</sub> < 0 °C',
                            unit: '°C'
                          },
                          {
                            property: 'temperature',
                            direction: 'extra',
                            extra: 'tropical-nights',
                            label: 'Tropical nights',
                            description: 'T<sub>min</sub> ≥ 20 °C',
                            tooltip: '18:00 UTC - 06:00 UTC',
                            unit: '°C'
                          },
                          {
                            property: 'temperature',
                            direction: 'extra',
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
                      <RainBase height="450px" data={data} />
                    </Column>
                  </Row>
                </Tile>
              </Column>

              <Column sm={12} lg={12} max={12}>
                <Tile className="table-combined" id="rain-02-selectable">
                  <RainManualPeriodBase height="600px" data={data} />
                </Tile>
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
}