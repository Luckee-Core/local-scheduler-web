'use client';

import { useCallback, useMemo } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { listTableStyles } from '@/components/list-table-styles';
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
    <section className={listTableStyles.wrapperOverflowVisible}>
      <div className={detailPageStyles.panelHeader}>
        <h2 className={detailPageStyles.panelTitle}>Run history</h2>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={schedulerBuilder.isLoadingRuns}
          className={detailPageStyles.secondaryButton}
        >
          {schedulerBuilder.isLoadingRuns ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {taskRuns.length === 0 ? (
        <div className={detailPageStyles.emptyState}>
          <p className={listTableStyles.emptyText}>No runs recorded for this task yet.</p>
        </div>
      ) : (
        <div className={listTableStyles.scroll}>
          <table className={listTableStyles.table}>
            <thead>
              <tr>
                <th className={listTableStyles.th}>Status</th>
                <th className={listTableStyles.th}>Trigger</th>
                <th className={listTableStyles.th}>Started</th>
                <th className={listTableStyles.th}>Duration</th>
                <th className={listTableStyles.th}>HTTP</th>
                <th className={listTableStyles.th}>Summary</th>
              </tr>
            </thead>
            <tbody>
              {taskRuns.map((run) => (
                <tr key={run.id} className={listTableStyles.rowStatic}>
                  <td className={listTableStyles.cell}>
                    <span className={styles.statusBadge(run.status)}>{run.status}</span>
                  </td>
                  <td className={listTableStyles.cellMuted}>{run.trigger}</td>
                  <td className={listTableStyles.cellMuted}>{formatTimestamp(run.startedAt)}</td>
                  <td className={listTableStyles.cellMuted}>{run.durationMs}ms</td>
                  <td className={listTableStyles.cellMuted}>{run.httpStatus ?? '—'}</td>
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
  cellSummary: `
    px-3 py-2.5 text-xs font-mono text-gray-700 whitespace-pre-wrap break-words align-top
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
