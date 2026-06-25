'use client';

import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { getAllRunsThunk } from '@/store/thunks';
import { formatTimestamp } from '@/packages/ptasks/format-timestamp';

export const RunsPage = () => {
  const dispatch = useAppDispatch();
  const runs = useAppSelector((state) => state.runs);
  const schedulerBuilder = useAppSelector((state) => state.schedulerBuilder);

  useEffect(() => {
    void dispatch(getAllRunsThunk(200));
  }, [dispatch]);

  const sortedRuns = useMemo(
    () => Object.values(runs).sort((a, b) => b.finishedAt.localeCompare(a.finishedAt)),
    [runs],
  );

  const handleRefresh = () => {
    void dispatch(getAllRunsThunk(200));
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div>
          <h1 className={styles.title}>Run history</h1>
          <p className={styles.subtitle}>Recent scheduler executions.</p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={schedulerBuilder.isLoadingRuns}
          className={styles.refreshButton(schedulerBuilder.isLoadingRuns)}
        >
          {schedulerBuilder.isLoadingRuns ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {schedulerBuilder.lastError ? (
        <p className={styles.error} role="alert">
          {schedulerBuilder.lastError}
        </p>
      ) : null}

      {sortedRuns.length === 0 ? (
        <p className={styles.empty}>No runs yet.</p>
      ) : (
        <div className={styles.wrapper}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.headerRow}>
                <th className={styles.headerCell}>Task</th>
                <th className={styles.headerCell}>Status</th>
                <th className={styles.headerCell}>Trigger</th>
                <th className={styles.headerCell}>Started</th>
                <th className={styles.headerCell}>Duration</th>
                <th className={styles.headerCell}>HTTP</th>
              </tr>
            </thead>
            <tbody>
              {sortedRuns.map((run) => (
                <tr key={run.id} className={styles.row}>
                  <td className={styles.cell}>{run.taskName}</td>
                  <td className={styles.cell}>
                    <span className={styles.statusBadge(run.status)}>{run.status}</span>
                  </td>
                  <td className={styles.cellMuted}>{run.trigger}</td>
                  <td className={styles.cellMuted}>{formatTimestamp(run.startedAt)}</td>
                  <td className={styles.cellMuted}>{run.durationMs}ms</td>
                  <td className={styles.cellMuted}>{run.httpStatus ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: `space-y-4`,
  toolbar: `flex flex-wrap items-start justify-between gap-4`,
  title: `text-xl font-semibold text-gray-900`,
  subtitle: `mt-1 text-sm text-gray-600`,
  refreshButton: (disabled: boolean) =>
    `rounded-md px-4 py-2 text-sm font-medium transition-colors ${
      disabled
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
    }`,
  error: `rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700`,
  empty: `rounded-lg border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-sm text-gray-600`,
  wrapper: `overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm`,
  table: `w-full border-collapse text-left`,
  headerRow: `border-b border-gray-200 bg-gray-50`,
  headerCell: `px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500`,
  row: `border-b border-gray-100 hover:bg-gray-50/80`,
  cell: `px-3 py-3 text-sm text-gray-900`,
  cellMuted: `px-3 py-3 text-sm text-gray-600`,
  statusBadge: (status: string) => {
    if (status === 'failed') {
      return 'inline-flex rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700';
    }
    if (status === 'success') {
      return 'inline-flex rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700';
    }
    return 'inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600';
  },
};
