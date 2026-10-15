import { updateTask } from '@/api/tasks';
import { CurrentTaskActions } from '@/store/current/currentTask';
import { TasksActions } from '@/store/dumps/tasks';
import { TaskDetailBuilderActions } from '@/store/builders/taskDetailBuilder';
import type { AppThunk } from '@/store/store';

/**
 * Persists `currentTask` to the express API (PATCH /api/tasks/:id).
 */
export const saveTaskThunk = (): AppThunk<Promise<200 | 400 | 500>> => async (dispatch, getState) => {
  const task = getState().currentTask;
  if (!task.id) {
    return 400;
  }

  dispatch(TaskDetailBuilderActions.setSaveError(null));
  dispatch(TaskDetailBuilderActions.setSaveStatus('saving'));

  const result = await updateTask(task.id, {
    name: task.name,
    workerProjectId: task.workerProjectId,
    enabled: task.enabled,
    worker: task.worker,
    request: task.request,
    schedule: task.schedule,
    lifecycle: task.lifecycle,
  });

  if (!result.success || !result.data) {
    dispatch(TaskDetailBuilderActions.setSaveStatus('error'));
    dispatch(
      TaskDetailBuilderActions.setSaveError(result.error ?? 'Failed to save task'),
    );
    return result.httpStatus === 400 ? 400 : 500;
  }

  dispatch(TasksActions.upsertTask(result.data));
  dispatch(CurrentTaskActions.setCurrentTask(result.data));
  dispatch(TaskDetailBuilderActions.setSaveStatus('success'));
  return 200;
};
