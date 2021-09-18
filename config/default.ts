import { Config } from '../src/typings';

const config: Config = {
  transactions: {
    historical7: {
      duration: 1000,
      transaction_rate_tpm: 60,
      failed_transaction_rate: 0.5,
    },
  },
};

export default config;
