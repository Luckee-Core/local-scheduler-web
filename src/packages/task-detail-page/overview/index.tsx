'use client';

import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppSelector } from '@/store';
import { TaskDetailSummaryActions } from '../actions';

export const TaskDetailOverview = () => {
  const currentTask = useAppSelector((state) => state.currentTask);
  const tasks = useAppSelector((state) => state.tasks);
  const schedulerBuilder = useAppSelector((state) => state.schedulerBuilder);

  const task = tasks[currentTask.id] ?? currentTask;
  const isRunning = schedulerBuilder.runningTaskIds.includes(task.id);
  const isProduction = task.schedulerProjectRepo.executionType === 'production';

  const statusLabel = isRunning ? 'Running…' : task.lastRunStatus ?? 'Idle';

  const railwayUrl = task.schedulerProjectRepo.productionBaseUrl ?? '';

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div>
          <h1 className={detailPageStyles.panelTitle}>{task.name}</h1>
          <p className={detailPageStyles.panelSubtitle}>Task ID: {task.id}</p>
        </div>
        <TaskDetailSummaryActions />
      </div>

      <dl className={`${detailPageStyles.panelBody} ${styles.grid}`}>
        <div className={styles.row}>
          <dt className={detailPageStyles.fieldLabel}>Display name</dt>
          <dd className={detailPageStyles.fieldValue}>{task.name}</dd>
        </div>
        <div className={styles.row}>
          <dt className={detailPageStyles.fieldLabel}>Worker project id</dt>
          <dd className={styles.valueMono}>{task.workerProjectId}</dd>
        </div>

        <div className={styles.row}>
          <dt className={detailPageStyles.fieldLabel}>Business</dt>
          <dd className={detailPageStyles.fieldValue}>{task.schedulerProject.name}</dd>
        </div>
        <div className={styles.row}>
          <dt className={detailPageStyles.fieldLabel}>Repo</dt>
          <dd className={styles.valueMono}>{task.schedulerProjectRepoId}</dd>
        </div>

        <div className={styles.row}>
          <dt className={detailPageStyles.fieldLabel}>Environment</dt>
          <dd className={styles.valueRow}>
            <span className={styles.typeBadge(isProduction)}>
              {isProduction ? 'Production' : 'Local'}
            </span>
          </dd>
        </div>
        <div className={styles.row}>
          <dt className={detailPageStyles.fieldLabel}>Status</dt>
          <dd className={detailPageStyles.fieldValue}>
            <span className={styles.statusBadge(isRunning, task.lastRunStatus)}>{statusLabel}</span>
          </dd>
        </div>

        <div className={styles.rowFull}>
          <dt className={detailPageStyles.fieldLabel}>Railway URL</dt>
          <dd className={styles.fieldBlock}>
            <input
              type="url"
              className={detailPageStyles.formInput}
              value={isProduction ? railwayUrl : ''}
              placeholder={isProduction ? '—' : 'Not used for local workers'}
              readOnly
              aria-readonly="true"
            />
          </dd>
        </div>

        {!isProduction ? (
          <div className={styles.rowFull}>
            <dt className={detailPageStyles.fieldLabel}>Express path</dt>
            <dd className={styles.valueMono}>{task.expressDir ?? '—'}</dd>
          </div>
        ) : null}

        <div className={styles.row}>
          <dt className={detailPageStyles.fieldLabel}>Lifecycle</dt>
          <dd className={styles.valueMono}>{task.lifecycle}</dd>
        </div>
      </dl>
    </section>
  );
};

const styles = {
  grid: `
    grid gap-4 sm:grid-cols-2
  `,
  row: `
    space-y-1
  `,
  rowFull: `
    space-y-1 sm:col-span-2
  `,
  fieldBlock: `
    max-w-xl
  `,
  valueRow: `
    text-sm text-gray-900 flex flex-wrap items-center gap-2
  `,
  valueMono: `
    text-xs font-mono text-gray-700 break-all
  `,
  typeBadge: (production: boolean) =>
    production
      ? 'inline-flex rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-medium text-violet-800'
      : 'inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700',
  statusBadge: (running: boolean, lastStatus: string | null) => {
    if (running) {
      return 'inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700';
    }
    if (lastStatus === 'failed') {
      return 'inline-flex rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-700';
    }
    if (lastStatus === 'success') {
      return 'inline-flex rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700';
    }
    return 'inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600';
  },
};
