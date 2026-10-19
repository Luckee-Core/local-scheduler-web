'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TASKS_PATH } from '@/config/routes';
import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import { patchTaskEnabledThunk, runTaskNowThunk, deleteTaskThunk } from '@/store/thunks';

export const TaskDetailSummaryActions = () => {
  const router = useRouter();
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

  const handleDelete = useCallback(async () => {
    if (!window.confirm(`Delete task "${task.name}"?`)) {
      return;
    }
    const status = await dispatch(deleteTaskThunk(task.id));
    if (status === 200) {
      router.push(TASKS_PATH);
    }
  }, [dispatch, router, task.id, task.name]);

  return (
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
        className={detailPageStyles.primaryButton}
      >
        {isRunning ? 'Running…' : 'Run now'}
      </button>
      <button type="button" onClick={() => void handleDelete()} className={detailPageStyles.dangerButton}>
        Delete
      </button>
    </div>
  );
};

const styles = {
  actions: `
    flex flex-wrap items-center gap-2
  `,
  toggleLabel: `
    inline-flex items-center gap-2 text-xs cursor-pointer text-gray-700 mr-1
  `,
  checkbox: `
    rounded border-gray-300 cursor-pointer
  `,
};
