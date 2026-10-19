'use client';

import { useEffect, useMemo } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { listTableStyles } from '@/components/list-table-styles';
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
    <div className={detailPageStyles.page}>
      <div className={styles.toolbar}>
        <div>
          <h1 className={detailPageStyles.pageTitle}>Run history</h1>
          <p className={detailPageStyles.pageSubtitle}>Recent scheduler executions.</p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={schedulerBuilder.isLoadingRuns}
          className={detailPageStyles.secondaryButton}
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
        <div className={listTableStyles.wrapper}>
          <div className={detailPageStyles.emptyState}>
            <p className={listTableStyles.emptyText}>No runs yet.</p>
          </div>
        </div>
      ) : (
        <div className={listTableStyles.wrapper}>
          <div className={listTableStyles.scroll}>
            <table className={listTableStyles.table}>
              <thead>
                <tr>
                  <th className={listTableStyles.th}>Task</th>
                  <th className={listTableStyles.th}>Status</th>
                  <th className={listTableStyles.th}>Trigger</th>
                  <th className={listTableStyles.th}>Started</th>
                  <th className={listTableStyles.th}>Duration</th>
                  <th className={listTableStyles.th}>HTTP</th>
                </tr>
              </thead>
              <tbody>
                {sortedRuns.map((run) => (
                  <tr key={run.id} className={listTableStyles.rowStatic}>
                    <td className={listTableStyles.cell}>{run.taskName}</td>
                    <td className={listTableStyles.cell}>
                      <span className={styles.statusBadge(run.status)}>{run.status}</span>
                    </td>
                    <td className={listTableStyles.cellMuted}>{run.trigger}</td>
                    <td className={listTableStyles.cellMuted}>{formatTimestamp(run.startedAt)}</td>
                    <td className={listTableStyles.cellMuted}>{run.durationMs}ms</td>
                    <td className={listTableStyles.cellMuted}>{run.httpStatus ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
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
  statusBadge: (status: string) => {
    if (status === 'failed') {
      return 'inline-flex rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-700';
    }
    if (status === 'success') {
      return 'inline-flex rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700';
    }
    return 'inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600';
  },
};
