'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { ScheduledTask } from '@/model';
import { TASK_DETAIL_PAGE_PATH } from '@/config/routes';
import { useAppDispatch, useAppSelector } from '@/store';
import { patchTaskEnabledThunk, runTaskNowThunk, setCurrentTaskThunk } from '@/store/thunks';
import { formatTaskSchedule } from '../../format-task-schedule';
import { formatTimestamp } from '../../format-timestamp';

type PtasksTableRowProps = {
  task: ScheduledTask;
  lastRunAt: string | null;
  lastRunStatus: string | null;
};

export const PtasksTableRow = (props: PtasksTableRowProps) => {
  const { task, lastRunAt, lastRunStatus } = props;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const schedulerBuilder = useAppSelector((state) => state.schedulerBuilder);

  const isRunning = schedulerBuilder.runningTaskIds.includes(task.id);

  const handleRowClick = useCallback(() => {
    void dispatch(setCurrentTaskThunk(task.id)).then((status) => {
      if (status === 200) {
        router.push(TASK_DETAIL_PAGE_PATH);
      }
    });
  }, [dispatch, router, task.id]);

  const handleToggleEnabled = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.stopPropagation();
      void dispatch(patchTaskEnabledThunk(task.id, event.target.checked));
    },
    [dispatch, task.id],
  );

  const handleRunNow = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      void dispatch(runTaskNowThunk(task.id));
    },
    [dispatch, task.id],
  );

  const workerLabel = task.expressDir
    ? `${task.workerProjectId} · ${task.worker.expressRepoName}`
    : `${task.workerProjectId} (no path)`;

  const statusLabel = isRunning ? 'Running…' : lastRunStatus ?? 'Idle';

  return (
    <tr className={styles.row} onClick={handleRowClick}>
      <td className={styles.cell}>
        <span className={styles.nameLink}>{task.name}</span>
      </td>
      <td className={styles.cellMuted}>{workerLabel}</td>
      <td className={styles.cellMono}>
        {task.request.method} {task.request.path}
      </td>
      <td className={styles.cellMuted}>{formatTaskSchedule(task.schedule)}</td>
      <td className={styles.cell}>
        <label className={styles.toggleLabel} onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={task.enabled}
            onChange={handleToggleEnabled}
            className={styles.checkbox}
          />
          {task.enabled ? 'On' : 'Off'}
        </label>
      </td>
      <td className={styles.cellMuted}>{formatTimestamp(lastRunAt)}</td>
      <td className={styles.cellMuted}>{formatTimestamp(task.nextRunAt)}</td>
      <td className={styles.cell}>
        <span className={styles.statusBadge(isRunning, lastRunStatus)}>{statusLabel}</span>
      </td>
      <td className={styles.cell}>
        <button
          type="button"
          onClick={handleRunNow}
          disabled={isRunning}
          className={styles.runButton(isRunning)}
        >
          {isRunning ? 'Running…' : 'Run now'}
        </button>
      </td>
    </tr>
  );
};

const styles = {
  row: `
    border-b border-gray-100 hover:bg-gray-50/80 cursor-pointer
  `,
  cell: `
    px-3 py-3 text-sm text-gray-900 align-top
  `,
  cellMuted: `
    px-3 py-3 text-sm text-gray-600 align-top
  `,
  cellMono: `
    px-3 py-3 text-xs font-mono text-gray-700 align-top max-w-xs truncate
  `,
  nameLink: `
    text-orange-600 hover:underline
  `,
  toggleLabel: `
    inline-flex items-center gap-2 text-sm cursor-pointer
  `,
  checkbox: `
    rounded border-gray-300
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
  runButton: (disabled: boolean) =>
    `rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
      disabled
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
        : 'bg-orange-500 text-white hover:bg-orange-600 cursor-pointer'
    }`,
};
