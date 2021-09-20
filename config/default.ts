import { Config } from '../src/typings';

const config: Config = {
  lookbackDurationInMinutes: 60,
  instanceCount: 10,
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
