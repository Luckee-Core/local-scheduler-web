/**
 * Formats an ISO timestamp for display, or returns a dash when empty.
 */
export const formatTimestamp = (iso: string | null): string => {
  if (!iso) {
    return '—';
  }
  try {
    const date = new Date(iso);
    const datePart = date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
    });
    const timePart = date.toLocaleString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    });
    return `${datePart} · ${timePart}`;
  } catch {
    return iso;
  }
};
