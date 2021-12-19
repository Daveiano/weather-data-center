import React from "react";
import { Column, Row } from "carbon-components-react";

export const TemperaturePage: React.FC = (): React.ReactElement  => {
  return (
    <div className="page">
      <Row>
        <Column>
          <h2>Temp</h2>
        </Column>
      </Row>
    </div>
  );
};