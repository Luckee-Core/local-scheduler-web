'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TASKS_PATH } from '@/config/routes';
import { useAppDispatch, useAppSelector } from '@/store';
import { BreadcrumbBuilderActions } from '@/store/builders/breadcrumbBuilder';
import { getAllRunsThunk, getAllTasksThunk } from '@/store/thunks';
import { TaskDetailOverview } from './overview';
import { TaskDetailEditForm } from './edit-form';
import { TaskDetailActions } from './actions';
import { TaskDetailRunHistory } from './run-history';
import { TaskDetailBuilderActions } from '@/store/builders/taskDetailBuilder';

/**
 * Task detail workspace — reads `currentTask` (ADR 008).
 */
export const TaskDetailPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentTask = useAppSelector((state) => state.currentTask);

  useEffect(() => {
    void dispatch(getAllTasksThunk());
    void dispatch(getAllRunsThunk(200));
  }, [dispatch]);

  useEffect(() => {
    dispatch(TaskDetailBuilderActions.resetSaveState());
  }, [currentTask.id, dispatch]);

  useEffect(() => {
    if (!currentTask.id) {
      dispatch(BreadcrumbBuilderActions.reset());
      return;
    }

    dispatch(
      BreadcrumbBuilderActions.setTrail({
        base: { label: 'Tasks', href: TASKS_PATH },
        segments: [{ kind: 'plainText', label: currentTask.name }],
      }),
    );

    return () => {
      dispatch(BreadcrumbBuilderActions.reset());
    };
  }, [currentTask.id, currentTask.name, dispatch]);

  useEffect(() => {
    if (!currentTask.id) {
      router.replace(TASKS_PATH);
    }
  }, [currentTask.id, router]);

  if (!currentTask.id) {
    return <p className={styles.message}>Loading task…</p>;
  }

  return (
    <div className={styles.page}>
      <TaskDetailActions />
      <TaskDetailOverview />
      <TaskDetailEditForm />
      <TaskDetailRunHistory />
    </div>
  );
};

const styles = {
  page: `
    w-full space-y-6
  `,
  message: `
    text-gray-600
  `,
};
