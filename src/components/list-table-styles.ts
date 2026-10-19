/**
 * Shared table chrome for list pages and run history tables.
 */
export const listTableStyles = {
  wrapper: `
    bg-white rounded border border-gray-300 overflow-hidden
  `,
  wrapperOverflowVisible: `
    bg-white rounded border border-gray-300 overflow-visible
  `,
  scroll: `
    overflow-x-auto
  `,
  table: `
    w-full border-collapse text-xs
  `,
  th: `
    px-3 py-2 text-left text-[10px] font-semibold text-gray-600
    uppercase tracking-wide bg-gray-100 border-b border-gray-300
  `,
  columnHeaderRow: `
    hidden sm:grid sm:gap-4 sm:px-3 sm:py-2 sm:text-[10px] sm:font-semibold sm:uppercase sm:tracking-wide sm:text-gray-600 sm:bg-gray-100 sm:border-b sm:border-gray-300
  `,
  row: `
    hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0 cursor-pointer
  `,
  rowStatic: `
    hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0
  `,
  cell: `
    px-3 py-2.5 text-xs text-gray-700
  `,
  cellMuted: `
    px-3 py-2.5 text-xs text-gray-600
  `,
  emptyState: `
    py-8 px-4
  `,
  emptyText: `
    text-gray-500 text-sm
  `,
};
