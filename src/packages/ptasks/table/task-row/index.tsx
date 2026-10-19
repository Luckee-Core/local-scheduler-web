'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { ScheduledTask } from '@/model';
import { TASK_DETAIL_PAGE_PATH } from '@/config/routes';
import { useAppDispatch } from '@/store';
import { setCurrentTaskThunk } from '@/store/thunks';
import { formatTaskDisplayName } from '../../format-task-display-name';
import { formatTaskFrequency } from '../../format-task-frequency';
import { formatTimestamp } from '../../format-timestamp';

type PtasksTaskRowProps = {
  task: ScheduledTask;
  lastRunAt: string | null;
  showProject: boolean;
};

export const PtasksTaskRow = (props: PtasksTaskRowProps) => {
  const { task, lastRunAt, showProject } = props;
  const dispatch = useAppDispatch();
  const router = useRouter();

  const taskLabel = showProject
    ? task.name
    : formatTaskDisplayName(task);

  const handleRowClick = useCallback(() => {
    void dispatch(setCurrentTaskThunk(task.id)).then((status) => {
      if (status === 200) {
        router.push(TASK_DETAIL_PAGE_PATH);
      }
    });
  }, [dispatch, router, task.id]);

  return (
    <button type="button" className={styles.row(!task.enabled)} onClick={handleRowClick}>
      <span className={styles.cellName}>{taskLabel}</span>
      <span className={styles.cellFrequency}>{formatTaskFrequency(task.schedule)}</span>
      <span className={styles.cellActive(task.enabled)}>
        {task.enabled ? 'Active' : 'Inactive'}
      </span>
      <span className={styles.cellLastRun}>{formatTimestamp(lastRunAt)}</span>
    </button>
  );
};

const styles = {
  row: (muted: boolean) =>
    `grid w-full grid-cols-1 gap-1 border-b border-gray-100 px-1 py-2.5 text-left transition-colors sm:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_5rem_8rem] sm:items-center sm:gap-4 ${
      muted ? 'opacity-60' : ''
    } hover:bg-gray-50 cursor-pointer`,
  cellName: `
    text-sm font-medium text-gray-900
  `,
  cellFrequency: `
    text-sm text-gray-600
  `,
  cellActive: (active: boolean) =>
    `text-sm font-medium ${active ? 'text-green-700' : 'text-gray-500'}`,
  cellLastRun: `
    text-sm text-gray-600 sm:text-right
  `,
};
