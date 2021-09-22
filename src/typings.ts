export type ConfigTransaction = {
  name: string;
  duration: number;
  transactionRateTpm: number;
  failedTransactionRate: number;
  spans?: Array<{
    type: 'elasticsearch' | 'postgres';
    duration: number;
  }>;
};

export type Config = {
  lookbackDurationInMinutes: number;
  instanceCount: number;
  serviceName: string;
  transactions: ConfigTransaction[];
};
