export type TaskSchedule = {
  kind: 'interval';
  intervalMinutes: number;
  timezone: string;
  weekdays: number[];
  hourStart: number;
  hourEnd: number;
};

export type ScheduledTask = {
  id: string;
  name: string;
  workerProjectId: string;
  worker: {
    expressRepoName: string;
    defaultPort: number;
    healthPath: string;
    startCommand: string;
  };
  request: {
    method: string;
    path: string;
    authEnvKey?: string;
  };
  schedule: TaskSchedule;
  lifecycle: 'start_if_needed_stop_if_started';
  enabled: boolean;
  expressDir: string | null;
  port: number;
  nvmSh: string | null;
  nextRunAt: string | null;
  lastRunAt: string | null;
  lastRunStatus: string | null;
};
