import { API_BASE_URL } from '@/config/api';
import { requestApi } from '@/api/_shared';

/**
 * DELETE /api/tasks/:id — remove a scheduled task.
 */
export const deleteTask = (taskId: string) =>
  requestApi<{ id: string }>(`${API_BASE_URL}/api/tasks/${encodeURIComponent(taskId)}`, {
    method: 'DELETE',
  });
