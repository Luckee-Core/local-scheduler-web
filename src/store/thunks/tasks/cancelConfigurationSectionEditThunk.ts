import { TaskDetailBuilderActions } from '@/store/builders/taskDetailBuilder';
import type { AppThunk } from '@/store/store';
import { resetCurrentTaskFromDumpThunk } from './resetCurrentTaskFromDumpThunk';

/**
 * Cancels configuration edit mode and reverts `currentTask` from the tasks dump.
 */
export const cancelConfigurationSectionEditThunk = (): AppThunk => (dispatch) => {
  dispatch(resetCurrentTaskFromDumpThunk());
  dispatch(TaskDetailBuilderActions.setEditingConfigurationSection(null));
};
