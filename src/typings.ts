export type Transaction = {
  duration: number;
  transaction_rate_tpm: number;
  failed_transaction_rate: number;
};

export type Config = {
  lookbackInMinutes: number;
  transactions: Record<string, Transaction>;
};
