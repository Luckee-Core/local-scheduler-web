'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store';
import type { BreadcrumbSegment, BreadcrumbTrailBase } from '@/model/breadcrumb';
import { setStaticDashboardBreadcrumbTrail } from './set-static-dashboard-breadcrumb-trail';
import { resetDashboardBreadcrumbTrail } from './reset-dashboard-breadcrumb-trail';

type RegisterStaticBreadcrumbsOptions = {
  base?: BreadcrumbTrailBase | null;
};

/**
 * Registers static breadcrumb segments on mount; clears on unmount.
 */
export const useRegisterStaticDashboardBreadcrumbs = (
  segments: BreadcrumbSegment[],
  options: RegisterStaticBreadcrumbsOptions = {},
): void => {
  const dispatch = useAppDispatch();
  const base = options.base ?? null;

  useEffect(() => {
    setStaticDashboardBreadcrumbTrail(dispatch, segments, base);
    return () => {
      resetDashboardBreadcrumbTrail(dispatch);
    };
  }, [dispatch, base, segments]);
};
