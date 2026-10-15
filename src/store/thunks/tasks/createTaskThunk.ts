import { createTask, type CreateTaskPayload } from '@/api/tasks';
import { TasksActions } from '@/store/dumps/tasks';
import { SchedulerBuilderActions } from '@/store/builders/schedulerBuilder';
import type { AppThunk } from '@/store/store';

/**
 * Creates or upserts a scheduled task via the express API.
 */
export const createTaskThunk =
  (payload: CreateTaskPayload): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch) => {
    dispatch(SchedulerBuilderActions.setLastError(null));

    const result = await createTask(payload, true);

    if (!result.success || !result.data) {
      dispatch(SchedulerBuilderActions.setLastError(result.error ?? 'Failed to create task'));
      return result.httpStatus === 400 ? 400 : 500;
    }

    dispatch(TasksActions.upsertTask(result.data));
    return 200;
  };
