'use client';

import Link from 'next/link';
import { useCallback } from 'react';
import { TASKS_PATH } from '@/config/routes';
import { useAppDispatch, useAppSelector } from '@/store';
import { patchTaskEnabledThunk, runTaskNowThunk } from '@/store/thunks';

export const TaskDetailActions = () => {
  const dispatch = useAppDispatch();
  const currentTask = useAppSelector((state) => state.currentTask);
  const tasks = useAppSelector((state) => state.tasks);
  const schedulerBuilder = useAppSelector((state) => state.schedulerBuilder);

  const task = tasks[currentTask.id] ?? currentTask;
  const isRunning = schedulerBuilder.runningTaskIds.includes(task.id);

  const handleToggleEnabled = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      void dispatch(patchTaskEnabledThunk(task.id, event.target.checked));
    },
    [dispatch, task.id],
  );

  const handleRunNow = useCallback(() => {
    void dispatch(runTaskNowThunk(task.id));
  }, [dispatch, task.id]);

  return (
    <section className={styles.section}>
      <div className={styles.toolbar}>
        <Link href={TASKS_PATH} className={styles.backLink}>
          ← Back to tasks
        </Link>
        <div className={styles.actions}>
          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={task.enabled}
              onChange={handleToggleEnabled}
              className={styles.checkbox}
            />
            {task.enabled ? 'Enabled' : 'Disabled'}
          </label>
          <button
            type="button"
            onClick={handleRunNow}
            disabled={isRunning}
            className={styles.runButton(isRunning)}
          >
            {isRunning ? 'Running…' : 'Run now'}
          </button>
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: `
    rounded-lg border border-gray-200 bg-white px-6 py-4 shadow-sm
  `,
  toolbar: `
    flex flex-wrap items-center justify-between gap-4
  `,
  backLink: `
    text-sm font-medium text-gray-600 hover:text-gray-900
  `,
  actions: `
    flex flex-wrap items-center gap-4
  `,
  toggleLabel: `
    inline-flex items-center gap-2 text-sm cursor-pointer text-gray-700
  `,
  checkbox: `
    rounded border-gray-300
  `,
  runButton: (disabled: boolean) =>
    `rounded-md px-4 py-2 text-sm font-medium transition-colors ${
      disabled
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
        : 'bg-orange-500 text-white hover:bg-orange-600 cursor-pointer'
    }`,
};
