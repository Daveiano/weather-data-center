import React from "react";
import {Column, Row} from "carbon-components-react";

interface TemperaturePageProps {
  color: string,
  colorDarken: string
}

export const TemperaturePage: React.FC<TemperaturePageProps> = (props: TemperaturePageProps): React.ReactElement  => {
  return (
    <div className="temperature-page">
      <Row>
        <Column>
          <h2 id="overview">Overview</h2>
        </Column>
      </Row>
    </div>
  );
};