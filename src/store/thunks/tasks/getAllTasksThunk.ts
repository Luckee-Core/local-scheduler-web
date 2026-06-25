import { getAllTasks } from '@/api/tasks';
import { TasksActions } from '@/store/dumps/tasks';
import { SchedulerBuilderActions } from '@/store/builders/schedulerBuilder';
import type { AppThunk } from '@/store/store';

/**
 * Loads all scheduled tasks from the express API.
 */
export const getAllTasksThunk = (): AppThunk<Promise<200 | 400 | 500>> => async (dispatch) => {
  dispatch(SchedulerBuilderActions.setLoadingTasks(true));
  dispatch(SchedulerBuilderActions.setLastError(null));

  const result = await getAllTasks();

  dispatch(SchedulerBuilderActions.setLoadingTasks(false));

  if (!result.success || !result.data) {
    dispatch(SchedulerBuilderActions.setLastError(result.error ?? 'Failed to load tasks'));
    return result.httpStatus === 400 ? 400 : 500;
  }

  dispatch(TasksActions.setTasks(result.data));
  return 200;
};
