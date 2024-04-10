type Config = {
  dueDate: string;
  filterIndex: number;
  targetIndexes: number[];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const configs: Record<string, Config> = {
  "202402": {
    dueDate: "2024/02/25",
    filterIndex: 1,
    targetIndexes: [2, 3],
  },
};
