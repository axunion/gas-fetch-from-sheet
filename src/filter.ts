export type FilterParams = {
  rows: unknown[][];
  filterColumnIndex: number;
  filterValue: string;
  targetColumnIndexes: number[];
};

export function filter(params: FilterParams) {
  const { rows, filterColumnIndex, filterValue, targetColumnIndexes } = params;
  const filteredRows = [];

  for (const row of rows) {
    if (row[filterColumnIndex] === filterValue) {
      filteredRows.push(targetColumnIndexes.map((index) => row[index]));
    }
  }

  return filteredRows;
}
