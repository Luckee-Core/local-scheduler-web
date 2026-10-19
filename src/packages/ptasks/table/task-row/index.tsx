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
import { listTableStyles } from '@/components/list-table-styles';
import { ptasksTableGridColsClass } from '../task-grid-columns';

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
    `grid w-full grid-cols-1 gap-2 border-b border-gray-200 px-3 py-3 text-left transition-colors ${ptasksTableGridColsClass} sm:items-center sm:gap-x-4 sm:gap-y-0 ${listTableStyles.row} ${
      muted ? 'opacity-60' : ''
    }`,
  cellName: `
    text-xs font-medium text-gray-900
  `,
  cellFrequency: `
    text-xs text-gray-600
  `,
  cellActive: (active: boolean) =>
    `text-xs font-medium ${active ? 'text-green-700' : 'text-gray-500'}`,
  cellLastRun: `
    text-xs text-gray-600 tabular-nums whitespace-nowrap sm:text-right
  `,
};
