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
    ? `${task.workerProjectId} · :${task.port}`
    : `${task.workerProjectId} (no path)`;

  const endpointLabel = `${task.request.method} ${task.request.path}`;
  const statusLabel = isRunning ? 'Running…' : lastRunStatus ?? 'Idle';

  return (
    <tr className={styles.row} onClick={handleRowClick}>
      <td className={styles.cell}>
        <div className={styles.linePrimary}>
          <span className={styles.name}>{task.name}</span>
          <span className={styles.statusBadge(isRunning, lastRunStatus)}>{statusLabel}</span>
        </div>
        <p className={styles.lineSecondary}>{workerLabel}</p>
        <p className={styles.lineMono}>{endpointLabel}</p>
      </td>
      <td className={styles.cell}>
        <p className={styles.lineSecondary}>{formatTaskSchedule(task.schedule)}</p>
      </td>
      <td className={styles.cell}>
        <p className={styles.runLine}>
          <span className={styles.runLabel}>Last</span>
          <span>{formatTimestamp(lastRunAt)}</span>
        </p>
        <p className={styles.runLine}>
          <span className={styles.runLabel}>Next</span>
          <span>{formatTimestamp(task.nextRunAt)}</span>
        </p>
      </td>
      <td className={styles.cellActions}>
        <label className={styles.toggleLabel} onClick={(event) => event.stopPropagation()}>
          <input
            type="checkbox"
            checked={task.enabled}
            onChange={handleToggleEnabled}
            className={styles.checkbox}
          />
          <span className={styles.toggleText}>{task.enabled ? 'On' : 'Off'}</span>
        </label>
        <button
          type="button"
          onClick={handleRunNow}
          disabled={isRunning}
          className={styles.runButton(isRunning)}
        >
          {isRunning ? '…' : 'Run'}
        </button>
      </td>
    </tr>
  );
};

const styles = {
  row: `
    border-b border-gray-100 hover:bg-gray-50/80 cursor-pointer align-top
  `,
  cell: `
    px-3 py-2.5 text-sm text-gray-900 align-top
  `,
  cellActions: `
    px-3 py-2.5 align-top whitespace-nowrap
  `,
  linePrimary: `
    flex flex-wrap items-center gap-2
  `,
  name: `
    font-medium text-orange-600
  `,
  lineSecondary: `
    mt-0.5 text-xs leading-snug text-gray-600
  `,
  lineMono: `
    mt-0.5 break-all font-mono text-xs leading-snug text-gray-500
  `,
  runLine: `
    text-xs text-gray-700
    first:mt-0
    [&+&]:mt-1
  `,
  runLabel: `
    mr-1.5 inline-block w-8 font-medium text-gray-400
  `,
  toggleLabel: `
    mb-2 flex items-center gap-1.5 text-xs cursor-pointer
  `,
  toggleText: `
    text-gray-600
  `,
  checkbox: `
    rounded border-gray-300
  `,
  statusBadge: (running: boolean, lastStatus: string | null) => {
    if (running) {
      return 'inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium leading-none text-blue-700';
    }
    if (lastStatus === 'failed') {
      return 'inline-flex rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium leading-none text-red-700';
    }
    if (lastStatus === 'success') {
      return 'inline-flex rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium leading-none text-green-700';
    }
    return 'inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium leading-none text-gray-600';
  },
  runButton: (disabled: boolean) =>
    `rounded px-2.5 py-1 text-xs font-medium transition-colors ${
      disabled
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
        : 'bg-orange-500 text-white hover:bg-orange-600 cursor-pointer'
    }`,
};
