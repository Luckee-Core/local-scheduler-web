'use client';

import { useMemo } from 'react';
import type { ScheduledTask } from '@/model';
import { useAppSelector } from '@/store';
import { PtasksTableRow } from './row';

export const PtasksTable = () => {
  const tasks = useAppSelector((state) => state.tasks);
  const runs = useAppSelector((state) => state.runs);
  const schedulerBuilder = useAppSelector((state) => state.schedulerBuilder);

  const sortedTasks = useMemo(
    () =>
      Object.values(tasks).sort((a, b) => a.name.localeCompare(b.name)),
    [tasks],
  );

  const latestRunByTaskId = useMemo(() => {
    const map = new Map<string, { finishedAt: string; status: string }>();
    for (const run of Object.values(runs)) {
      const existing = map.get(run.taskId);
      if (!existing || run.finishedAt > existing.finishedAt) {
        map.set(run.taskId, { finishedAt: run.finishedAt, status: run.status });
      }
    }
    return map;
  }, [runs]);

  if (schedulerBuilder.isLoadingTasks && sortedTasks.length === 0) {
    return <p className={styles.empty}>Loading tasks…</p>;
  }

  if (sortedTasks.length === 0) {
    return (
      <p className={styles.empty}>
        No scheduled tasks found. Add entries to{' '}
        <code className={styles.code}>data/tasks.registry.json</code> on the express server.
      </p>
    );
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th className={styles.headerCell}>Name</th>
            <th className={styles.headerCell}>Worker</th>
            <th className={styles.headerCell}>Endpoint</th>
            <th className={styles.headerCell}>Schedule</th>
            <th className={styles.headerCell}>Enabled</th>
            <th className={styles.headerCell}>Last run</th>
            <th className={styles.headerCell}>Next run</th>
            <th className={styles.headerCell}>Status</th>
            <th className={styles.headerCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedTasks.map((task: ScheduledTask) => {
            const latest = latestRunByTaskId.get(task.id);
            return (
              <PtasksTableRow
                key={task.id}
                task={task}
                lastRunAt={latest?.finishedAt ?? task.lastRunAt}
                lastRunStatus={latest?.status ?? task.lastRunStatus}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  wrapper: `
    overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm
  `,
  table: `
    w-full min-w-[960px] border-collapse text-left
  `,
  headerRow: `
    border-b border-gray-200 bg-gray-50
  `,
  headerCell: `
    px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500
  `,
  empty: `
    rounded-lg border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-sm text-gray-600
  `,
  code: `
    rounded bg-gray-100 px-1 py-0.5 font-mono text-xs
  `,
};
