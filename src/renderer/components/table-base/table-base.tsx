import React, { useCallback, useEffect, useState } from "react";

import moment from "moment";

import { Delete16 as Delete, Information16 } from "@carbon/icons-react";
import {
  TableContainer,
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableSelectRow,
  TableSelectAll,
  TableToolbar,
  TableToolbarAction,
  TableToolbarContent,
  TableToolbarSearch,
  TableToolbarMenu,
  TableBatchActions,
  TableBatchAction,
  TooltipIcon,
  Modal,
} from "carbon-components-react";
import type { DataTableSize } from "carbon-components-react";
import { DataTableSortState } from "carbon-components-react/lib/components/DataTable/state/sorting";

import {
  useFilteredRows,
  usePageInfo,
  useRowSelection,
  useSortedRows,
  useSortInfo,
  useUniqueId,
} from "./hooks";
import Pagination from "./components/pagination";
import { TABLE_SORT_DIRECTION } from "./misc";
import { dataItem } from "../../diagrams/types";
import { extendedPropertyParameter } from "../../diagrams/scaling";
import { dataHasRecordsForProperty } from "../../diagrams/hoc";

export type dataItemDataTable = dataItem & { selected: boolean };

interface TableBaseProps {
  collator?: Intl.Collator;
  columns: {
    id: extendedPropertyParameter;
    title: string;
    sortCycle?: string;
    small?: string;
    tooltip?: string;
  }[];
  hasSelection?: boolean;
  id?: string;
  pageSize: number;
  rows: dataItemDataTable[];
  size?: DataTableSize;
  sortInfo: {
    columnId: string;
    direction: DataTableSortState;
  };
  start: number;
  zebra?: boolean;
  title?: string;
  dateFormat?: string;
  pageSizes?: number[];
}

/**
 * An example state manager that an application can start with to achieve
 * a fully-customized data table.
 *
 * There are many different use cases for managing data table state,
 * i.e. lazy-loading table row data that are not on the current page.
 *
 * Carbon has `<DataTable>` component manage table state,
 * but one `<DataTable>` supporting every possible use case will make it very complex.
 *
 * In case Carbon `<DataTable>` doesn't meet the needs of BU/application,
 * PALs/applications create a state manager by their own, i.e. starting with
 * this example.
 *
 * Carbon design for table is implemented by `<Table>`, `<TableRow>`,
 * `<TableCell>`, etc.,
 * whereas `<DataTable>` is merely a state manager.
 *
 * Therefore, using a custom component in place of `<DataTable>` does _not_ mean
 * going away from Carbon design.
 *
 * THIS COMPONENT IS FOR DEMONSTRATION PURPOSES ONLY.
 *
 * @see https://react.carbondesignsystem.com/?path=/docs/components-datatable-batch-actions--usage
 * @see https://github.com/carbon-design-system/carbon/issues/6373
 * @see https://github.com/carbon-design-system/carbon/tree/main/packages/react/examples/custom-data-table-state-manager
 */
const TableBase: React.FC<TableBaseProps> = (
  props: TableBaseProps
): React.ReactElement => {
  const [rows, setRows] = useState(props.rows);
  const [modalOpen, setModalOpen] = useState(false);
  const [sortInfo, setSortInfo] = useSortInfo(props.sortInfo);
  const [filteredRows, searchString, setSearchString] = useFilteredRows(rows);
  const [setRowSelection] = useRowSelection(
    filteredRows,
    searchString,
    setRows
  );
  const [sortedRows] = useSortedRows(filteredRows, sortInfo, props.collator);
  const [start, pageSize, setStart, setPageSize] = usePageInfo(
    props.start,
    props.pageSize,
    filteredRows.length
  );

  const elementId = useUniqueId(props.id);
  const selectedRowsCountInFiltered = filteredRows.filter(
    (row) => row.selected
  ).length;
  const selectedAllInFiltered =
    selectedRowsCountInFiltered > 0 &&
    filteredRows.length === selectedRowsCountInFiltered;
  const hasBatchActions = props.hasSelection && selectedRowsCountInFiltered > 0;
  const { columnId: sortColumnId, direction: sortDirection } = sortInfo;
  const selectionAllName = !props.hasSelection
    ? undefined
    : `__custom-data-table_select-all_${elementId}`;

  const handleCancelSelection = useCallback(() => {
    setRowSelection(undefined, false);
  }, [setRowSelection]);

  const handleChangeSearchString = useCallback(
    ({ target }) => {
      setSearchString(target.value);
    },
    [setSearchString]
  );

  const handleChangeSelection = useCallback(
    (event) => {
      const { currentTarget } = event;
      const row = currentTarget.closest("tr");
      if (row) {
        setRowSelection(Number(row.dataset.rowId), currentTarget.checked);
      }
    },
    [setRowSelection]
  );

  const handleChangeSelectionAll = useCallback(
    (event) => {
      setRowSelection(undefined, event.currentTarget.checked);
    },
    [setRowSelection]
  );

  const handleChangeSort = useCallback(
    (event) => {
      const { currentTarget } = event;
      const {
        columnId,
        sortCycle,
        sortDirection: oldDirection,
      } = currentTarget.dataset;
      setSortInfo({ columnId, sortCycle, oldDirection });
    },
    [setSortInfo]
  );

  const handleChangePageSize = useCallback(
    ({ pageSize }) => {
      setPageSize(pageSize);
    },
    [setPageSize]
  );

  const handleChangeStart = useCallback(
    ({ start }) => {
      setStart(start);
    },
    [setStart]
  );

  const handleDeleteRows = () => {
    setModalOpen(true);
  };

  useEffect(() => {
    setRows(props.rows);
  }, [props.rows]);

  let description = `from ${moment(rows[0].timeParsed).format(
    "YYYY/MM/DD HH:mm"
  )} till ${moment(rows[rows.length - 1].timeParsed).format(
    "YYYY/MM/DD HH:mm"
  )}`;
  if (props.dateFormat) {
    description = `from ${moment(rows[0].timeParsed).format(
      props.dateFormat
    )} till ${moment(rows[rows.length - 1].timeParsed).format(
      props.dateFormat
    )}`;
  }

  return (
    <>
      {props.hasSelection && (
        <Modal
          size="xs"
          danger={true}
          modalHeading={`Are you sure? This will delete ${
            rows.filter((row) => row.selected).length
          } record(s).`}
          open={modalOpen}
          closeButtonLabel="Cancel"
          primaryButtonText="Delete"
          secondaryButtonText="Cancel"
          onRequestClose={() => setModalOpen(false)}
          onRequestSubmit={() => {
            window.electron.IpcSend(
              "delete",
              rows.filter((row) => row.selected)
            );
            setModalOpen(false);
          }}
        ></Modal>
      )}
      <TableContainer title={props.title} description={description}>
        {hasBatchActions && (
          <TableToolbar>
            <TableBatchActions
              shouldShowBatchActions={hasBatchActions}
              totalSelected={selectedRowsCountInFiltered}
              onCancel={handleCancelSelection}
            >
              <TableBatchAction
                tabIndex={hasBatchActions ? 0 : -1}
                renderIcon={Delete}
                onClick={handleDeleteRows}
              >
                Delete
              </TableBatchAction>
            </TableBatchActions>
            <TableToolbarContent>
              <TableToolbarSearch
                tabIndex={hasBatchActions ? -1 : 0}
                onChange={handleChangeSearchString}
              />
              <TableToolbarMenu tabIndex={hasBatchActions ? -1 : 0}>
                <TableToolbarAction onClick={() => alert("Alert 1")}>
                  Action 1
                </TableToolbarAction>
                <TableToolbarAction onClick={() => alert("Alert 2")}>
                  Action 2
                </TableToolbarAction>
                <TableToolbarAction onClick={() => alert("Alert 3")}>
                  Action 3
                </TableToolbarAction>
              </TableToolbarMenu>
            </TableToolbarContent>
          </TableToolbar>
        )}

        <Table size={props.size} isSortable useZebraStyles={props.zebra}>
          <TableHead>
            <TableRow>
              {props.hasSelection && (
                <TableSelectAll
                  id={`${elementId}--select-all`}
                  checked={selectedAllInFiltered}
                  indeterminate={
                    selectedRowsCountInFiltered > 0 && !selectedAllInFiltered
                  }
                  ariaLabel="Select all rows"
                  name={selectionAllName}
                  onSelect={handleChangeSelectionAll}
                />
              )}

              {props.columns
                .filter((item) => dataHasRecordsForProperty(item.id, rows))
                .map(({ id: columnId, sortCycle, title, small, tooltip }) => {
                  const sortDirectionForThisCell =
                    columnId === sortColumnId
                      ? sortDirection
                      : TABLE_SORT_DIRECTION.NONE;
                  return (
                    <TableHeader
                      key={columnId}
                      isSortable={Boolean(sortCycle)}
                      isSortHeader={sortCycle && columnId === sortColumnId}
                      sortDirection={sortDirectionForThisCell}
                      data-column-id={columnId}
                      data-sort-cycle={sortCycle}
                      data-sort-direction={sortDirectionForThisCell}
                      onClick={handleChangeSort}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ marginRight: "20px" }}>
                          {title} <br />
                          <span className="bx--type-helper-text-01">
                            {small}
                          </span>
                        </div>

                        {tooltip && (
                          <TooltipIcon
                            align="start"
                            tooltipText={tooltip}
                            direction="bottom"
                          >
                            <Information16 />
                          </TooltipIcon>
                        )}
                      </div>
                    </TableHeader>
                  );
                })}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows.slice(start, start + pageSize).map((row) => {
              const { id: rowId, selected } = row;
              const selectionName = !props.hasSelection
                ? undefined
                : `__custom-data-table_${elementId}_${rowId}`;
              return (
                <TableRow
                  key={rowId}
                  isSelected={props.hasSelection && selected}
                  data-row-id={rowId}
                >
                  {props.hasSelection && (
                    <TableSelectRow
                      id={`${elementId}--select-${rowId}`}
                      checked={Boolean(selected)}
                      name={selectionName}
                      ariaLabel="Select row"
                      onSelect={handleChangeSelection}
                    />
                  )}
                  {props.columns
                    .filter((item) => dataHasRecordsForProperty(item.id, rows))
                    .map(({ id: columnId }) => (
                      <TableCell key={columnId}>
                        {columnId === "timeParsed" ? (
                          <>
                            {props.dateFormat ? (
                              <>
                                {moment(row[columnId]).format(props.dateFormat)}
                              </>
                            ) : (
                              <>
                                {moment(row[columnId]).format(
                                  "YYYY/MM/DD HH:mm"
                                )}
                              </>
                            )}
                          </>
                        ) : (
                          <>{row[columnId]}</>
                        )}
                      </TableCell>
                    ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {typeof pageSize !== "undefined" && (
          <Pagination
            start={start}
            count={filteredRows.length}
            pageSize={pageSize}
            pageSizes={
              props.pageSizes ? props.pageSizes : [10, 15, 20, 25, 50, 100]
            }
            onChangePageSize={handleChangePageSize}
            onChangeStart={handleChangeStart}
          />
        )}
      </TableContainer>
    </>
  );
};

TableBase.defaultProps = {
  collator: new Intl.Collator(),
  hasSelection: false,
  pageSize: 5,
  size: "normal",
  start: 0,
};

export default TableBase;
