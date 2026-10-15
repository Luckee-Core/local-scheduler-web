'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/store';
import { formatTimestamp } from '@/packages/ptasks/format-timestamp';

export const TaskDetailOverview = () => {
  const currentTask = useAppSelector((state) => state.currentTask);
  const tasks = useAppSelector((state) => state.tasks);
  const schedulerBuilder = useAppSelector((state) => state.schedulerBuilder);

  const task = tasks[currentTask.id] ?? currentTask;
  const isRunning = schedulerBuilder.runningTaskIds.includes(task.id);

  const workerLabel = useMemo(() => {
    if (task.expressDir) {
      return `${task.workerProjectId} · ${task.worker.expressRepoName}`;
    }
    return `${task.workerProjectId} (no path configured)`;
  }, [task]);

  const statusLabel = isRunning ? 'Running…' : task.lastRunStatus ?? 'Idle';

  return (
    <section className={styles.section}>
      <h1 className={styles.title}>{currentTask.name || task.name}</h1>
      <p className={styles.subtitle}>Task ID: {task.id}</p>

      <dl className={styles.grid}>
        <div className={styles.row}>
          <dt className={styles.label}>Worker</dt>
          <dd className={styles.value}>{workerLabel}</dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.label}>Express path</dt>
          <dd className={styles.valueMono}>{task.expressDir ?? '—'}</dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.label}>Resolved port</dt>
          <dd className={styles.value}>{task.port}</dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.label}>Last run</dt>
          <dd className={styles.value}>{formatTimestamp(task.lastRunAt)}</dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.label}>Next run</dt>
          <dd className={styles.value}>{formatTimestamp(task.nextRunAt)}</dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.label}>Status</dt>
          <dd className={styles.value}>
            <span className={styles.statusBadge(isRunning, task.lastRunStatus)}>{statusLabel}</span>
          </dd>
        </div>
      </dl>
    </section>
  );
};

const styles = {
  section: `
    rounded-lg border border-gray-200 bg-white p-6 shadow-sm
  `,
  title: `
    text-xl font-semibold text-gray-900
  `,
  subtitle: `
    mt-1 text-sm text-gray-500 font-mono
  `,
  grid: `
    mt-6 grid gap-4 sm:grid-cols-2
  `,
  row: `
    space-y-1
  `,
  label: `
    text-xs font-semibold uppercase tracking-wide text-gray-500
  `,
  value: `
    text-sm text-gray-900
  `,
  valueMono: `
    text-xs font-mono text-gray-700 break-all
  `,
  statusBadge: (running: boolean, lastStatus: string | null) => {
    if (running) {
      return 'inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700';
    }
    if (lastStatus === 'failed') {
      return 'inline-flex rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700';
    }
    if (lastStatus === 'success') {
      return 'inline-flex rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700';
    }
    return 'inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600';
  },
};
