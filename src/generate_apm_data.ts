import apmNode from 'elastic-apm-node';
import { times } from 'lodash';
import config from '../config/default';
import { ConfigTransaction } from './typings';
import { getWorkerEnvironment } from './worker_environment';

export function generateApmData() {
  const { instanceId, currentTime } = getWorkerEnvironment();
  const apm = apmNode.start({
    serviceNodeName: `instance-${instanceId}`,
    serviceName: 'my service',
  });

  const totalDurationInMillis = config.lookbackInMinutes * 1000 * 60;
  const startTime = currentTime - totalDurationInMillis;

  config.transactions.forEach((transaction) => {
    const totalRequestCount =
      (transaction.transactionRateTpm / config.instanceCount) *
      config.lookbackInMinutes;
    const msPerRequest = totalDurationInMillis / totalRequestCount;

    // console.log(
    //   `${totalRequestCount} requests/instance for ${config.lookbackInMinutes} minutes (${transaction.transactionRateTpm} tpm)`
    // );

    times(totalRequestCount, (i) => {
      createTransaction({
        apm,
        transaction,
        startTime: startTime + msPerRequest * i,
      });
    });
  });
}

function createTransaction({
  apm,
  transaction,
  startTime,
}: {
  apm: apmNode.Agent;
  transaction: ConfigTransaction;
  startTime: number;
}) {
  const t = apm.startTransaction(transaction.name, { startTime });

  const errorTimestamp = startTime + transaction.duration / 2;
  apm.captureError(new Error('Boom!'), { timestamp: errorTimestamp });

  const isFailureOutcome = Math.random() <= transaction.failedTransactionRate;
  const outcome = isFailureOutcome ? 'failure' : 'success';
  t?.setOutcome(outcome);
  //@ts-expect-error
  const span = t.startSpan('SELECT *', 'db.mysql', { startTime });
  span?.end(startTime + transaction.duration);

  t?.end(outcome, startTime + transaction.duration);
}
