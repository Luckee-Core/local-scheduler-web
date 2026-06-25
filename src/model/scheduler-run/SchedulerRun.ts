export type SchedulerRunStatus = 'success' | 'failed' | 'skipped';

export type SchedulerRun = {
  id: string;
  taskId: string;
  taskName: string;
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  status: SchedulerRunStatus;
  httpStatus: number | null;
  error: string | null;
  responseSummary: string | null;
  trigger: 'scheduled' | 'manual';
};
