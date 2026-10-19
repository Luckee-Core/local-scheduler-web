'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TASKS_PATH } from '@/config/routes';
import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppDispatch } from '@/store';
import { createTaskThunk } from '@/store/thunks/tasks/createTaskThunk';
import type { CreateTaskPayload } from '@/api/tasks';
import type { IntervalTaskSchedule } from '@/model';

const defaultIntervalSchedule: IntervalTaskSchedule = {
  kind: 'interval',
  intervalMinutes: 15,
  timezone: 'America/New_York',
  weekdays: [1, 2, 3, 4, 5],
  hourStart: 8,
  hourEnd: 17,
};

const defaultPayload: CreateTaskPayload = {
  id: '',
  name: '',
  workerProjectId: '',
  enabled: true,
  worker: {
    expressRepoName: '',
    defaultPort: 3000,
    healthPath: '/api/health',
    startCommand: 'npm start',
  },
  request: {
    method: 'POST',
    path: '/api/data/example/process-due',
  },
  schedule: defaultIntervalSchedule,
  lifecycle: 'start_if_needed_stop_if_started',
};

export const TaskCreatePage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [form, setForm] = useState<CreateTaskPayload>(defaultPayload);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    const status = await dispatch(createTaskThunk(form));
    setSaving(false);
    if (status === 200) {
      router.push(TASKS_PATH);
      return;
    }
    setError('Could not create task. Check the express server and DATABASE_URL.');
  };

  return (
    <div className={detailPageStyles.page}>
      <section className={detailPageStyles.panel}>
        <div className={detailPageStyles.panelHeader}>
          <div>
            <h1 className={detailPageStyles.panelTitle}>Add scheduled task</h1>
            <p className={detailPageStyles.panelSubtitle}>
              Registers a task in local Postgres via{' '}
              <code className={styles.code}>POST /api/tasks</code>. Worker paths still come from{' '}
              <code className={styles.code}>scheduler.local.json</code> on the express server.
            </p>
          </div>
        </div>

        <div className={detailPageStyles.panelBody}>
          {error ? <p className={styles.error}>{error}</p> : null}
          <form className={styles.form} onSubmit={onSubmit}>
            <div className={styles.fieldGrid}>
              <label className={detailPageStyles.formLabel}>
                Task id (slug)
                <input
                  className={detailPageStyles.formInput}
                  value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value })}
                  required
                />
              </label>
              <label className={detailPageStyles.formLabel}>
                Name
                <input
                  className={detailPageStyles.formInput}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </label>
              <label className={detailPageStyles.formLabel}>
                Worker project id
                <input
                  className={detailPageStyles.formInput}
                  value={form.workerProjectId}
                  onChange={(e) => setForm({ ...form, workerProjectId: e.target.value })}
                  required
                />
              </label>
              <label className={detailPageStyles.formLabel}>
                Express repo name
                <input
                  className={detailPageStyles.formInput}
                  value={form.worker.expressRepoName}
                  onChange={(e) =>
                    setForm({ ...form, worker: { ...form.worker, expressRepoName: e.target.value } })
                  }
                  required
                />
              </label>
              <label className={detailPageStyles.formLabel}>
                Default port
                <input
                  className={detailPageStyles.formInput}
                  type="number"
                  value={form.worker.defaultPort}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      worker: { ...form.worker, defaultPort: Number(e.target.value) },
                    })
                  }
                  required
                />
              </label>
              <label className={detailPageStyles.formLabel}>
                Request method
                <select
                  className={`${detailPageStyles.formInput} cursor-pointer`}
                  value={form.request.method}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      request: { ...form.request, method: e.target.value },
                    })
                  }
                >
                  <option value="POST">POST</option>
                  <option value="GET">GET</option>
                </select>
              </label>
              <label className={detailPageStyles.formLabel}>
                Request path
                <input
                  className={detailPageStyles.formInput}
                  value={form.request.path}
                  onChange={(e) =>
                    setForm({ ...form, request: { ...form.request, path: e.target.value } })
                  }
                  required
                />
              </label>
              <label className={detailPageStyles.formLabel}>
                Interval (minutes)
                <input
                  className={detailPageStyles.formInput}
                  type="number"
                  value={
                    form.schedule.kind === 'interval' ? form.schedule.intervalMinutes : 15
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      schedule: {
                        ...(form.schedule.kind === 'interval'
                          ? form.schedule
                          : defaultIntervalSchedule),
                        intervalMinutes: Number(e.target.value),
                      },
                    })
                  }
                  required
                />
              </label>
            </div>
            <div className={styles.actions}>
              <button
                type="button"
                className={detailPageStyles.secondaryButton}
                onClick={() => router.push(TASKS_PATH)}
              >
                Cancel
              </button>
              <button type="submit" className={detailPageStyles.primaryButton} disabled={saving}>
                {saving ? 'Saving…' : 'Create task'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

const styles = {
  code: `rounded bg-gray-100 px-1 font-mono text-xs`,
  error: `mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800`,
  form: `flex flex-col gap-4`,
  fieldGrid: `grid gap-4 sm:grid-cols-2`,
  actions: `flex flex-wrap gap-3 pt-2`,
};
