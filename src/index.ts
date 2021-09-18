import config, { Transaction } from '../config/default';
import apmNode from 'elastic-apm-node';

const apm = apmNode.start({ serviceNodeName: 'foo' });

function getTimestampNowRounded() {
  const coeff = 1000 * 60 * 1; // round to minute
  return new Date(Math.round(Date.now() / coeff) * coeff).getTime();
}

function init() {
  const totalDurationInMinutes = 15;
  const endTime = getTimestampNowRounded();
  const startTime = endTime - totalDurationInMinutes * 1000 * 60;

  console.log(`Start time: ${new Date(startTime)}`);
  console.log(`End time: ${new Date(endTime)}`);

  Object.entries(config.transactions).forEach(
    ([transactionName, transaction]) => {
      const totalRequestCount =
        transaction.transaction_rate_tpm * totalDurationInMinutes;
      const timeBetweenTransactions =
        (60 / transaction.transaction_rate_tpm) * 1000;

      console.log({ totalRequestCount });
      console.log({ timeBetweenTransactions });

      Array.from(Array(totalRequestCount)).forEach((_, i) => {
        const transactionStartTime = startTime + timeBetweenTransactions * i;
        console.log(transactionStartTime);

        createTransaction({
          ...transaction,
          startTime: transactionStartTime,
          name: transactionName,
        });
      });
    }
  );

  function createTransaction(
    transaction: Transaction & {
      name: string;
      startTime: number;
    }
  ) {
    const t = apm.startTransaction(transaction.name, { startTime });

    apm.captureError(new Error('Boom!'), {
      timestamp: startTime + transaction.duration / 2,
    });

    const isFailureOutcome =
      Math.random() <= transaction.failed_transaction_rate;
    const outcome = isFailureOutcome ? 'failure' : 'success';
    t?.setOutcome(outcome);

    //@ts-expect-error
    const span = t.startSpan('SELECT *', 'db.mysql', { startTime });

    span?.end(startTime + transaction.duration);
    t?.end(outcome, startTime + transaction.duration);
  }
}

init();
