import process from 'process';

type WorkerEnv = {
  currentTime: number;
  instanceId: number;
};

export function parseWorkerEnvironment(workerEnv: WorkerEnv) {
  return workerEnv;
}

export function getWorkerEnvironment(): WorkerEnv {
  const { instanceId, currentTime } = process.env as unknown as WorkerEnv;
  return { instanceId, currentTime };
}
