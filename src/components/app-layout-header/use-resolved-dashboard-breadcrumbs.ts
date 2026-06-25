'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/store';
import type { AppLayoutBreadcrumb } from './app-layout-breadcrumb';

/**
 * Resolves breadcrumbBuilder trail into header-ready breadcrumbs.
 */
export const useResolvedDashboardBreadcrumbs = (): AppLayoutBreadcrumb[] => {
  const base = useAppSelector((state) => state.breadcrumbBuilder.base);
  const segments = useAppSelector((state) => state.breadcrumbBuilder.segments);

  return useMemo(() => {
    const hasTrail = base !== null || segments.length > 0;
    if (!hasTrail) {
      return [];
    }

    const items: AppLayoutBreadcrumb[] = [];

    if (base) {
      items.push({ label: base.label, href: base.href });
    }

    for (const segment of segments) {
      if (segment.kind === 'staticLink') {
        items.push({ label: segment.label, href: segment.href });
        continue;
      }
      items.push({ label: segment.label });
    }

    return items;
  }, [base, segments]);
};
