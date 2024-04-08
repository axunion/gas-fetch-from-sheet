type Config = {
  sheetName: string;
  dueDate: string;
  filterIndex: number;
  targetIndexes: number[];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const configs: Record<string, Config> = {
  "202402": {
    sheetName: "Data",
    dueDate: "2024/02/25",
    filterIndex: 1,
    targetIndexes: [2, 3],
  },
};
