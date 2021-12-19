import React from "react";
import { Column, Row, Tile } from "carbon-components-react";
import { DocumentAdd20 } from "@carbon/icons-react";

export const Empty: React.FC = (): React.ReactElement  => {
  return (
    <div className="page">
      <Row>
        <Column>
          <h1>No data found</h1>
        </Column>
      </Row>

      <Row className="tiles">
        <Column sm={12} lg={12} max={8}>
          <Tile className="empty">
            <h3>
              Please import some data.
            </h3>
            <p className="text bx--type-body-short-02">
              This can be done via the <DocumentAdd20 /> icon on the top right.
            </p>
          </Tile>
        </Column>
      </Row>
    </div>
  );
};