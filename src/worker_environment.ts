import process from 'process';

type WorkerEnv = {
  lookbackStartTime: number;
  instanceId: number;
};

export function parseWorkerEnvironment(workerEnv: WorkerEnv) {
  return workerEnv;
}

export function getWorkerEnvironment(): WorkerEnv {
  if (process.env.instanceId == undefined) {
    throw new Error('Missing instanceId');
  }

  if (process.env.lookbackStartTime == undefined) {
    throw new Error('Missing lookbackStartTime');
  }

  return {
    instanceId: parseInt(process.env.instanceId, 10),
    lookbackStartTime: parseInt(process.env.lookbackStartTime, 10),
  };
}
