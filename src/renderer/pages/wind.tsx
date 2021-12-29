import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {Column, Row, Tile} from "carbon-components-react";
import {RootState} from "../renderer";
import {Empty} from "../components/empty";
import {Stats} from "../components/stats/stats";
import {WindBase} from "../diagrams/wind/wind-base";
import {WindDirectionBase} from "../diagrams/wind-direction/wind-direction-base";

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
                <Tile className="combined-tile-stats-diagram">
                  <Row>
                    <Column sm={12} lg={12} max={12}>
                      <h3>Minimum/Maximum values</h3>
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
                            property: 'gust',
                            direction: 'max',
                            label: 'Maximum Gust',
                            unit: 'km/h'
                          },
                          {
                            property: 'gust',
                            direction: 'extra',
                            extra: 'storm-days',
                            label: 'Storm days',
                            description: 'W ≥ 8 Beaufort',
                            unit: 'km/h',
                          }
                        ]}
                      />
                    </Column>
                    <Column sm={12} lg={12} max={9}>
                      {/* @todo Add annotations. */}
                      <WindBase height="450px" data={data} />
                    </Column>
                  </Row>
                </Tile>
              </Column>
              <Column sm={12} lg={12} max={12}>
                <Tile id="wind-01-direction">
                  <WindDirectionBase height="600px" data={data} title="Wind direction" />
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