'use client';

import type { ReactNode } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  cancelConfigurationSectionEditThunk,
  saveConfigurationSectionEditThunk,
} from '@/store/thunks';
import type { TaskConfigurationSectionKey } from '../configuration-section-key';
import { ConfigurationSectionActionsMenu } from '../configuration-section-actions-menu';

type ConfigurationSectionShellProps = {
  sectionKey: TaskConfigurationSectionKey;
  title: string;
  subtitle?: string;
  readView: ReactNode;
  editView: ReactNode;
};

/**
 * Configuration panel with read mode, ellipsis edit menu, and per-section save/cancel.
 */
export const ConfigurationSectionShell = (props: ConfigurationSectionShellProps) => {
  const { sectionKey, title, subtitle, readView, editView } = props;
  const dispatch = useAppDispatch();
  const taskDetailBuilder = useAppSelector((state) => state.taskDetailBuilder);

  const isEditing = taskDetailBuilder.editingConfigurationSection === sectionKey;
  const isSaving = taskDetailBuilder.saveStatus === 'saving';

  const handleCancel = () => {
    dispatch(cancelConfigurationSectionEditThunk());
  };

  const handleSave = () => {
    void dispatch(saveConfigurationSectionEditThunk());
  };

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div className={styles.headerText}>
          <h2 className={detailPageStyles.panelTitle}>{title}</h2>
          {subtitle ? <p className={detailPageStyles.panelSubtitle}>{subtitle}</p> : null}
        </div>
        {isEditing ? null : <ConfigurationSectionActionsMenu sectionKey={sectionKey} />}
      </div>

      <div className={detailPageStyles.panelBody}>
        {isEditing ? editView : readView}

        {isEditing ? (
          <div className={styles.editFooter}>
            {taskDetailBuilder.saveError ? (
              <p className={styles.error} role="alert">{taskDetailBuilder.saveError}</p>
            ) : null}
            {taskDetailBuilder.saveStatus === 'success' ? (
              <p className={styles.success}>Saved.</p>
            ) : null}
            <div className={styles.actions}>
              <button
                type="button"
                className={detailPageStyles.secondaryButton}
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="button"
                className={detailPageStyles.primaryButton}
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

const styles = {
  headerText: `
    min-w-0 flex-1
  `,
  editFooter: `
    mt-4 border-t border-gray-300 pt-4
  `,
  error: `
    mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800
  `,
  success: `
    mb-3 rounded border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-800
  `,
  actions: `
    flex flex-wrap justify-end gap-2
  `,
};
