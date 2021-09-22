import { Config } from '../src/typings';

export default {
  serviceName: 'Synthbeans Node',
  lookbackDurationInMinutes: 60,
  instanceCount: 2,
  transactions: [
    {
      name: 'GET /orders (4000ms 100tpm 90%)',
      duration: 4000,
      transactionRateTpm: 100,
      failedTransactionRate: 0.9,
      spans: [{ type: 'elasticsearch', duration: 500 }],
    },
    {
      name: 'GET /books (1000ms 200tpm 30%)',
      duration: 1000,
      transactionRateTpm: 200,
      failedTransactionRate: 0.3,
      spans: [{ type: 'postgres', duration: 1000 }],
    },
  ],
} as Config;
