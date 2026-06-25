/**
 * Formats an ISO timestamp for display, or returns a dash when empty.
 */
export const formatTimestamp = (iso: string | null): string => {
  if (!iso) {
    return '—';
  }
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
};
