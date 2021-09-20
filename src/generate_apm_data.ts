import apmNode from 'elastic-apm-node';
import { times } from 'lodash';
import config from '../config/default';
import { ConfigTransaction } from './typings';
import { getWorkerEnvironment } from './worker_environment';

export function generateApmData() {
  const { instanceId, lookbackStartTime } = getWorkerEnvironment();
  const apm = apmNode.start({
    serviceNodeName: `instance-${instanceId}`,
    serviceName: 'my service',
  });

  const lookbackDurationInMillis = config.lookbackDurationInMinutes * 1000 * 60;

  config.transactions.forEach((transaction) => {
    const throughputPerInstance =
      transaction.transactionRateTpm / config.instanceCount;

    const totalRequestCount =
      throughputPerInstance * config.lookbackDurationInMinutes;
    const msPerRequest = lookbackDurationInMillis / totalRequestCount;

    // console.log(
    //   `${totalRequestCount} requests/instance for ${config.lookbackDurationInMinutes} minutes (${transaction.transactionRateTpm} tpm)`
    // );

    // generate historical data
    times(totalRequestCount, (i) => {
      const startTime = lookbackStartTime + msPerRequest * i;
      createTransaction({ apm, transaction, startTime });
    });

    // generate concurrent data
    setInterval(() => {
      createTransaction({ apm, transaction, startTime: Date.now() });
    }, (60 / throughputPerInstance) * 1000);
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
