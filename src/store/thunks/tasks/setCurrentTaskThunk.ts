import { getTaskById } from '@/api/tasks/getTaskById';
import { CurrentTaskActions } from '@/store/current/currentTask';
import { TasksActions } from '@/store/dumps/tasks';
import type { AppThunk } from '@/store/store';

/**
 * Hydrate `currentTask` from the tasks dump (or API) before navigating to task detail.
 */
export const setCurrentTaskThunk =
  (taskId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    let task = getState().tasks[taskId];

    if (!task) {
      const result = await getTaskById(taskId);
      if (!result.success || !result.data) {
        return result.httpStatus === 400 ? 400 : 500;
      }
      dispatch(TasksActions.upsertTask(result.data));
      task = result.data;
    }

    dispatch(CurrentTaskActions.setCurrentTask(task));
    return 200;
  };
