type FilterParams = {
  data: unknown[][];
  filterIndex: number;
  filterName: string;
  targetIndexes: number[];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function filter(params: FilterParams) {
  const { data, filterIndex, filterName, targetIndexes } = params;
  const result = [];

  for (const row of data) {
    if (row[filterIndex] === filterName) {
      result.push(targetIndexes.map((index) => row[index]));
    }
  }

  return result;
}
