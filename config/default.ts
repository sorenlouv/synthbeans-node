import { Config } from '../src/typings';

const config: Config = {
  lookbackDurationInMinutes: 60 * 2,
  instanceCount: 2,
  transactions: [
    {
      name: 'GET /4000ms-100tpm',
      duration: 4000,
      transactionRateTpm: 100,
      failedTransactionRate: 0.9,
      spans: [{ type: 'elasticsearch', duration: 500 }],
    },
    {
      name: 'GET /1000ms-200tpm',
      duration: 1000,
      transactionRateTpm: 200,
      failedTransactionRate: 0.3,
      spans: [{ type: 'postgres', duration: 1000 }],
    },
  ],
};

export default config;
