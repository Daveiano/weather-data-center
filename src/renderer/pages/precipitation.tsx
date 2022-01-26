import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {Column, Row, Tile} from "carbon-components-react";

import {RootState} from "../renderer";
import {Stats} from "../components/stats/stats";
import RainBase from "../diagrams/rain/rain-base";
import {Empty} from "../components/empty";
import RainManualPeriodBase from "../diagrams/rain/rain-manual-period-base";
import HumidityBase from "../diagrams/humidity/humidity-base";

export const PrecipitationPage: React.FC = (): React.ReactElement  => {
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
            <h1>Precipitation</h1>

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
                            property: 'rain',
                            direction: 'day',
                            extra: 'rain-days',
                            label: 'Rain days',
                            description: 'R<sub>min</sub> ≥ 0.1 mm'
                          },
                          {
                            property: 'rain',
                            direction: 'min',
                            scaling: 'sum',
                            precision: 'month',
                            dateFormat: 'MMM YY',
                            label: 'Driest month',
                            unit: config.unit_rain
                          },
                          {
                            property: 'rain',
                            direction: 'max',
                            label: 'Maximum per day',
                            unit: config.unit_rain
                          },
                          {
                            property: 'rain',
                            direction: 'max',
                            scaling: 'sum',
                            precision: 'week',
                            dateFormat: '\\Www\\/YY',
                            label: 'Maximum per week',
                            unit: config.unit_rain
                          },
                          {
                            property: 'rain',
                            direction: 'max',
                            scaling: 'sum',
                            precision: 'month',
                            dateFormat: 'MMM YY',
                            label: 'Maximum per month',
                            unit: config.unit_rain
                          },
                          {
                            property: 'rain',
                            direction: 'max',
                            scaling: 'sum',
                            precision: 'year',
                            dateFormat: 'YYYY',
                            label: 'Maximum per year',
                            unit: config.unit_rain
                          },
                          {
                            property: 'rain',
                            direction: 'extra',
                            extra: 'rain-days-consecutive',
                            label: 'Longest rain period',
                            description: 'Consecutive days with rain',
                            unit: '',
                          },
                          {
                            property: 'rain',
                            direction: 'extra',
                            extra: 'rain-days-consecutive-sum',
                            label: 'Longest rain period amount',
                            description: 'Consecutive days with rain',
                            unit: config.unit_rain
                          }
                        ]}
                      />
                    </Column>

                    {/* @todo Add consecutive and maximum annotations. */}
                    <RainBase
                      height="500px"
                      data={data}
                      precision="day"
                      annotations={[
                        {
                          type: 'dot',
                          note: 'Most rain per day',
                          match: (value, index, collection) => {
                            const max = Math.max(...Array.from(collection).map(item => item.data.value));

                            return value.data.formattedValue === `${max} ${config.unit_rain}`;
                          },
                          noteX: 25,
                          noteY: -100,
                          noteTextOffset: -3,
                          noteWidth: 5,
                          size: 5
                        }
                      ]}
                      property="rain"
                      hideTile={true}
                      sm={12}
                      lg={12}
                      max={9}
                      config={config}
                    />
                  </Row>
                </Tile>
              </Column>

              <RainManualPeriodBase
                height="700px"
                data={data}
                property="rain"
                sm={12}
                lg={12}
                max={12}
                tileClassName="table-combined"
                tileId="rain-02-selectable"
                config={config}
              />

              <HumidityBase height="600px" data={data} title="Humidity (Ø per day)" sm={12} lg={12} max={12} property="humidity" tileId="rain-03-humidity" config={config} />

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