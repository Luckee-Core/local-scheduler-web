import type { AppDispatch } from '@/store';
import { BreadcrumbBuilderActions } from '@/store/builders/breadcrumbBuilder';

/**
 * Clears the breadcrumb trail.
 */
export const resetDashboardBreadcrumbTrail = (dispatch: AppDispatch): void => {
  dispatch(BreadcrumbBuilderActions.reset());
};
