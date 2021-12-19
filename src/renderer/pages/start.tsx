import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import moment from "moment";

import { Row, Column, Tile } from 'carbon-components-react';

import { dataAction, isLoadingAction } from "../actions-app";

import { TemperatureBase } from '../diagrams/temperature/temperature-base';
import { HumidityBase } from "../diagrams/humidity/humidity-base";
import { PressureBase } from "../diagrams/pressure/pressure-base";
import { RainBase } from "../diagrams/rain/rain-base";
import { SolarBase } from "../diagrams/solar/solar-base";
import { UviBase } from "../diagrams/uvi/uvi-base";
import { WindBase } from "../diagrams/wind/wind-base";
import { WindDirectionBase } from "../diagrams/wind-direction/wind-direction-base";
import { DewPointBase } from "../diagrams/temperature/dew-point-base";
import { FeltTemperatureBase } from "../diagrams/temperature/felt-temperature-base";

import { Stats } from "../components/stats";

import TableBase from '../components/table-base/table-base';
import { TABLE_SORT_DIRECTION } from '../components/table-base/misc'

import { RootState } from "../renderer";
import { dataItem } from "../diagrams/types";

export const Start:React.FC = (): React.ReactElement => {
  const [data, setData] = useState([]);

  const dispatch = useDispatch();

  const dataFromStore = useSelector((state: RootState) => state.appState.data);
  const dateSetByUser = useSelector((state: RootState) => state.appState.dateSetByUser);
  const loading = useSelector((state: RootState) => state.appState.loading);

  const getData = (arg: [dataItem[]]): void => {
    console.log('getData', arg);
    if (arg[0].length) {
      setData(arg);
      dispatch(dataAction(arg[0]));
    }
    console.log('getData dispatch(isLoadingAction(false));');
    dispatch(isLoadingAction(false));
  };

  // Get data from electron.
  useEffect(() => {
    console.log('useEffect1 dispatch(isLoadingAction(true));');
    dispatch(isLoadingAction(true));
    const removeEventListener = window.electron.IpcOn('query-data', (event, arg) => getData(arg));

    if (!dataFromStore.length) {
      window.electron.IpcSend('query-data', null);
    } else {
      setData(dataFromStore);
      console.log('useEffect1 dispatch(isLoadingAction(false));');
      dispatch(isLoadingAction(false));
    }

    return () => {
      removeEventListener();
    };
  }, []);

  const filterDataPerTime = (): void => {
    const startDate = moment(dateSetByUser.start, 'DD-MM-YYYY').unix();
    const endDate = moment(dateSetByUser.end, 'DD-MM-YYYY').unix();

    const filteredData = dataFromStore.filter((dataItem: dataItem) => dataItem.time >= startDate && dataItem.time <= endDate);

    setData(filteredData);
    console.log('filterDataPerTime dispatch(isLoadingAction(false));');
    dispatch(isLoadingAction(false));
  };

  // Filter data when user changes dates.
  useEffect(() => {
    if (data.length) {
      console.log('useEffect2 dispatch(isLoadingAction(true));');
      dispatch(isLoadingAction(true));
      filterDataPerTime();
    }
  }, [dateSetByUser]);

  console.log(loading);

  // @todo Why? Also look into UI when changing dates - optical feedback.
  if (loading) {
    return <></>;
  }

  if (data.length > 0) {
    return (
      <div className="page">
        <Row>
          <Column>
            <h2>Overview</h2>
          </Column>
        </Row>

        <Row className="tiles">
          <Column sm={12} lg={12} max={8}>
            <Tile className="stat-tile-container">
              <Stats data={data} />
            </Tile>
          </Column>
          <Column sm={6} lg={6} max={4}>
            <Tile>
              <TemperatureBase data={data} title="Temperature" height="340px" />
            </Tile>
          </Column>
          <Column sm={6} lg={6} max={4}>
            <Tile>
              <PressureBase data={data} title="Pressure" height="340px" />
            </Tile>
          </Column>
          <Column sm={6} lg={6} max={4}>
            <Tile>
              <RainBase data={data} title="Rain" height="340px" />
            </Tile>
          </Column>
          <Column sm={6} lg={6} max={4}>
            <Tile>
              <HumidityBase data={data} title="Humidity" height="340px" />
            </Tile>
          </Column>
          <Column sm={6} lg={6} max={4}>
            <Tile>
              <WindBase title="Wind speed" height="340px" data={data} />
            </Tile>
          </Column>
          <Column sm={6} lg={6} max={4}>
            <Tile>
              <WindDirectionBase title="Wind direction" height="340px" data={data} />
            </Tile>
          </Column>
          <Column sm={6} lg={6} max={4}>
            <Tile>
              <FeltTemperatureBase data={data} title="Felt temperature" height="340px" />
            </Tile>
          </Column>
          <Column sm={6} lg={6} max={4}>
            <Tile>
              <SolarBase data={data} title="Solar" height="340px" />
            </Tile>
          </Column>
          <Column sm={6} lg={6} max={4}>
            <Tile>
              <UviBase data={data} title="UVI" height="340px" />
            </Tile>
          </Column>
          <Column sm={6} lg={6} max={4}>
            <Tile>
              <DewPointBase data={data} title="Dew point" height="340px" />
            </Tile>
          </Column>
        </Row>
        <Row className="start-tables">
          <Column>
            <TableBase
              size="short"
              start={0}
              pageSize={15}
              rows={data.map(item => ({
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
                },
                {
                  title: 'Pressure',
                  small: 'in hPa',
                  id: 'pressure',
                  sortCycle: 'tri-states-from-ascending',
                },
                {
                  title: 'Humidity',
                  small: 'in %',
                  id: 'humidity',
                  sortCycle: 'tri-states-from-ascending',
                },
                {
                  title: 'Rain',
                  small: 'in mm',
                  id: 'rain',
                  tooltip: 'Accumulated during the day',
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
                  title: 'Solar irradiation',
                  small: 'in w/m²',
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
    <div>
      <h2>Please import some data. <br/> This can be done via the icon on the top right.</h2>
    </div>
  );
}
