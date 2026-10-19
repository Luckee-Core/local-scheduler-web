'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { CurrentTaskActions } from '@/store/current/currentTask';
import { formatTaskSchedule } from '@/packages/ptasks/format-task-schedule';
import { formatTaskFrequency } from '@/packages/ptasks/format-task-frequency';
import { formatTimestamp } from '@/packages/ptasks/format-timestamp';
import {
  buildDailyScheduleFromMode,
  buildIntervalScheduleFromPrevious,
  getScheduleFrequencyMode,
  patchIntervalStartHour,
  type ScheduleFrequencyMode,
} from '@/packages/ptasks/schedule-frequency-mode';
import { configurationFieldStyles } from '../configuration-field-styles';
import { ConfigurationReadFields } from '../configuration-read-fields';
import { ConfigurationSectionShell } from '../configuration-section-shell';

const WEEKDAY_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
];

const ScheduleEditFields = () => {
  const dispatch = useAppDispatch();
  const task = useAppSelector((state) => state.currentTask);
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

  return (
    <div className={configurationFieldStyles.fields}>
      <label className={configurationFieldStyles.label}>
        Frequency
        <select
          className={configurationFieldStyles.select}
          value={frequencyMode}
          onChange={(e) => setFrequencyMode(e.target.value as ScheduleFrequencyMode)}
        >
          <option value="daily">Once per day (on each selected day)</option>
          <option value="weekly">Once per week</option>
          <option value="interval">Repeating interval</option>
        </select>
      </label>
      <div className={configurationFieldStyles.grid}>
        {!isInterval ? (
          <>
            <label className={configurationFieldStyles.label}>
              Hour (0–23)
              <input
                className={configurationFieldStyles.input}
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
              />
            </label>
            <label className={configurationFieldStyles.label}>
              Minute (0–59)
              <input
                className={configurationFieldStyles.input}
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
              />
            </label>
          </>
        ) : (
          <>
            <label className={configurationFieldStyles.label}>
              Interval (minutes)
              <input
                className={configurationFieldStyles.input}
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
              />
            </label>
            <label className={configurationFieldStyles.label}>
              Start hour (0–23)
              <input
                className={configurationFieldStyles.input}
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
              />
            </label>
          </>
        )}
        <label className={configurationFieldStyles.label}>
          Timezone
          <input
            className={configurationFieldStyles.input}
            value={schedule.timezone}
            onChange={(e) =>
              dispatch(
                CurrentTaskActions.patchCurrentTask({
                  schedule: { ...schedule, timezone: e.target.value },
                }),
              )
            }
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
    </div>
  );
};

/**
 * Schedule configuration section.
 */
export const TaskConfigurationScheduleSection = () => {
  const task = useAppSelector((state) => state.currentTask);

  if (!task.id) {
    return null;
  }

  const readView = (
    <ConfigurationReadFields
      fields={[
        { label: 'How often', value: formatTaskFrequency(task.schedule) },
        { label: 'Full schedule', value: formatTaskSchedule(task.schedule) },
        { label: 'Next run', value: formatTimestamp(task.nextRunAt) },
      ]}
    />
  );

  return (
    <ConfigurationSectionShell
      sectionKey="schedule"
      title="Schedule"
      subtitle="When this task runs."
      readView={readView}
      editView={<ScheduleEditFields />}
    />
  );
};

const styles = {
  weekdays: `
    mt-1
  `,
  weekdaysLabel: `
    text-xs font-medium text-gray-700
  `,
  weekdayRow: `
    mt-2 flex flex-wrap gap-2
  `,
  weekdayChip: `
    inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700 cursor-pointer
  `,
  checkbox: `
    rounded border-gray-300 cursor-pointer
  `,
};
