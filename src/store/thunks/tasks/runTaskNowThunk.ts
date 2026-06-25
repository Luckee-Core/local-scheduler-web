import { runTaskNow } from '@/api/tasks';
import { RunsActions } from '@/store/dumps/runs';
import { TasksActions } from '@/store/dumps/tasks';
import { SchedulerBuilderActions } from '@/store/builders/schedulerBuilder';
import { getAllTasks } from '@/api/tasks';
import type { AppThunk } from '@/store/store';

/**
 * Runs a task immediately via POST /api/tasks/:id/run-now.
 */
export const runTaskNowThunk =
  (taskId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch) => {
    dispatch(SchedulerBuilderActions.addRunningTask(taskId));
    dispatch(SchedulerBuilderActions.setLastError(null));

    const result = await runTaskNow(taskId);

    dispatch(SchedulerBuilderActions.removeRunningTask(taskId));

    if (!result.success || !result.data) {
      dispatch(SchedulerBuilderActions.setLastError(result.error ?? 'Run failed'));
      return result.httpStatus === 400 ? 400 : 500;
    }

    dispatch(RunsActions.upsertRun(result.data));

    const tasksResult = await getAllTasks();
    if (tasksResult.success && tasksResult.data) {
      dispatch(TasksActions.setTasks(tasksResult.data));
    }

    return 200;
  };
