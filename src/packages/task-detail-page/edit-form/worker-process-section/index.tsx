'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { CurrentTaskActions } from '@/store/current/currentTask';
import { configurationFieldStyles } from '../configuration-field-styles';
import { ConfigurationReadFields } from '../configuration-read-fields';
import { ConfigurationSectionShell } from '../configuration-section-shell';

const WorkerProcessEditFields = () => {
  const dispatch = useAppDispatch();
  const task = useAppSelector((state) => state.currentTask);

  return (
    <div className={configurationFieldStyles.fields}>
      <div className={configurationFieldStyles.grid}>
        <label className={configurationFieldStyles.label}>
          Express repo name
          <input
            className={configurationFieldStyles.input}
            value={task.worker.expressRepoName}
            onChange={(e) =>
              dispatch(
                CurrentTaskActions.patchCurrentTask({
                  worker: { ...task.worker, expressRepoName: e.target.value },
                }),
              )
            }
          />
        </label>
        <label className={configurationFieldStyles.label}>
          Default port
          <input
            className={configurationFieldStyles.input}
            type="number"
            value={task.worker.defaultPort}
            onChange={(e) =>
              dispatch(
                CurrentTaskActions.patchCurrentTask({
                  worker: { ...task.worker, defaultPort: Number(e.target.value) },
                }),
              )
            }
          />
        </label>
      </div>
      <label className={configurationFieldStyles.label}>
        Health path
        <input
          className={configurationFieldStyles.input}
          value={task.worker.healthPath}
          onChange={(e) =>
            dispatch(
              CurrentTaskActions.patchCurrentTask({
                worker: { ...task.worker, healthPath: e.target.value },
              }),
            )
          }
        />
      </label>
      <label className={configurationFieldStyles.label}>
        Start command
        <input
          className={configurationFieldStyles.input}
          value={task.worker.startCommand}
          onChange={(e) =>
            dispatch(
              CurrentTaskActions.patchCurrentTask({
                worker: { ...task.worker, startCommand: e.target.value },
              }),
            )
          }
        />
      </label>
    </div>
  );
};

/**
 * Worker process configuration section.
 */
export const TaskConfigurationWorkerProcessSection = () => {
  const task = useAppSelector((state) => state.currentTask);

  if (!task.id) {
    return null;
  }

  const readView = (
    <ConfigurationReadFields
      fields={[
        { label: 'Express repo name', value: task.worker.expressRepoName },
        { label: 'Default port', value: task.worker.defaultPort },
        { label: 'Resolved port', value: task.port },
        { label: 'Health path', value: task.worker.healthPath },
        { label: 'Start command', value: task.worker.startCommand },
      ]}
    />
  );

  return (
    <ConfigurationSectionShell
      sectionKey="worker"
      title="Worker process"
      subtitle="How the scheduler starts and health-checks the worker Express app."
      readView={readView}
      editView={<WorkerProcessEditFields />}
    />
  );
};
