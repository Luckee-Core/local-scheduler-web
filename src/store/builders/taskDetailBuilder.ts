import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TaskConfigurationSectionKey } from './task-detail-configuration-section';

export type TaskDetailSaveStatus = 'idle' | 'saving' | 'success' | 'error';

type TaskDetailBuilderState = {
  saveError: string | null;
  saveStatus: TaskDetailSaveStatus;
  editingConfigurationSection: TaskConfigurationSectionKey | null;
};

const initialState: TaskDetailBuilderState = {
  saveError: null,
  saveStatus: 'idle',
  editingConfigurationSection: null,
};

export const taskDetailBuilderSlice = createSlice({
  name: 'taskDetailBuilder',
  initialState,
  reducers: {
    setSaveError: (state, action: PayloadAction<string | null>) => {
      state.saveError = action.payload;
    },
    setSaveStatus: (state, action: PayloadAction<TaskDetailSaveStatus>) => {
      state.saveStatus = action.payload;
    },
    resetSaveState: (state) => {
      state.saveError = null;
      state.saveStatus = 'idle';
    },
    setEditingConfigurationSection: (
      state,
      action: PayloadAction<TaskConfigurationSectionKey | null>,
    ) => {
      state.editingConfigurationSection = action.payload;
    },
    resetConfigurationUi: (state) => {
      state.saveError = null;
      state.saveStatus = 'idle';
      state.editingConfigurationSection = null;
    },
  },
});

export const TaskDetailBuilderActions = taskDetailBuilderSlice.actions;
export const taskDetailBuilderReducer = taskDetailBuilderSlice.reducer;
