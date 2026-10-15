import { deleteTask } from '@/api/tasks';
import { TasksActions } from '@/store/dumps/tasks';
import { SchedulerBuilderActions } from '@/store/builders/schedulerBuilder';
import type { AppThunk } from '@/store/store';

/**
 * Deletes a scheduled task via the express API.
 */
export const deleteTaskThunk =
  (taskId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch) => {
    dispatch(SchedulerBuilderActions.setLastError(null));

    const result = await deleteTask(taskId);

    if (!result.success) {
      dispatch(SchedulerBuilderActions.setLastError(result.error ?? 'Failed to delete task'));
      return result.httpStatus === 400 ? 400 : 500;
    }

    dispatch(TasksActions.removeTask(taskId));
    return 200;
  };
