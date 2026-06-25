import { API_BASE_URL } from '@/config/api';
import { requestApi } from '@/api/_shared';
import type { SchedulerRun } from '@/model';

/**
 * POST /api/tasks/:id/run-now — execute task immediately.
 */
export const runTaskNow = (taskId: string) =>
  requestApi<SchedulerRun>(
    `${API_BASE_URL}/api/tasks/${encodeURIComponent(taskId)}/run-now`,
    { method: 'POST' },
  );
