import { API_BASE_URL } from '@/config/api';
import { requestApi } from '@/api/_shared';
import type { ScheduledTask } from '@/model';

/**
 * GET /api/tasks/:id — one merged scheduled task.
 */
export const getTaskById = (taskId: string) =>
  requestApi<ScheduledTask>(`${API_BASE_URL}/api/tasks/${encodeURIComponent(taskId)}`);
