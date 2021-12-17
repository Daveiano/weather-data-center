import React from "react";

import { Column, Row } from "carbon-components-react";
import { TemperatureHigh, TemperatureLow, Windy, RainyHeavy, Weather, Sunny } from '@carbon/pictograms-react';
import moment from "moment";

import { dataItem } from "../diagrams/types";

interface StatsProps {
  data: dataItem[]
}

export const Stats: React.FC<StatsProps> = (props: StatsProps): React.ReactElement  => {
  const maxTemp = props.data.slice().sort((a, b) => b.temperature - a.temperature);
  const minTemp = props.data.slice().sort((a, b) => a.temperature - b.temperature);
  const maxGust = props.data.slice().sort((a, b) => b.gust - a.gust);
  const maxRain = props.data.slice().sort((a, b) => b.rain - a.rain);
  const maxPressure = props.data.slice().sort((a, b) => b.pressure - a.pressure);
  const minPressure = props.data.slice().sort((a, b) => a.pressure - b.pressure);

  return (
    <Row className="stats">
      <Column lg={6} max={6} className="stat-tile">
        <Row>
          <Column lg={4} max={3}>
            <TemperatureHigh />
          </Column>
          <Column lg={8} max={9}>
            <h4 className="heading bx--type-expressive-heading-02">Maximum Temperature</h4>
            <div className="value bx--type-expressive-heading-03">{maxTemp[0].temperature}°C</div>
            <div className="date bx--type-body-short-01">on {moment(maxTemp[0].timeParsed).format('YYYY/MM/DD HH:mm')}</div>
          </Column>
        </Row>
      </Column>
      <Column lg={6} max={6} className="stat-tile">
        <Row>
          <Column lg={4} max={3}>
            <TemperatureLow />
          </Column>
          <Column lg={8} max={9}>
            <h4 className="heading bx--type-expressive-heading-02">Minimum Temperature</h4>
            <div className="value bx--type-expressive-heading-03">{minTemp[0].temperature}°C</div>
            <div className="date bx--type-body-short-01">on {moment(minTemp[0].timeParsed).format('YYYY/MM/DD HH:mm')}</div>
          </Column>
        </Row>
      </Column>
      <Column lg={6} max={6} className="stat-tile">
        <Row>
          <Column lg={4} max={3}>
            <Windy />
          </Column>
          <Column lg={8} max={9}>
            <h4 className="heading bx--type-expressive-heading-02">Maximum Gust</h4>
            <div className="value bx--type-expressive-heading-03">{maxGust[0].gust} km/h</div>
            <div className="date bx--type-body-short-01">on {moment(maxGust[0].timeParsed).format('YYYY/MM/DD HH:mm')}</div>
          </Column>
        </Row>
      </Column>
      <Column lg={6} max={6} className="stat-tile">
        <Row>
          <Column lg={4} max={3}>
            <RainyHeavy />
          </Column>
          <Column lg={8} max={9}>
            <h4 className="heading bx--type-expressive-heading-02">Maximum Rain in one day</h4>
            <div className="value bx--type-expressive-heading-03">{maxRain[0].rain} mm</div>
            <div className="date bx--type-body-short-01">on {moment(maxRain[0].timeParsed).format('YYYY/MM/DD HH:mm')}</div>
          </Column>
        </Row>
      </Column>
      <Column lg={6} max={6} className="stat-tile">
        <Row>
          <Column lg={4} max={3}>
            <Sunny />
          </Column>
          <Column lg={8} max={9}>
            <h4 className="heading bx--type-expressive-heading-02">Maximum Pressure</h4>
            <div className="value bx--type-expressive-heading-03">{maxPressure[0].pressure} hPa</div>
            <div className="date bx--type-body-short-01">on {moment(maxPressure[0].timeParsed).format('YYYY/MM/DD HH:mm')}</div>
          </Column>
        </Row>
      </Column>
      <Column lg={6} max={6} className="stat-tile">
        <Row>
          <Column lg={4} max={3}>
            <Weather />
          </Column>
          <Column lg={8} max={9}>
            <h4 className="heading bx--type-expressive-heading-02">Minimum Pressure</h4>
            <div className="value bx--type-expressive-heading-03">{minPressure[0].pressure} hPa</div>
            <div className="date bx--type-body-short-01">on {moment(minPressure[0].timeParsed).format('YYYY/MM/DD HH:mm')}</div>
          </Column>
        </Row>
      </Column>
    </Row>
  );
};