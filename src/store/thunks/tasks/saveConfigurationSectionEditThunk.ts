import { TaskDetailBuilderActions } from '@/store/builders/taskDetailBuilder';
import type { AppThunk } from '@/store/store';
import { saveTaskThunk } from './saveTaskThunk';

/**
 * Saves `currentTask` and exits configuration edit mode on success.
 */
export const saveConfigurationSectionEditThunk =
  (): AppThunk<Promise<200 | 400 | 500>> => async (dispatch) => {
    const status = await dispatch(saveTaskThunk());
    if (status === 200) {
      dispatch(TaskDetailBuilderActions.setEditingConfigurationSection(null));
    }
    return status;
  };
