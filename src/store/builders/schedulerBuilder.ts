import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type SchedulerBuilderState = {
  isLoadingTasks: boolean;
  isLoadingRuns: boolean;
  runningTaskIds: string[];
  lastError: string | null;
};

const initialState: SchedulerBuilderState = {
  isLoadingTasks: false,
  isLoadingRuns: false,
  runningTaskIds: [],
  lastError: null,
};

export const schedulerBuilderSlice = createSlice({
  name: 'schedulerBuilder',
  initialState,
  reducers: {
    setLoadingTasks: (state, action: PayloadAction<boolean>) => {
      state.isLoadingTasks = action.payload;
    },
    setLoadingRuns: (state, action: PayloadAction<boolean>) => {
      state.isLoadingRuns = action.payload;
    },
    addRunningTask: (state, action: PayloadAction<string>) => {
      if (!state.runningTaskIds.includes(action.payload)) {
        state.runningTaskIds.push(action.payload);
      }
    },
    removeRunningTask: (state, action: PayloadAction<string>) => {
      state.runningTaskIds = state.runningTaskIds.filter((id) => id !== action.payload);
    },
    setLastError: (state, action: PayloadAction<string | null>) => {
      state.lastError = action.payload;
    },
  },
});

export const SchedulerBuilderActions = schedulerBuilderSlice.actions;
export const schedulerBuilderReducer = schedulerBuilderSlice.reducer;
