import { CurrentTaskActions } from '@/store/current/currentTask';
import { TaskDetailBuilderActions } from '@/store/builders/taskDetailBuilder';
import type { AppThunk } from '@/store/store';

/**
 * Reverts `currentTask` to the last loaded row in the tasks dump.
 */
export const resetCurrentTaskFromDumpThunk = (): AppThunk => (dispatch, getState) => {
  const { currentTask, tasks } = getState();
  const row = tasks[currentTask.id];
  if (row) {
    dispatch(CurrentTaskActions.setCurrentTask(row));
  }
  dispatch(TaskDetailBuilderActions.resetSaveState());
};
