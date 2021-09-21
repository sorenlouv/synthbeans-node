import cluster from 'cluster';
import { times } from 'lodash';
import config from '../config/default';
import { generateApmData } from './generate_apm_data';
import { parseWorkerEnvironment } from './worker_environment';

const numInstances = config.instanceCount;

if (cluster.isPrimary) {
  console.log(`Running 1 primary and ${numInstances} worker instances`);
  const lookbackEndTime = getLookbackEndTime();
  const lookbackDurationInMillis = config.lookbackDurationInMinutes * 1000 * 60;
  const lookbackStartTime = lookbackEndTime - lookbackDurationInMillis;

  // Fork workers for each instance
  times(numInstances, (instanceId) => {
    const env = parseWorkerEnvironment({ lookbackStartTime, instanceId });
    cluster.fork(env);
  });

  cluster.on('exit', (worker) => {
    console.log(`worker ${worker.process.pid} exited`);
  });
} else {
  try {
    generateApmData();
  } catch (e) {
    console.error('Synthbeans encountered an error', e);
  }
}

function getLookbackEndTime() {
  const coeff = 1000 * 60 * 1; // round to minute
  return new Date(Math.round(Date.now() / coeff) * coeff).getTime();
}
