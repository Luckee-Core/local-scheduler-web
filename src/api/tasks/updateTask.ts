import { API_BASE_URL } from '@/config/api';
import { requestApi } from '@/api/_shared';
import type { ScheduledTask } from '@/model';

export type UpdateTaskPayload = {
  name?: string;
  workerProjectId?: string;
  enabled?: boolean;
  worker?: ScheduledTask['worker'];
  request?: ScheduledTask['request'];
  schedule?: ScheduledTask['schedule'];
  lifecycle?: ScheduledTask['lifecycle'];
};

/**
 * PATCH /api/tasks/:id — update scheduled task fields.
 */
export const updateTask = (taskId: string, body: UpdateTaskPayload) =>
  requestApi<ScheduledTask>(`${API_BASE_URL}/api/tasks/${encodeURIComponent(taskId)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
