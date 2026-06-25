import { API_BASE_URL } from '@/config/api';
import { requestApi } from '@/api/_shared';
import type { SchedulerRun } from '@/model';

/**
 * GET /api/runs — list run history.
 */
export const getAllRuns = (limit = 100) =>
  requestApi<SchedulerRun[]>(`${API_BASE_URL}/api/runs?limit=${limit}`);
