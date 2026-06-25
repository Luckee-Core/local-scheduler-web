import { API_BASE_URL } from '@/config/api';
import { requestApi } from '@/api/_shared';
import type { ScheduledTask } from '@/model';

/**
 * GET /api/tasks — list merged scheduled tasks.
 */
export const getAllTasks = () =>
  requestApi<ScheduledTask[]>(`${API_BASE_URL}/api/tasks`);
