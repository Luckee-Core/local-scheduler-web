'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { CurrentTaskActions } from '@/store/current/currentTask';
import { configurationFieldStyles } from '../configuration-field-styles';
import { ConfigurationReadFields } from '../configuration-read-fields';
import { ConfigurationSectionShell } from '../configuration-section-shell';

const HttpRequestEditFields = () => {
  const dispatch = useAppDispatch();
  const task = useAppSelector((state) => state.currentTask);

  return (
    <div className={configurationFieldStyles.fields}>
      <div className={configurationFieldStyles.grid}>
        <label className={configurationFieldStyles.label}>
          Method
          <select
            className={configurationFieldStyles.select}
            value={task.request.method}
            onChange={(e) =>
              dispatch(
                CurrentTaskActions.patchCurrentTask({
                  request: { ...task.request, method: e.target.value },
                }),
              )
            }
          >
            <option value="POST">POST</option>
            <option value="GET">GET</option>
          </select>
        </label>
        <label className={configurationFieldStyles.label}>
          Auth env key (optional)
          <input
            className={configurationFieldStyles.input}
            value={task.request.authEnvKey ?? ''}
            placeholder="SCHEDULER_AUTH_TOKEN"
            onChange={(e) =>
              dispatch(
                CurrentTaskActions.patchCurrentTask({
                  request: {
                    ...task.request,
                    authEnvKey: e.target.value.trim() || undefined,
                  },
                }),
              )
            }
          />
        </label>
      </div>
      <label className={configurationFieldStyles.label}>
        Path
        <input
          className={configurationFieldStyles.input}
          value={task.request.path}
          onChange={(e) =>
            dispatch(
              CurrentTaskActions.patchCurrentTask({
                request: { ...task.request, path: e.target.value },
              }),
            )
          }
        />
      </label>
    </div>
  );
};

/**
 * HTTP request configuration section.
 */
export const TaskConfigurationHttpRequestSection = () => {
  const task = useAppSelector((state) => state.currentTask);

  if (!task.id) {
    return null;
  }

  const readView = (
    <ConfigurationReadFields
      fields={[
        { label: 'Method', value: task.request.method },
        { label: 'Auth env key', value: task.request.authEnvKey ?? '—' },
        { label: 'Path', value: task.request.path },
      ]}
    />
  );

  return (
    <ConfigurationSectionShell
      sectionKey="http"
      title="HTTP request"
      subtitle="API call the scheduler makes when this task runs."
      readView={readView}
      editView={<HttpRequestEditFields />}
    />
  );
};
