export type IntervalTaskSchedule = {
  kind: 'interval';
  intervalMinutes: number;
  timezone: string;
  weekdays: number[];
  hourStart: number;
  hourEnd: number;
};

export type DailyTaskSchedule = {
  kind: 'daily';
  hour: number;
  minute: number;
  timezone: string;
  weekdays: number[];
};

export type TaskSchedule = IntervalTaskSchedule | DailyTaskSchedule;

export type SchedulerExecutionType = 'local' | 'production';

export type MergedSchedulerProject = {
  id: string;
  name: string;
};

export type MergedSchedulerProjectRepo = {
  id: string;
  schedulerProjectId: string;
  expressRepoName: string;
  executionType: SchedulerExecutionType;
  productionBaseUrl: string | null;
  healthPath: string;
};

export type ScheduledTask = {
  id: string;
  name: string;
  workerProjectId: string;
  schedulerProjectRepoId: string;
  schedulerProject: MergedSchedulerProject;
  schedulerProjectRepo: MergedSchedulerProjectRepo;
  executionTarget: string;
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
  lifecycle: 'start_if_needed_stop_if_started' | 'call_only';
  enabled: boolean;
  expressDir: string | null;
  port: number;
  nvmSh: string | null;
  nextRunAt: string | null;
  lastRunAt: string | null;
  lastRunStatus: string | null;
};
