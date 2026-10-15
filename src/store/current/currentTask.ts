import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ScheduledTask } from '@/model';

export const EMPTY_SCHEDULED_TASK: ScheduledTask = {
  id: '',
  name: '',
  workerProjectId: '',
  worker: {
    expressRepoName: '',
    defaultPort: 0,
    healthPath: '/api/health',
    startCommand: 'npm start',
  },
  request: {
    method: 'GET',
    path: '/',
  },
  schedule: {
    kind: 'interval',
    intervalMinutes: 15,
    timezone: 'America/New_York',
    weekdays: [1, 2, 3, 4, 5],
    hourStart: 8,
    hourEnd: 17,
  },
  lifecycle: 'start_if_needed_stop_if_started',
  enabled: false,
  expressDir: null,
  port: 0,
  nvmSh: null,
  nextRunAt: null,
  lastRunAt: null,
  lastRunStatus: null,
};

export const currentTaskSlice = createSlice({
  name: 'currentTask',
  initialState: EMPTY_SCHEDULED_TASK,
  reducers: {
    setCurrentTask: (_state, action: PayloadAction<ScheduledTask>) => action.payload,
    patchCurrentTask: (state, action: PayloadAction<Partial<ScheduledTask>>) => {
      const patch = action.payload;
      return {
        ...state,
        ...patch,
        worker: patch.worker ? { ...state.worker, ...patch.worker } : state.worker,
        request: patch.request ? { ...state.request, ...patch.request } : state.request,
        schedule: patch.schedule ? { ...state.schedule, ...patch.schedule } : state.schedule,
      };
    },
    reset: () => EMPTY_SCHEDULED_TASK,
  },
});

export const CurrentTaskActions = currentTaskSlice.actions;
export const currentTaskReducer = currentTaskSlice.reducer;
