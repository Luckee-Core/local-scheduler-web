'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { CurrentTaskActions } from '@/store/current/currentTask';
import { configurationFieldStyles } from '../configuration-field-styles';
import { ConfigurationReadFields } from '../configuration-read-fields';
import { ConfigurationSectionShell } from '../configuration-section-shell';

const TaskSectionEditFields = () => {
  const dispatch = useAppDispatch();
  const task = useAppSelector((state) => state.currentTask);

  return (
    <div className={configurationFieldStyles.fields}>
      <label className={configurationFieldStyles.label}>
        Display name
        <input
          className={configurationFieldStyles.input}
          value={task.name}
          onChange={(e) =>
            dispatch(CurrentTaskActions.patchCurrentTask({ name: e.target.value }))
          }
        />
      </label>
      <label className={configurationFieldStyles.label}>
        Worker project id
        <input
          className={configurationFieldStyles.input}
          value={task.workerProjectId}
          onChange={(e) =>
            dispatch(CurrentTaskActions.patchCurrentTask({ workerProjectId: e.target.value }))
          }
        />
      </label>
    </div>
  );
};

/**
 * Task identity configuration section.
 */
export const TaskConfigurationTaskSection = () => {
  const task = useAppSelector((state) => state.currentTask);

  if (!task.id) {
    return null;
  }

  const readView = (
    <ConfigurationReadFields
      fields={[
        { label: 'Display name', value: task.name },
        { label: 'Worker project id', value: task.workerProjectId },
      ]}
    />
  );

  return (
    <ConfigurationSectionShell
      sectionKey="task"
      title="Task"
      readView={readView}
      editView={<TaskSectionEditFields />}
    />
  );
};
