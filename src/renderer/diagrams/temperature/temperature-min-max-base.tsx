import React, { FunctionComponent, useEffect, useState } from 'react';

import { Column, ContentSwitcher, Loading, Row, Switch, Tile } from "carbon-components-react";
import { ResponsiveLine } from '@nivo/line'
import { TemperatureMax32, TemperatureMin32 } from "@carbon/icons-react";

import { dataItem, DiagramBaseProps } from "../types";
import { scaleMinMaxAvg } from "../scaling";
import { getTemperatureLineBaseProps } from './temperature-base';
import TableBase from "../../components/table-base/table-base";
import { TABLE_SORT_DIRECTION } from "../../components/table-base/misc";


// @todo Make series deactivatable like in temperature-combined.
export const TemperatureMinMaxBase:FunctionComponent<DiagramBaseProps> = (props: DiagramBaseProps): React.ReactElement => {
  const [data, setData] = useState(scaleMinMaxAvg(props.data, 'temperature', 'day'));
  const [loading, setLoading] = useState(true);
  const [precision, setPrecision] = useState('daily');
  const [hiddenSeries, setHiddenSeries] = useState([]);

  const scale = () => {
    switch (precision) {
      case 'daily':
        setData(scaleMinMaxAvg(props.data, 'temperature', 'day'));
        break;
      case 'monthly':
        setData(scaleMinMaxAvg(props.data, 'temperature', 'month'));
        break;
      case 'yearly':
        setData(scaleMinMaxAvg(props.data, 'temperature', 'year'));
        break;
    }

    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    scale();
  }, [props.data, precision]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loading
          description="Active loading indicator"
          withOverlay={false}
        />
      </div>
    );
  }

  return (
    <div data-testid="temperature-min-max-diagram">
      <h3>
        <TemperatureMax32 />
        <TemperatureMin32 />
        {props.title}
      </h3>

      <Row>
        <Column sm={6} lg={6} max={6}>
          <ContentSwitcher
            size="md"
          >
            <Switch text='Daily' onClick={() => setPrecision('daily')} />
            <Switch text='Monthly' onClick={() => setPrecision('monthly')} />
            <Switch text='Yearly' onClick={() => setPrecision('yearly')} />
          </ContentSwitcher>
        </Column>
      </Row>

      <Row className="content">
        <Column sm={12} lg={12} max={4}>
          <TableBase
            start={0}
            pageSize={20}
            pageSizes={[20]}
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
                title: 'Minimum',
                small: 'in °C',
                id: 'temperature_min',
                sortCycle: 'tri-states-from-ascending',
              },
              {
                title: 'Average',
                small: 'in °C',
                id: 'temperature_average',
                sortCycle: 'tri-states-from-ascending',
              },
              {
                title: 'Maximum',
                small: 'in °C',
                id: 'temperature_max',
                sortCycle: 'tri-states-from-ascending',
              },
            ]}
            hasSelection={false}
            sortInfo={{
              columnId: 'timeParsed',
              direction: TABLE_SORT_DIRECTION.ASCENDING,
            }}
            size="short"
            dateFormat={(() => {
              switch(precision) {
                case "daily":
                  return "YYYY/MM/DD";
                case "monthly":
                  return "YYYY/MM"
                case "yearly":
                  return "YYYY";
              }
            })()}
          />
        </Column>
        <Column sm={12} lg={12} max={8}>
          <Tile>
            <div style={{ height: props.height }} className="diagram">
              <ResponsiveLine
                {...getTemperatureLineBaseProps(
                  precision,
                  [
                    ...data.map(item => Object.assign({}, item, {
                      temperature: item.temperature_max
                    })),
                    ...data.map(item => Object.assign({}, item, {
                      temperature: item.temperature_min
                    })),
                  ],
                  'temperature',
                  true
                )}
                data={[
                  {
                    id: 'Minimum',
                    data: data.map(item => ({
                      x: item.timeParsed,
                      y: item.temperature_min
                    })),
                    color: hiddenSeries.includes('Minimum') ? 'transparent' : '#67C8FF'
                  },
                  {
                    id: 'Average',
                    data: data.map(item => ({
                      x: item.timeParsed,
                      y: item.temperature_average
                    })),
                    color: hiddenSeries.includes('Average') ? 'transparent' : '#000000'
                  },
                  {
                    id: 'Maximum',
                    data: data.map(item => ({
                      x: item.timeParsed,
                      y: item.temperature_max
                    })),
                    color: hiddenSeries.includes('Maximum') ? 'transparent' : '#C41E3A'
                  }
                ]}
                // @todo theme={}
                colors={d => d.color}
                legends={[
                  {
                    anchor: 'top-right',
                    direction: 'row',
                    itemWidth: 70,
                    itemHeight: 20,
                    itemsSpacing: 20,
                    onClick: (d) => {
                      let hidden = hiddenSeries;
                      if (hidden.includes(d.id)) {
                        hidden = hidden.filter(item => item != d.id);
                      }
                      else {
                        hidden = [...hidden, d.id];
                      }

                      setHiddenSeries(hidden);
                    }
                  }
                ]}
                margin={{ top: 10, right: 10, bottom: 20, left: 40 }}
              />
            </div>
          </Tile>
        </Column>
      </Row>

    </div>
  );
}