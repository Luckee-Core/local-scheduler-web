/**
 * Shared layout and panel chrome for detail screens (matches list tables).
 */
export const detailPageStyles = {
  page: `
    w-full flex flex-col gap-5
  `,
  panel: `
    bg-white rounded border border-gray-300 overflow-visible
  `,
  panelHeader: `
    px-4 py-3 border-b border-gray-300 bg-gray-50
    flex flex-wrap items-start justify-between gap-3
  `,
  panelTitle: `
    text-sm font-semibold text-gray-900 tracking-tight
  `,
  panelSubtitle: `
    text-xs text-gray-500 mt-0.5
  `,
  panelBody: `
    px-4 py-4
  `,
  sectionTitle: `
    text-[10px] font-semibold uppercase tracking-wide text-gray-500
  `,
  primaryButton: `
    text-xs font-medium text-white bg-gray-900
    px-3 py-1.5 rounded border border-gray-900
    hover:bg-gray-800 transition-colors cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  secondaryButton: `
    text-xs font-medium text-gray-700
    px-3 py-1.5 rounded border border-gray-300 bg-white
    hover:bg-gray-50 transition-colors cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  dangerButton: `
    text-xs font-medium text-red-700
    px-3 py-1.5 rounded border border-red-200 bg-white
    hover:bg-red-50 transition-colors cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  textLink: `
    text-xs font-medium text-gray-700 hover:text-gray-900 underline-offset-2 hover:underline
  `,
  fieldLabel: `
    text-[10px] font-semibold uppercase tracking-wide text-gray-500
  `,
  fieldValue: `
    text-sm text-gray-900
  `,
  emptyState: `
    flex flex-col items-start gap-2 py-8 px-4
  `,
  emptyLink: `
    text-xs font-medium text-gray-700 underline-offset-2 hover:underline cursor-pointer
  `,
  pageTitle: `
    text-sm font-semibold text-gray-900 tracking-tight
  `,
  pageSubtitle: `
    text-xs text-gray-500 mt-0.5
  `,
  formLabel: `
    flex flex-col gap-1 text-xs font-medium text-gray-700
  `,
  formInput: `
    h-7 rounded border border-gray-300 px-2 py-1 text-xs font-normal text-gray-900
    focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent
  `,
};
