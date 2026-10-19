'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { CurrentTaskActions } from '@/store/current/currentTask';
import { resetCurrentTaskFromDumpThunk, saveTaskThunk } from '@/store/thunks';
import {
  buildDailyScheduleFromMode,
  buildIntervalScheduleFromPrevious,
  getScheduleFrequencyMode,
  patchIntervalStartHour,
  type ScheduleFrequencyMode,
} from '@/packages/ptasks/schedule-frequency-mode';

const WEEKDAY_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
];

export const TaskDetailEditForm = () => {
  const dispatch = useAppDispatch();
  const task = useAppSelector((state) => state.currentTask);
  const taskDetailBuilder = useAppSelector((state) => state.taskDetailBuilder);

  const isSaving = taskDetailBuilder.saveStatus === 'saving';

  const handleSave = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      void dispatch(saveTaskThunk());
    },
    [dispatch],
  );

  const handleReset = useCallback(() => {
    dispatch(resetCurrentTaskFromDumpThunk());
  }, [dispatch]);

  const schedule = task.schedule;
  const frequencyMode = getScheduleFrequencyMode(schedule);
  const isInterval = schedule.kind === 'interval';

  const toggleWeekday = useCallback(
    (day: number) => {
      if (frequencyMode === 'weekly' && schedule.kind === 'daily') {
        dispatch(
          CurrentTaskActions.patchCurrentTask({
            schedule: { ...schedule, weekdays: [day] },
          }),
        );
        return;
      }

      const set = new Set(schedule.weekdays);
      if (set.has(day)) {
        set.delete(day);
      } else {
        set.add(day);
      }
      const weekdays = [...set].sort((a, b) => a - b);
      if (weekdays.length === 0) {
        return;
      }
      dispatch(
        CurrentTaskActions.patchCurrentTask({
          schedule: { ...schedule, weekdays },
        }),
      );
    },
    [dispatch, frequencyMode, schedule],
  );

  const setFrequencyMode = useCallback(
    (mode: ScheduleFrequencyMode) => {
      if (mode === 'interval') {
        if (schedule.kind === 'interval') {
          return;
        }
        dispatch(
          CurrentTaskActions.patchCurrentTask({
            schedule: buildIntervalScheduleFromPrevious(schedule),
          }),
        );
        return;
      }

      if (schedule.kind !== 'daily' || getScheduleFrequencyMode(schedule) !== mode) {
        dispatch(
          CurrentTaskActions.patchCurrentTask({
            schedule: buildDailyScheduleFromMode(mode, schedule),
          }),
        );
      }
    },
    [dispatch, schedule],
  );

  if (!task.id) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Configuration</h2>
        <p className={styles.hint}>
          Schedule, worker API call, and worker metadata stored in Postgres. Machine paths still
          come from <code className={styles.code}>scheduler.local.json</code> on the express server.
        </p>
      </div>

      {taskDetailBuilder.saveError ? (
        <p className={styles.error} role="alert">{taskDetailBuilder.saveError}</p>
      ) : null}
      {taskDetailBuilder.saveStatus === 'success' ? (
        <p className={styles.success}>Saved.</p>
      ) : null}

      <form className={styles.form} onSubmit={handleSave}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Task</legend>
          <label className={styles.label}>
            Display name
            <input
              className={styles.input}
              value={task.name}
              onChange={(e) =>
                dispatch(CurrentTaskActions.patchCurrentTask({ name: e.target.value }))
              }
              required
            />
          </label>
          <label className={styles.label}>
            Worker project id
            <input
              className={styles.input}
              value={task.workerProjectId}
              onChange={(e) =>
                dispatch(CurrentTaskActions.patchCurrentTask({ workerProjectId: e.target.value }))
              }
              required
            />
          </label>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Worker process</legend>
          <div className={styles.grid}>
            <label className={styles.label}>
              Express repo name
              <input
                className={styles.input}
                value={task.worker.expressRepoName}
                onChange={(e) =>
                  dispatch(
                    CurrentTaskActions.patchCurrentTask({
                      worker: { ...task.worker, expressRepoName: e.target.value },
                    }),
                  )
                }
                required
              />
            </label>
            <label className={styles.label}>
              Default port
              <input
                className={styles.input}
                type="number"
                value={task.worker.defaultPort}
                onChange={(e) =>
                  dispatch(
                    CurrentTaskActions.patchCurrentTask({
                      worker: { ...task.worker, defaultPort: Number(e.target.value) },
                    }),
                  )
                }
                required
              />
            </label>
          </div>
          <label className={styles.label}>
            Health path
            <input
              className={styles.input}
              value={task.worker.healthPath}
              onChange={(e) =>
                dispatch(
                  CurrentTaskActions.patchCurrentTask({
                    worker: { ...task.worker, healthPath: e.target.value },
                  }),
                )
              }
              required
            />
          </label>
          <label className={styles.label}>
            Start command
            <input
              className={styles.input}
              value={task.worker.startCommand}
              onChange={(e) =>
                dispatch(
                  CurrentTaskActions.patchCurrentTask({
                    worker: { ...task.worker, startCommand: e.target.value },
                  }),
                )
              }
              required
            />
          </label>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>HTTP request</legend>
          <div className={styles.grid}>
            <label className={styles.label}>
              Method
              <select
                className={styles.input}
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
            <label className={styles.label}>
              Auth env key (optional)
              <input
                className={styles.input}
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
          <label className={styles.label}>
            Path
            <input
              className={styles.input}
              value={task.request.path}
              onChange={(e) =>
                dispatch(
                  CurrentTaskActions.patchCurrentTask({
                    request: { ...task.request, path: e.target.value },
                  }),
                )
              }
              required
            />
          </label>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Schedule</legend>
          <label className={styles.label}>
            Frequency
            <select
              className={styles.input}
              value={frequencyMode}
              onChange={(e) => setFrequencyMode(e.target.value as ScheduleFrequencyMode)}
            >
              <option value="daily">Once per day (on each selected day)</option>
              <option value="weekly">Once per week</option>
              <option value="interval">Repeating interval</option>
            </select>
          </label>
          <div className={styles.grid}>
            {!isInterval ? (
              <>
                <label className={styles.label}>
                  Hour (0–23)
                  <input
                    className={styles.input}
                    type="number"
                    min={0}
                    max={23}
                    value={schedule.hour}
                    onChange={(e) =>
                      dispatch(
                        CurrentTaskActions.patchCurrentTask({
                          schedule: { ...schedule, hour: Number(e.target.value) },
                        }),
                      )
                    }
                    required
                  />
                </label>
                <label className={styles.label}>
                  Minute (0–59)
                  <input
                    className={styles.input}
                    type="number"
                    min={0}
                    max={59}
                    value={schedule.minute}
                    onChange={(e) =>
                      dispatch(
                        CurrentTaskActions.patchCurrentTask({
                          schedule: { ...schedule, minute: Number(e.target.value) },
                        }),
                      )
                    }
                    required
                  />
                </label>
              </>
            ) : (
              <>
                <label className={styles.label}>
                  Interval (minutes)
                  <input
                    className={styles.input}
                    type="number"
                    min={1}
                    max={1440}
                    value={schedule.intervalMinutes}
                    onChange={(e) =>
                      dispatch(
                        CurrentTaskActions.patchCurrentTask({
                          schedule: {
                            ...schedule,
                            intervalMinutes: Number(e.target.value),
                          },
                        }),
                      )
                    }
                    required
                  />
                </label>
                <label className={styles.label}>
                  Start hour (0–23)
                  <input
                    className={styles.input}
                    type="number"
                    min={0}
                    max={23}
                    value={schedule.hourStart}
                    onChange={(e) =>
                      dispatch(
                        CurrentTaskActions.patchCurrentTask({
                          schedule: patchIntervalStartHour(schedule, Number(e.target.value)),
                        }),
                      )
                    }
                    required
                  />
                </label>
              </>
            )}
            <label className={styles.label}>
              Timezone
              <input
                className={styles.input}
                value={schedule.timezone}
                onChange={(e) =>
                  dispatch(
                    CurrentTaskActions.patchCurrentTask({
                      schedule: { ...schedule, timezone: e.target.value },
                    }),
                  )
                }
                required
              />
            </label>
          </div>
          <div className={styles.weekdays}>
            <span className={styles.weekdaysLabel}>
              {frequencyMode === 'weekly' ? 'Day of week' : 'Active days'}
            </span>
            <div className={styles.weekdayRow}>
              {WEEKDAY_OPTIONS.map((option) => (
                <label key={option.value} className={styles.weekdayChip}>
                  <input
                    type={frequencyMode === 'weekly' ? 'radio' : 'checkbox'}
                    name={frequencyMode === 'weekly' ? 'weekly-day' : undefined}
                    checked={schedule.weekdays.includes(option.value)}
                    onChange={() => toggleWeekday(option.value)}
                    className={styles.checkbox}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
        </fieldset>

        <div className={styles.actions}>
          <button type="button" className={styles.secondary} onClick={handleReset} disabled={isSaving}>
            Reset changes
          </button>
          <button type="submit" className={styles.primary} disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save configuration'}
          </button>
        </div>
      </form>
    </section>
  );
};

const styles = {
  section: `
    rounded-lg border border-gray-200 bg-white p-6 shadow-sm
  `,
  header: `
    mb-4
  `,
  title: `
    text-lg font-semibold text-gray-900
  `,
  hint: `
    mt-1 text-sm text-gray-600
  `,
  code: `
    rounded bg-gray-100 px-1 font-mono text-xs
  `,
  error: `
    mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800
  `,
  success: `
    mb-4 rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800
  `,
  form: `
    flex flex-col gap-6
  `,
  fieldset: `
    flex flex-col gap-3 border-0 p-0
  `,
  legend: `
    mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500
  `,
  grid: `
    grid gap-3 sm:grid-cols-2
  `,
  label: `
    flex flex-col gap-1 text-sm font-medium text-gray-700
  `,
  input: `
    rounded border border-gray-300 px-3 py-2 text-sm font-normal text-gray-900
  `,
  weekdays: `
    mt-1
  `,
  weekdaysLabel: `
    text-sm font-medium text-gray-700
  `,
  weekdayRow: `
    mt-2 flex flex-wrap gap-2
  `,
  weekdayChip: `
    inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700 cursor-pointer
  `,
  checkbox: `
    rounded border-gray-300
  `,
  actions: `
    flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-4
  `,
  primary: `
    rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors
    hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50
  `,
  secondary: `
    rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700
    hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50
  `,
};
