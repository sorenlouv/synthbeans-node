import { Config } from '../src/typings';

const config: Config = {
  lookbackDurationInMinutes: 60,
  instanceCount: 10,
  transactions: [
    {
      name: 'GET /slow',
      duration: 2000,
      transactionRateTpm: 100,
      failedTransactionRate: 0.8,
      spans: [
        {
          type: 'elasticsearch',
          duration: 500,
        },
      ],
    },
    {
      name: 'GET /fast',
      duration: 1000,
      transactionRateTpm: 200,
      failedTransactionRate: 0.1,
      spans: [
        {
          type: 'postgres',
          duration: 1000,
        },
      ],
    },
  ],
};

export default config;
