import React from "react";

import { Column, Tile } from 'carbon-components-react';

import {DiagramBaseProps} from "./types";

export const withEmptyCheck = (Component: React.JSXElementConstructor<DiagramBaseProps>): React.JSXElementConstructor<DiagramBaseProps> => {
  const WithEmptyCheckComponent = (props: DiagramBaseProps) => {
    const propertyData = props.data.filter(item => Object.prototype.hasOwnProperty.call(item, props.property));

    if (propertyData.length === 0) {
      return null;
    }

    return (
      <Column sm={props.sm} lg={props.lg} max={props.max}>
        <Tile>
          <Component {...props} />
        </Tile>
      </Column>
    );
  }

  WithEmptyCheckComponent.displayName = 'WithEmptyCheckComponent()';
  return WithEmptyCheckComponent;
}