import React, {useEffect, useState} from "react";

import { DataTable, TooltipIcon, Pagination, TableContainer, Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "carbon-components-react";
import { Information16 } from '@carbon/icons-react';
import moment from 'moment';

import { DataTableCustomRenderProps, DataTableHeader } from "carbon-components-react/lib/components/DataTable/DataTable";
import { dataItem } from "../diagrams/types";

interface TableBaseProps {
  title: string,
  data: dataItem[]
}

/**
 * @see https://www.carbondesignsystem.com/developing/react-tutorial/step-3/#add-loading
 */
export const TableBase: React.FC<TableBaseProps> = (props: TableBaseProps): React.ReactElement  => {
  const [data, setData] = useState(props.data);
  const [totalItems, setTotalItems] = useState(props.data.length);
  const [firstRowIndex, setFirstRowIndex] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(15);

  useEffect(() => {
    setData(props.data)
    setTotalItems(props.data.length);
    setFirstRowIndex(0);
    setCurrentPageSize(15);
  }, [props.data]);

  return (
    <div data-testid="table-base">
      <DataTable
        rows={data.slice(
          firstRowIndex,
          firstRowIndex + currentPageSize
        )}
        headers={[
          {
            header: 'Time',
            key: 'timeParsed',
            tooltip: 'Date format is YYYY/MM/DD HH:mm'
          },
          {
            header: 'Temperature',
            small: 'in °C',
            key: 'temperature',
          },
          {
            header: 'Felt temperature',
            small: 'in °C',
            key: 'felt_temperature',
          },
          {
            header: 'Dew point',
            small: 'in °C',
            key: 'dew_point',
          },
          {
            header: 'Pressure',
            small: 'in hPa',
            key: 'pressure',
          },
          {
            header: 'Humidity',
            small: 'in %',
            key: 'humidity',
          },
          {
            header: 'Rain',
            small: 'in mm',
            key: 'rain',
            tooltip: 'Accumulated per day'
          },
          {
            header: 'Wind',
            small: 'in km/h',
            key: 'wind',
          },
          {
            header: 'Gust',
            small: 'in km/h',
            key: 'gust',
          },
          {
            header: 'Solar irradiation',
            small: 'in w/m²',
            key: 'solar',
          },
          {
            header: 'UV Index',
            key: 'uvi',
          },
        ]}
        isSortable={true}
        size="short"
        useZebraStyles={false}
        shouldShowBorder={true}
      >
        {(renderProps: DataTableCustomRenderProps) => (
          <TableContainer
            title={props.title}
            description={`from ${moment(data[0].timeParsed).format('YYYY/MM/DD HH:mm')} till ${moment(data[data.length - 1].timeParsed).format('YYYY/MM/DD HH:mm')}`}
            stickyHeader={true}
          >
            <Table {...renderProps.getTableProps()}>
              <TableHead>
                <TableRow>
                  {renderProps.headers.map((header: DataTableHeader & { small: string, tooltip?: string }) => (
                    <TableHeader key={header.key} {...renderProps.getHeaderProps({ header })}>

                      <div style={{
                        display: 'flex',
                        alignItems: "center",
                        justifyContent: 'space-between'
                      }}>
                        <div style={{ marginRight: "20px" }}>
                          {header.header} <br/>
                          <span className="bx--type-helper-text-01">
                            {header.small}
                          </span>
                        </div>

                        {header.tooltip &&
                          <TooltipIcon
                            tooltipText={header.tooltip}
                            renderIcon={Information16}
                            direction="right"
                            children={<></>}
                          />
                        }
                      </div>

                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {renderProps.rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>
                        {cell.info.header === 'timeParsed' ? (
                          <>
                            {moment(cell.value).format('YYYY/MM/DD HH:mm')}
                          </>
                        ) : (
                          <>
                            {cell.value}
                          </>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>

      <Pagination
        totalItems={totalItems}
        backwardText="Previous page"
        forwardText="Next page"
        pageSize={currentPageSize}
        pageSizes={[10, 15, 20, 25, 50, 100]}
        itemsPerPageText="Items per page"
        onChange={({ page, pageSize }) => {
          if (pageSize !== currentPageSize) {
            setCurrentPageSize(pageSize);
          }
          setFirstRowIndex(pageSize * (page - 1));
        }}
      />

    </div>
  );
};