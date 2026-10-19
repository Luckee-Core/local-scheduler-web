import type { ScheduledTask, TaskSchedule } from '@/model';
import { formatHourDivider } from './format-task-schedule';

export type TaskHourBucket = {
  hour: number;
  hourLabel: string;
  tasks: ScheduledTask[];
};

export type ProjectTaskGroup = {
  projectId: string;
  projectName: string;
  buckets: TaskHourBucket[];
};

const scheduleSortHour = (schedule: TaskSchedule): number => {
  if (schedule.kind === 'daily') {
    return schedule.hour;
  }
  return schedule.hourStart;
};

const scheduleSortMinute = (schedule: TaskSchedule): number => {
  if (schedule.kind === 'daily') {
    return schedule.minute;
  }
  return 0;
};

const compareTasksInBucket = (a: ScheduledTask, b: ScheduledTask): number => {
  const minuteDelta =
    scheduleSortMinute(a.schedule) - scheduleSortMinute(b.schedule);
  if (minuteDelta !== 0) {
    return minuteDelta;
  }
  return a.name.localeCompare(b.name);
};

const projectNameFor = (task: ScheduledTask): string =>
  task.schedulerProject?.name ?? task.schedulerProjectRepoId;

const compareTasksInBucketAll = (a: ScheduledTask, b: ScheduledTask): number => {
  const projectDelta = projectNameFor(a).localeCompare(projectNameFor(b));
  if (projectDelta !== 0) {
    return projectDelta;
  }
  return compareTasksInBucket(a, b);
};

/**
 * Groups tasks by schedule start hour (single flat list).
 */
export const groupTasksByHour = (tasks: ScheduledTask[], allProjects = false): TaskHourBucket[] => {
  const byHour = new Map<number, ScheduledTask[]>();
  for (const task of tasks) {
    const hour = scheduleSortHour(task.schedule);
    const bucket = byHour.get(hour) ?? [];
    bucket.push(task);
    byHour.set(hour, bucket);
  }

  const sorter = allProjects ? compareTasksInBucketAll : compareTasksInBucket;

  return [...byHour.entries()]
    .sort(([hourA], [hourB]) => hourA - hourB)
    .map(([hour, bucketTasks]) => ({
      hour,
      hourLabel: formatHourDivider(hour),
      tasks: [...bucketTasks].sort(sorter),
    }));
};

export type ProjectTab = {
  projectId: string;
  projectName: string;
};

/**
 * Distinct business projects for dashboard tabs (sorted by name).
 */
export const listProjectTabs = (tasks: ScheduledTask[]): ProjectTab[] => {
  const map = new Map<string, string>();
  for (const task of tasks) {
    const projectId = task.schedulerProject?.id ?? task.schedulerProjectRepoId;
    if (!map.has(projectId)) {
      map.set(projectId, projectNameFor(task));
    }
  }
  return [...map.entries()]
    .map(([projectId, projectName]) => ({ projectId, projectName }))
    .sort((a, b) => a.projectName.localeCompare(b.projectName));
};

/**
 * Groups tasks by business project, then by schedule hour for dashboard layout.
 */
export const groupTasksForDashboard = (tasks: ScheduledTask[]): ProjectTaskGroup[] => {
  const byProject = new Map<string, ScheduledTask[]>();

  for (const task of tasks) {
    const projectId = task.schedulerProject?.id ?? task.schedulerProjectRepoId;
    const list = byProject.get(projectId) ?? [];
    list.push(task);
    byProject.set(projectId, list);
  }

  const groups: ProjectTaskGroup[] = [];

  for (const [projectId, projectTasks] of byProject) {
    const projectName =
      projectTasks[0]?.schedulerProject?.name ?? projectId;

    const buckets = groupTasksByHour(projectTasks);

    groups.push({ projectId, projectName, buckets });
  }

  return groups.sort((a, b) => a.projectName.localeCompare(b.projectName));
};
