import { TABLE_SORT_DIRECTION } from '../misc';
import useCollator from './useCollator';
import { dataItemDataTable } from "../table-base";

/**
 * The map of how sorting direction affects sorting order.
 */
const collationFactors = {
  [TABLE_SORT_DIRECTION.ASCENDING]: 1,
  [TABLE_SORT_DIRECTION.DESCENDING]: -1,
};

type test = {
  columnId: string, direction: string
}

/**
 * @param {object[]} rows The table rows.
 * @param {object} sortInfo The table sort info.
 * @param {Intl.Collator} collator The g11n collator.
 * @returns {Array} The sorted table rows.
 */
const useSortedRows = (rows: dataItemDataTable[], sortInfo: test, collator: Intl.Collator) => {
  const compare = useCollator(collator);
  const { columnId: sortColumnId, direction: sortDirection } = sortInfo;
  const sortedRows =
    sortDirection === TABLE_SORT_DIRECTION.NONE
      ? rows
      : rows
          .slice()
          .sort(
            (lhs, rhs) =>
              collationFactors[sortDirection] *
              compare(lhs[sortColumnId], rhs[sortColumnId])
          );
  return [sortedRows];
};

export default useSortedRows;
