import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SchedulerRun } from '@/model';

type RunsState = Record<string, SchedulerRun>;

const initialState: RunsState = {};

export const runsSlice = createSlice({
  name: 'runs',
  initialState,
  reducers: {
    setRuns: (_state, action: PayloadAction<SchedulerRun[]>) => {
      const next: RunsState = {};
      for (const run of action.payload) {
        next[run.id] = run;
      }
      return next;
    },
    upsertRun: (state, action: PayloadAction<SchedulerRun>) => {
      state[action.payload.id] = action.payload;
    },
  },
});

export const RunsActions = runsSlice.actions;
export const runsReducer = runsSlice.reducer;
