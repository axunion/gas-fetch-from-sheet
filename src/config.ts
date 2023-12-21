interface Config {
  sheetName: string;
  expiryDate: string;
  filterIndex: number;
  targetIndexes: number[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const parameterNames = ["type", "name", "code"];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const configs: Record<string, Config> = {
  "202402": {
    sheetName: "Data",
    expiryDate: "2024/01/31",
    filterIndex: 1,
    targetIndexes: [2, 3],
  },
};
