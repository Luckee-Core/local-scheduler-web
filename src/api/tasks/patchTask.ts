import { API_BASE_URL } from '@/config/api';
import { requestApi } from '@/api/_shared';
import type { ScheduledTask } from '@/model';

type PatchTaskBody = {
  enabled?: boolean;
};

/**
 * PATCH /api/tasks/:id — update task (e.g. enabled).
 */
export const patchTask = (taskId: string, body: PatchTaskBody) =>
  requestApi<ScheduledTask>(`${API_BASE_URL}/api/tasks/${encodeURIComponent(taskId)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
