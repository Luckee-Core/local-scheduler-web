import { combineReducers } from '@reduxjs/toolkit';
import { breadcrumbBuilderReducer } from './builders/breadcrumbBuilder';
import { schedulerBuilderReducer } from './builders/schedulerBuilder';
import { taskDetailBuilderReducer } from './builders/taskDetailBuilder';
import { currentTaskReducer } from './current/currentTask';
import { tasksReducer } from './dumps/tasks';
import { runsReducer } from './dumps/runs';

export const rootReducer = combineReducers({
  breadcrumbBuilder: breadcrumbBuilderReducer,
  schedulerBuilder: schedulerBuilderReducer,
  taskDetailBuilder: taskDetailBuilderReducer,
  currentTask: currentTaskReducer,
  tasks: tasksReducer,
  runs: runsReducer,
});
