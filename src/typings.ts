export type ConfigTransaction = {
  name: string;
  duration: number;
  transactionRateTpm: number;
  failedTransactionRate: number;
};

export type Config = {
  lookbackInMinutes: number;
  instanceCount: number;
  transactions: ConfigTransaction[];
};
