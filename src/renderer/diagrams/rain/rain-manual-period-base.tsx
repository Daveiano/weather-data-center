import React, {FunctionComponent, useEffect, useState} from 'react';

import {Column, ContentSwitcher, Loading, Row, Switch} from "carbon-components-react";
import {Rain32} from "@carbon/icons-react";
import { ResponsiveBar } from '@nivo/bar';

import {dataItem, DiagramBaseProps} from "../types";
import {scaleMax, scaleSum} from "../scaling";
import {TABLE_SORT_DIRECTION} from "../../components/table-base/misc";
import TableBase from "../../components/table-base/table-base";
import moment from "moment";
import {TooltipBar} from "../tooltip";

export const RainManualPeriodBase:FunctionComponent<DiagramBaseProps> = (props: DiagramBaseProps): React.ReactElement => {
  const [data, setData] = useState(scaleMax(props.data, 'rain', 'day'));
  const [loading, setLoading] = useState(true);
  const [precision, setPrecision] = useState('daily');

  const scale = () => {
    switch (precision) {
      case 'daily':
        setData(scaleMax(props.data, 'rain', 'day'));
        break;
      case 'weekly':
        setData(scaleSum(props.data, 'rain', 'week'));
        break;
      case 'monthly':
        setData(scaleSum(props.data, 'rain', 'month'));
        break;
      case 'yearly':
        setData(scaleSum(props.data, 'rain', 'year'));
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
    <div data-testid="rain-manual-period-diagram">
      {props.title &&
        <h3>
          <Rain32 />
          {props.title}
        </h3>
      }

      <Row>
        <Column sm={6} lg={6} max={6}>
          <ContentSwitcher
            size="md"
          >
            <Switch text='Daily' onClick={() => setPrecision('daily')} />
            <Switch text='Weekly' onClick={() => setPrecision('weekly')} />
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
                title: 'Rain',
                small: 'in mm',
                id: 'rain',
                sortCycle: 'tri-states-from-ascending',
              }
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
                case "weekly":
                  return "\\Www YY";
                case "monthly":
                  return "YYYY/MM"
                case "yearly":
                  return "YYYY";
              }
            })()}
          />
        </Column>
        <Column sm={12} lg={12} max={8}>
          <div style={{ height: props.height }} className="diagram">
            {/* @todo Create base object, like temperbaselinepropsthingstuff. */}
            <ResponsiveBar
              data={data}
              indexBy={"timeParsed"}
              keys={['rain']}
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: false }}
              minValue={0}
              maxValue={Math.max.apply(Math, data.map(item => item.rain )) + 5}
              valueFormat={value => `${value} mm`}
              margin={{ top: 20, right: 10, bottom: 60, left: 40 }}
              colors= {['#0198E1']}
              enableLabel={false}
              labelSkipHeight={50}
              enableGridX={false}
              enableGridY={true}
              theme={{
                fontSize: precision === 'daily' ? 10 : 11
              }}
              axisLeft={{
                legend: 'mm',
                legendOffset: -35,
                legendPosition: 'middle',
                tickSize: 0,
                tickPadding: 10
              }}
              axisBottom={{
                format: value => {
                  switch (precision) {
                    case 'daily':
                      if (parseInt(moment(value).format("D")) % 2 == 0 || moment(value).format("D") === '31') {
                        return '';
                      }
                      if (moment(value).format("D") === '1') {
                        return moment(value).format("Do MMM");
                      }

                      return moment(value).format("Do");
                    case 'weekly':
                      return moment(value).format("\\Www\\/YY");
                    case 'monthly':
                      return moment(value).format("MMM YY");
                    case 'yearly':
                      return moment(value).format("YY");
                  }
                },
                tickSize: 0,
                tickPadding: 5,
                tickRotation: precision === 'daily' || precision === 'weekly' ? -65 : 0
              }}
              isInteractive={true}
              tooltip={point => <TooltipBar
                formattedValue={point.formattedValue}
                time={(() => {
                  switch(precision) {
                    case "daily":
                      return moment.unix(point.data.time).utc().format("YYYY/MM/DD");
                    case "weekly":
                      return moment.unix(point.data.time).utc().format("\\Www YY");
                    case "monthly":
                      return moment.unix(point.data.time).utc().format("YYYY/MM");
                    case "yearly":
                      return moment.unix(point.data.time).utc().format("YYYY");
                  }
                })()}
                color="#0198E1"
              />}
            />
          </div>
        </Column>
      </Row>
    </div>
  );
}