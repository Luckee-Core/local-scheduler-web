'use client';

import { useCallback } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import { getAllRunsThunk, getAllTasksThunk } from '@/store/thunks';
import { PtasksTable } from '../table';

export const PtasksDashboard = () => {
  const dispatch = useAppDispatch();
  const schedulerBuilder = useAppSelector((state) => state.schedulerBuilder);

  const handleRefresh = useCallback(() => {
    void dispatch(getAllTasksThunk());
    void dispatch(getAllRunsThunk());
  }, [dispatch]);

  const isRefreshing = schedulerBuilder.isLoadingTasks || schedulerBuilder.isLoadingRuns;

  return (
    <div className={detailPageStyles.page}>
      <div className={styles.toolbar}>
        <div>
          <h1 className={detailPageStyles.pageTitle}>Scheduled tasks</h1>
          <p className={detailPageStyles.pageSubtitle}>
            Local cron jobs that call worker Express APIs on a schedule.
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={detailPageStyles.secondaryButton}
        >
          {isRefreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {schedulerBuilder.lastError ? (
        <p className={styles.error} role="alert">
          {schedulerBuilder.lastError}
        </p>
      ) : null}

      <PtasksTable />
    </div>
  );
};

const styles = {
  toolbar: `
    flex flex-wrap items-start justify-between gap-4
  `,
  error: `
    rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700
  `,
};
