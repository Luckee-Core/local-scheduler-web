'use client';

import type { TaskHourBucket } from '../../group-tasks-for-dashboard';
import { PtasksTaskRow } from '../task-row';

type LatestRun = {
  finishedAt: string;
  status: string;
};

type PtasksTaskTimelineProps = {
  buckets: TaskHourBucket[];
  latestRunByTaskId: Map<string, LatestRun>;
  showProjectOnTask: boolean;
};

export const PtasksTaskTimeline = (props: PtasksTaskTimelineProps) => {
  const { buckets, latestRunByTaskId, showProjectOnTask } = props;

  return (
    <div className={styles.timeline}>
      {buckets.map((bucket) => (
        <div key={bucket.hour} className={styles.hourBlock}>
          <div className={styles.hourDivider}>
            <span className={styles.hourLabel}>{bucket.hourLabel}</span>
            <span className={styles.hourLine} aria-hidden="true" />
          </div>
          <ul className={styles.list}>
            {bucket.tasks.map((task) => {
              const latest = latestRunByTaskId.get(task.id);
              return (
                <li key={task.id}>
                  <PtasksTaskRow
                    task={task}
                    lastRunAt={latest?.finishedAt ?? task.lastRunAt}
                    showProject={showProjectOnTask}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

const styles = {
  timeline: `
    space-y-5
  `,
  hourBlock: `
    space-y-1
  `,
  hourDivider: `
    flex items-center gap-3
  `,
  hourLabel: `
    shrink-0 text-xs font-semibold uppercase tracking-wide text-gray-500
  `,
  hourLine: `
    h-px flex-1 bg-gray-200
  `,
  list: `
    m-0 list-none space-y-0 p-0
  `,
};
