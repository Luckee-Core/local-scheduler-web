import type { AppDispatch } from '@/store';
import { BreadcrumbBuilderActions } from '@/store/builders/breadcrumbBuilder';
import type { BreadcrumbSegment, BreadcrumbTrailBase } from '@/model/breadcrumb';

/**
 * Registers a static breadcrumb trail for the current pathname.
 */
export const setStaticDashboardBreadcrumbTrail = (
  dispatch: AppDispatch,
  segments: BreadcrumbSegment[],
  base: BreadcrumbTrailBase | null = null,
): void => {
  dispatch(BreadcrumbBuilderActions.setTrail({ base, segments }));
};

/**
 * Clears the breadcrumb trail.
 */
export const resetDashboardBreadcrumbTrail = (dispatch: AppDispatch): void => {
  dispatch(BreadcrumbBuilderActions.reset());
};
