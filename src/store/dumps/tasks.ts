import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ScheduledTask } from '@/model';

type TasksState = Record<string, ScheduledTask>;

const initialState: TasksState = {};

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (_state, action: PayloadAction<ScheduledTask[]>) => {
      const next: TasksState = {};
      for (const task of action.payload) {
        next[task.id] = task;
      }
      return next;
    },
    upsertTask: (state, action: PayloadAction<ScheduledTask>) => {
      state[action.payload.id] = action.payload;
    },
    removeTask: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
  },
});

export const TasksActions = tasksSlice.actions;
export const tasksReducer = tasksSlice.reducer;
