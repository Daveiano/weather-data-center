import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Column, Row, Tile } from "carbon-components-react";

import { RootState } from "../renderer";
import { Stats } from "../components/stats";
import { Empty } from "../components/empty";

export const TemperaturePage: React.FC = (): React.ReactElement  => {
  const dataFilteredFromStore = useSelector((state: RootState) => state.appState.dataFilteredPerTime);

  const [data, setData] = useState(dataFilteredFromStore);

  const loading = useSelector((state: RootState) => state.appState.loading);

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
                <Tile className="stat-tile-container">
                  <Stats data={data} />
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
};