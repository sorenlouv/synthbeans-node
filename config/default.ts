import { Config } from '../src/typings';

const config: Config = {
  lookbackInMinutes: 60,
  instanceCount: 5,
  transactions: [
    {
      name: 'historical7',
      duration: 1000,
      transactionRateTpm: 60,
      failedTransactionRate: 0.5,
    },
  ],
};

export default config;
