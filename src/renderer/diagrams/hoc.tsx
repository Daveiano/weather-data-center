import React from "react";

import { Column, Tile } from 'carbon-components-react';

import {dataItem, DiagramBaseProps} from "./types";
import {extendedPropertyParameter} from "./scaling";

export const dataHasRecordsForProperty = (property: extendedPropertyParameter, data: dataItem[]): boolean => {
  return data.filter(item => Object.prototype.hasOwnProperty.call(item, property)).length > 0;
}

export const withEmptyCheck = (Component: React.JSXElementConstructor<DiagramBaseProps>): React.JSXElementConstructor<DiagramBaseProps> => {
  const WithEmptyCheckComponent = (props: DiagramBaseProps) => {

    if (!dataHasRecordsForProperty(props.property, props.data)) {
      return null;
    }

    return (
      <Column sm={props.sm} lg={props.lg} max={props.max}>
        <Tile
          id={props.tileId}
          className={props.tileClassName}
          style={props.hideTile ? {
            margin: 0,
            padding: 0,
            outline: 0
          } : {}}
        >
          <Component
            data={props.data}
            title={props.title}
            height={props.height}
            property={props.property}
            config={props.config}
            precision={props.precision}
            annotations={props.annotations}
          />
        </Tile>
      </Column>
    );
  }

  WithEmptyCheckComponent.displayName = 'WithEmptyCheckComponent()';
  return WithEmptyCheckComponent;
}