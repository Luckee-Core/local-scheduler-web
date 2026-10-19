import { TaskDetailBuilderActions } from '@/store/builders/taskDetailBuilder';
import type { TaskConfigurationSectionKey } from '@/store/builders/task-detail-configuration-section';
import type { AppThunk } from '@/store/store';
import { resetCurrentTaskFromDumpThunk } from './resetCurrentTaskFromDumpThunk';

/**
 * Enters edit mode for one configuration section (reverts unsaved edits from another section).
 */
export const startConfigurationSectionEditThunk = (
  section: TaskConfigurationSectionKey,
): AppThunk => (dispatch, getState) => {
  const active = getState().taskDetailBuilder.editingConfigurationSection;
  if (active && active !== section) {
    dispatch(resetCurrentTaskFromDumpThunk());
  }
  dispatch(TaskDetailBuilderActions.resetSaveState());
  dispatch(TaskDetailBuilderActions.setEditingConfigurationSection(section));
};
