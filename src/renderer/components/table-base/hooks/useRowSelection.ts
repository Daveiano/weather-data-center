import { useCallback } from 'react';
import doesRowMatchSearchString from '../misc/doesRowMatchSearchString';
import {dataItemDataTable} from "../table-base";

/**
 * @param {object[]} rows The table rows.
 * @param {string} searchString The search string.
 * @param {Function} setRows The setter for the table rows.
 * @returns {Array} The setter for the table row selection.
 */
const useRowSelection = (rows: dataItemDataTable[], searchString: string, setRows: (a: dataItemDataTable[]) => void) => {
  const setRowSelection = useCallback(
    (rowId, selected) => {
      setRows(
        rows.map((row) => {
          const doChange = rowId
            ? rowId === row.id
            : !searchString || doesRowMatchSearchString(row, searchString);
          return !doChange ? row : { ...row, selected };
        })
      );
    },
    [rows, searchString, setRows]
  );
  return [setRowSelection];
};

export default useRowSelection;