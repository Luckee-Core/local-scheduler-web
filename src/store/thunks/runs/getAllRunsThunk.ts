import { getAllRuns } from '@/api/runs';
import { RunsActions } from '@/store/dumps/runs';
import { SchedulerBuilderActions } from '@/store/builders/schedulerBuilder';
import type { AppThunk } from '@/store/store';

/**
 * Loads run history from the express API.
 */
export const getAllRunsThunk =
  (limit = 100): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch) => {
    dispatch(SchedulerBuilderActions.setLoadingRuns(true));
    dispatch(SchedulerBuilderActions.setLastError(null));

    const result = await getAllRuns(limit);

    dispatch(SchedulerBuilderActions.setLoadingRuns(false));

    if (!result.success || !result.data) {
      dispatch(SchedulerBuilderActions.setLastError(result.error ?? 'Failed to load runs'));
      return result.httpStatus === 400 ? 400 : 500;
    }

    dispatch(RunsActions.setRuns(result.data));
    return 200;
  };
