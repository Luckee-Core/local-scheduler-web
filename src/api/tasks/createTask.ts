import { API_BASE_URL } from '@/config/api';
import { requestApi } from '@/api/_shared';
import type { ScheduledTask } from '@/model';

export type CreateTaskPayload = {
  id: string;
  name: string;
  workerProjectId: string;
  enabled?: boolean;
  worker: ScheduledTask['worker'];
  request: ScheduledTask['request'];
  schedule: ScheduledTask['schedule'];
  lifecycle?: ScheduledTask['lifecycle'];
};

/**
 * POST /api/tasks — create or upsert a scheduled task.
 */
export const createTask = (body: CreateTaskPayload, upsert = true) =>
  requestApi<ScheduledTask>(`${API_BASE_URL}/api/tasks?upsert=${upsert}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
