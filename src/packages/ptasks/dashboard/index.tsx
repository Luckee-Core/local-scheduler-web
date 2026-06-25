'use client';

import { useCallback } from 'react';
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
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div>
          <h1 className={styles.title}>Scheduled tasks</h1>
          <p className={styles.subtitle}>
            Local cron jobs that call worker Express APIs on a schedule.
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={styles.refreshButton(isRefreshing)}
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
  container: `
    space-y-4
  `,
  toolbar: `
    flex flex-wrap items-start justify-between gap-4
  `,
  title: `
    text-xl font-semibold text-gray-900
  `,
  subtitle: `
    mt-1 text-sm text-gray-600
  `,
  refreshButton: (disabled: boolean) =>
    `rounded-md px-4 py-2 text-sm font-medium transition-colors ${
      disabled
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
    }`,
  error: `
    rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700
  `,
};
