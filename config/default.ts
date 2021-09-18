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

export type Transaction = {
  duration: number;
  transaction_rate_tpm: number;
  failed_transaction_rate: number;
};

type Config = {
  transactions: Record<string, Transaction>;
};
