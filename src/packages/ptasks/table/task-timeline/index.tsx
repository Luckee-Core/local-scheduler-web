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
    flex items-center gap-3 px-3 pt-4 pb-1
  `,
  hourLabel: `
    shrink-0 text-xs font-semibold text-gray-600 tabular-nums
  `,
  hourLine: `
    h-px flex-1 bg-gray-300
  `,
  list: `
    m-0 list-none space-y-0 p-0
  `,
};
