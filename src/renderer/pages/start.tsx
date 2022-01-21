import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'

import { Row, Column, Tile } from 'carbon-components-react';
import { TemperatureHigh, TemperatureLow, Windy, RainyHeavy, Weather, Sunny } from '@carbon/pictograms-react';

import TemperatureBase from '../diagrams/temperature/temperature-base';
import HumidityBase from "../diagrams/humidity/humidity-base";
import PressureBase from "../diagrams/pressure/pressure-base";
import RainBase from "../diagrams/rain/rain-base";
import SolarBase from "../diagrams/solar/solar-base";
import UviBase from "../diagrams/uvi/uvi-base";
import WindBase from "../diagrams/wind/wind-base";
import WindDirectionBase from "../diagrams/wind-direction/wind-direction-base";
import DewPointBase from "../diagrams/temperature/dew-point-base";
import FeltTemperatureBase from "../diagrams/temperature/felt-temperature-base";

import { Stats } from "../components/stats/stats";

import TableBase from '../components/table-base/table-base';
import { TABLE_SORT_DIRECTION } from '../components/table-base/misc'

import { RootState } from "../renderer";
import { dataItem } from "../diagrams/types";
import { Empty } from "../components/empty";

// @todo Add tests for pages, wrap with redux provider to simulate missing data for wind.
export const Start:React.FC = (): React.ReactElement => {
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
      <div className="page" data-testid="overview-page">
        <Row>
          <Column>
            <h1>Overview</h1>
          </Column>
        </Row>

        <Row className="tiles">
          <Column sm={12} lg={12} max={8}>
            <Tile className="stat-tile-container normal">
              <Stats
                data={data}
                columnSpanLg={6}
                columnSpan={6}
                size="normal"
                stats={[
                  {
                    property: 'temperature',
                    direction: 'max',
                    label: 'Maximum Temperature',
                    unit: config.unit_temperature,
                    icon: <TemperatureHigh />
                  },
                  {
                    property: 'temperature',
                    direction: 'min',
                    label: 'Minimum Temperature',
                    unit: config.unit_temperature,
                    icon: <TemperatureLow />
                  },
                  {
                    property: 'gust',
                    direction: 'max',
                    label: 'Maximum Gust',
                    unit: config.unit_wind,
                    icon: <Windy />
                  },
                  {
                    property: 'rain',
                    direction: 'max',
                    label: 'Maximum Rain in one day',
                    unit: config.unit_rain,
                    icon: <RainyHeavy />
                  },
                  {
                    property: 'pressure',
                    direction: 'max',
                    label: 'Maximum Pressure',
                    unit: config.unit_pressure,
                    icon: <Sunny />
                  },
                  {
                    property: 'pressure',
                    direction: 'min',
                    label: 'Minimum Pressure',
                    unit: config.unit_pressure,
                    icon: <Weather />
                  }
                ]}
              />
            </Tile>
          </Column>

          <TemperatureBase data={data} title="Temperature" height="340px" property="temperature" sm={6} lg={6} max={4} config={config} />

          <PressureBase data={data} title="Pressure" height="340px" property="pressure" sm={6} lg={6} max={4} config={config} />

          <RainBase data={data} title="Rain" height="340px" property="rain" sm={6} lg={6} max={4} config={config} />

          <HumidityBase data={data} title="Humidity" height="340px" sm={6} lg={6} max={4} property="humidity" config={config} />

          <WindBase title="Wind speed" height="340px" data={data} sm={6} lg={6} max={4} property="wind" config={config} />

          <WindDirectionBase title="Wind direction" height="340px" data={data} sm={6} lg={6} max={4} property="wind_direction" config={config} />

          <FeltTemperatureBase data={data} title="Felt temperature" height="340px" property="temperature" sm={6} lg={6} max={4} config={config} />

          <SolarBase data={data} title="Solar" height="340px" property="solar" sm={6} lg={6} max={4} config={config} />

          <UviBase data={data} title="UVI" height="340px" property="uvi" sm={6} lg={6} max={4} config={config} />

          <DewPointBase data={data} title="Dew point" height="340px" property="dew_point" sm={6} lg={6} max={4} config={config} />
        </Row>

        <Row className="start-tables">
          <Column>
            <TableBase
              size="short"
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
              hasSelection={false}
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
}
