/**
 * Shared filter bar chrome for list pages, detail tab tables, and dashboard widgets.
 */
export const listFilterBarStyles = {
  section: `
    flex flex-wrap gap-3 items-center mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200
  `,
  searchInputWrapper: `
    relative flex items-center min-w-48
  `,
  searchInput: `
    h-7 pl-2 pr-6 py-1 text-xs border border-gray-300 rounded
    focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent
    placeholder-gray-400 w-full
  `,
  clearButton: `
    absolute right-1.5 top-1/2 transform -translate-y-1/2
    text-gray-400 hover:text-gray-600 text-xs cursor-pointer
  `,
  clearFiltersButton: `
    text-xs text-gray-600 hover:text-gray-900 underline cursor-pointer
  `,
};
