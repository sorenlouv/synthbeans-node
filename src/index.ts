import apmNode from 'elastic-apm-node';
import config from '../config/default';
import { Transaction } from './typings';

const apm = apmNode.start({ serviceNodeName: 'foo' });

function getTimestampNowRounded() {
  const coeff = 1000 * 60 * 1; // round to minute
  return new Date(Math.round(Date.now() / coeff) * coeff).getTime();
}

function init() {
  const endTime = getTimestampNowRounded();
  const totalDurationInMillis = config.lookbackInMinutes * 1000 * 60;
  const startTime = endTime - totalDurationInMillis;

  Object.entries(config.transactions).forEach(
    ([transactionName, transaction]) => {
      const totalRequestCount =
        transaction.transaction_rate_tpm * config.lookbackInMinutes;
      const msPerRequest = totalDurationInMillis / totalRequestCount;

      Array.from(Array(totalRequestCount)).forEach((_, i) => {
        createTransaction({
          ...transaction,
          startTime: startTime + msPerRequest * i,
          name: transactionName,
        });
      });
    }
  );
}

init();

function createTransaction(
  transaction: Transaction & {
    name: string;
    startTime: number;
  }
) {
  const { startTime } = transaction;
  const t = apm.startTransaction(transaction.name, { startTime });

  apm.captureError(
    new Error('Boom!'),
    {
      timestamp: startTime + transaction.duration / 2,
    },
    (a, b) => {
      console.log(a, b);
    }
  );

  const isFailureOutcome = Math.random() <= transaction.failed_transaction_rate;
  const outcome = isFailureOutcome ? 'failure' : 'success';
  t?.setOutcome(outcome);

  //@ts-expect-error
  const span = t.startSpan('SELECT *', 'db.mysql', { startTime });

  span?.end(startTime + transaction.duration);
  t?.end(outcome, startTime + transaction.duration);
}
