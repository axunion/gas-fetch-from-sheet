type Config = {
  dueDate: string;
  filterIndex: number;
  targetIndexes: number[];
};

export const configs: Record<string, Config> = {
  "202402": {
    dueDate: "2024/02/25",
    filterIndex: 1,
    targetIndexes: [2, 3],
  },
};
