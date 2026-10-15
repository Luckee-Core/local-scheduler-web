'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TASKS_PATH } from '@/config/routes';
import { useAppDispatch } from '@/store';
import { createTaskThunk } from '@/store/thunks/tasks/createTaskThunk';
import type { CreateTaskPayload } from '@/api/tasks';

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
  schedule: {
    kind: 'interval',
    intervalMinutes: 15,
    timezone: 'America/New_York',
    weekdays: [1, 2, 3, 4, 5],
    hourStart: 8,
    hourEnd: 17,
  },
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
    <div className={styles.wrap}>
      <h1 className={styles.title}>Add scheduled task</h1>
      <p className={styles.hint}>
        Registers a task in local Postgres via <code className={styles.code}>POST /api/tasks</code>.
        Worker paths still come from <code className={styles.code}>scheduler.local.json</code> on the
        express server.
      </p>
      {error ? <p className={styles.error}>{error}</p> : null}
      <form className={styles.form} onSubmit={onSubmit}>
        <label className={styles.label}>
          Task id (slug)
          <input
            className={styles.input}
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
            required
          />
        </label>
        <label className={styles.label}>
          Name
          <input
            className={styles.input}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>
        <label className={styles.label}>
          Worker project id
          <input
            className={styles.input}
            value={form.workerProjectId}
            onChange={(e) => setForm({ ...form, workerProjectId: e.target.value })}
            required
          />
        </label>
        <label className={styles.label}>
          Express repo name
          <input
            className={styles.input}
            value={form.worker.expressRepoName}
            onChange={(e) =>
              setForm({ ...form, worker: { ...form.worker, expressRepoName: e.target.value } })
            }
            required
          />
        </label>
        <label className={styles.label}>
          Default port
          <input
            className={styles.input}
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
        <label className={styles.label}>
          Request method
          <select
            className={styles.input}
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
        <label className={styles.label}>
          Request path
          <input
            className={styles.input}
            value={form.request.path}
            onChange={(e) =>
              setForm({ ...form, request: { ...form.request, path: e.target.value } })
            }
            required
          />
        </label>
        <label className={styles.label}>
          Interval (minutes)
          <input
            className={styles.input}
            type="number"
            value={form.schedule.intervalMinutes}
            onChange={(e) =>
              setForm({
                ...form,
                schedule: {
                  ...form.schedule,
                  intervalMinutes: Number(e.target.value),
                },
              })
            }
            required
          />
        </label>
        <div className={styles.actions}>
          <button type="button" className={styles.secondary} onClick={() => router.push(TASKS_PATH)}>
            Cancel
          </button>
          <button type="submit" className={styles.primary} disabled={saving}>
            {saving ? 'Saving…' : 'Create task'}
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  wrap: `mx-auto max-w-xl px-4 py-8`,
  title: `text-2xl font-semibold text-gray-900`,
  hint: `mt-2 text-sm text-gray-600`,
  code: `rounded bg-gray-100 px-1 font-mono text-xs`,
  error: `mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800`,
  form: `mt-6 flex flex-col gap-4`,
  label: `flex flex-col gap-1 text-sm font-medium text-gray-700`,
  input: `rounded border border-gray-300 px-3 py-2 text-sm`,
  actions: `flex gap-3 pt-2`,
  primary: `rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50`,
  secondary: `rounded border border-gray-300 px-4 py-2 text-sm text-gray-700`,
};
