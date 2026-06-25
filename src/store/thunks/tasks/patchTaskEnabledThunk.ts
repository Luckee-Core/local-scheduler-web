import { patchTask } from '@/api/tasks';
import { TasksActions } from '@/store/dumps/tasks';
import { SchedulerBuilderActions } from '@/store/builders/schedulerBuilder';
import type { AppThunk } from '@/store/store';

/**
 * Toggles or sets the enabled flag for a task.
 */
export const patchTaskEnabledThunk =
  (taskId: string, enabled: boolean): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch) => {
    dispatch(SchedulerBuilderActions.setLastError(null));

    const result = await patchTask(taskId, { enabled });

    if (!result.success || !result.data) {
      dispatch(SchedulerBuilderActions.setLastError(result.error ?? 'Failed to update task'));
      return result.httpStatus === 400 ? 400 : 500;
    }

    dispatch(TasksActions.upsertTask(result.data));
    return 200;
  };
