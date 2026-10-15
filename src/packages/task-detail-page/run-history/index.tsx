'use client';

import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { getAllRunsThunk } from '@/store/thunks';
import { formatTimestamp } from '@/packages/ptasks/format-timestamp';

export const TaskDetailRunHistory = () => {
  const dispatch = useAppDispatch();
  const currentTask = useAppSelector((state) => state.currentTask);
  const runs = useAppSelector((state) => state.runs);
  const schedulerBuilder = useAppSelector((state) => state.schedulerBuilder);

  const handleRefresh = useCallback(() => {
    void dispatch(getAllRunsThunk(200));
  }, [dispatch]);

  const taskRuns = useMemo(
    () =>
      Object.values(runs)
        .filter((run) => run.taskId === currentTask.id)
        .sort((a, b) => b.finishedAt.localeCompare(a.finishedAt)),
    [runs, currentTask.id],
  );

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Run history</h2>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={schedulerBuilder.isLoadingRuns}
          className={styles.refreshButton(schedulerBuilder.isLoadingRuns)}
        >
          {schedulerBuilder.isLoadingRuns ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {taskRuns.length === 0 ? (
        <p className={styles.empty}>No runs recorded for this task yet.</p>
      ) : (
        <div className={styles.wrapper}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.headerRow}>
                <th className={styles.headerCell}>Status</th>
                <th className={styles.headerCell}>Trigger</th>
                <th className={styles.headerCell}>Started</th>
                <th className={styles.headerCell}>Duration</th>
                <th className={styles.headerCell}>HTTP</th>
                <th className={styles.headerCell}>Summary</th>
              </tr>
            </thead>
            <tbody>
              {taskRuns.map((run) => (
                <tr key={run.id} className={styles.row}>
                  <td className={styles.cell}>
                    <span className={styles.statusBadge(run.status)}>{run.status}</span>
                  </td>
                  <td className={styles.cellMuted}>{run.trigger}</td>
                  <td className={styles.cellMuted}>{formatTimestamp(run.startedAt)}</td>
                  <td className={styles.cellMuted}>{run.durationMs}ms</td>
                  <td className={styles.cellMuted}>{run.httpStatus ?? '—'}</td>
                  <td className={styles.cellSummary}>{run.responseSummary ?? run.error ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

const styles = {
  section: `
    rounded-lg border border-gray-200 bg-white p-6 shadow-sm
  `,
  header: `
    flex flex-wrap items-center justify-between gap-4
  `,
  title: `
    text-lg font-semibold text-gray-900
  `,
  refreshButton: (disabled: boolean) =>
    `rounded-md px-4 py-2 text-sm font-medium transition-colors ${
      disabled
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
    }`,
  empty: `
    mt-4 text-sm text-gray-600
  `,
  wrapper: `
    mt-4 overflow-x-auto
  `,
  table: `
    w-full min-w-[800px] border-collapse text-left
  `,
  headerRow: `
    border-b border-gray-200 bg-gray-50
  `,
  headerCell: `
    px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500
  `,
  row: `
    border-b border-gray-100
  `,
  cell: `
    px-3 py-3 text-sm text-gray-900 whitespace-nowrap
  `,
  cellMuted: `
    px-3 py-3 text-sm text-gray-600 whitespace-nowrap
  `,
  cellSummary: `
    px-3 py-3 text-xs font-mono text-gray-700 max-w-2xl whitespace-pre-wrap break-words align-top
  `,
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
