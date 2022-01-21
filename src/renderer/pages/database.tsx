import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {Column, Row} from "carbon-components-react";

import {RootState} from "../renderer";
import {Empty} from "../components/empty";
import TableBase from "../components/table-base/table-base";
import {dataItem} from "../diagrams/types";
import {TABLE_SORT_DIRECTION} from "../components/table-base/misc";

export const DataBasePage: React.FC = (): React.ReactElement => {
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
            <h1>Database</h1>
          </Column>
        </Row>

        <Row className="start-tables">
          <Column>
            <TableBase
              size="short"
              start={0}
              pageSize={100}
              pageSizes={[50, 100, 200, 500]}
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
                  small: `in ${config.unit_temperature}`,
                  id: 'temperature',
                  sortCycle: 'tri-states-from-ascending',
                },
                {
                  title: 'Felt temperature',
                  small: `in ${config.unit_temperature}`,
                  id: 'felt_temperature',
                  sortCycle: 'tri-states-from-ascending',
                },
                {
                  title: 'Dew point',
                  small: `in ${config.unit_temperature}`,
                  id: 'dew_point',
                  sortCycle: 'tri-states-from-ascending',
                },
                {
                  title: 'Pressure',
                  small: `in ${config.unit_pressure}`,
                  id: 'pressure',
                  sortCycle: 'tri-states-from-ascending',
                },
                {
                  title: 'Humidity',
                  small: `in ${config.unit_humidity}`,
                  id: 'humidity',
                  sortCycle: 'tri-states-from-ascending',
                },
                {
                  title: 'Rain',
                  small: `in ${config.unit_rain}`,
                  id: 'rain',
                  tooltip: 'Accumulated during the day',
                  sortCycle: 'tri-states-from-ascending',
                },
                {
                  title: 'Wind',
                  small: `in ${config.unit_wind}`,
                  id: 'wind',
                  sortCycle: 'tri-states-from-ascending',
                },
                {
                  title: 'Gust',
                  small: `in ${config.unit_wind}`,
                  id: 'gust',
                  sortCycle: 'tri-states-from-ascending',
                },
                {
                  title: 'Solar irradiation',
                  small: `in ${config.unit_solar}`,
                  id: 'solar',
                  sortCycle: 'tri-states-from-ascending',
                },
                {
                  title: 'UV Index',
                  id: 'uvi',
                  sortCycle: 'tri-states-from-ascending',
                },
              ]}
              title="All data"
              hasSelection={true}
              sortInfo={{
                columnId: 'timeParsed',
                direction: TABLE_SORT_DIRECTION.ASCENDING,
              }}
            />
          </Column>
        </Row>
      </div>
    );
  }

  return (
    <Empty />
  );
};