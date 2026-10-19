import { detailPageStyles } from '@/components/detail-page-styles';

/**
 * Shared field chrome for configuration section panels.
 */
export const configurationFieldStyles = {
  fields: `
    flex flex-col gap-3
  `,
  grid: `
    grid gap-3 sm:grid-cols-2
  `,
  label: detailPageStyles.formLabel,
  input: detailPageStyles.formInput,
  select: `
    ${detailPageStyles.formInput}
    cursor-pointer
  `,
};
