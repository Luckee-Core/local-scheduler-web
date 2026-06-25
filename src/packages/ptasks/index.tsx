'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store';
import { getAllRunsThunk, getAllTasksThunk } from '@/store/thunks';
import { PtasksDashboard } from './dashboard';

export const PtasksPage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(getAllTasksThunk());
    void dispatch(getAllRunsThunk());
  }, [dispatch]);

  return <PtasksDashboard />;
};
