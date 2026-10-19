import type { ReactNode } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';

export type ConfigurationReadField = {
  label: string;
  value: ReactNode;
};

type ConfigurationReadFieldsProps = {
  fields: ConfigurationReadField[];
};

/**
 * Read-only field grid for configuration section panels.
 */
export const ConfigurationReadFields = (props: ConfigurationReadFieldsProps) => {
  const { fields } = props;

  return (
    <dl className={styles.grid}>
      {fields.map((field) => (
        <div key={field.label} className={styles.row}>
          <dt className={detailPageStyles.fieldLabel}>{field.label}</dt>
          <dd className={detailPageStyles.fieldValue}>{field.value}</dd>
        </div>
      ))}
    </dl>
  );
};

const styles = {
  grid: `
    grid gap-4 sm:grid-cols-2
  `,
  row: `
    space-y-1 min-w-0
  `,
};
