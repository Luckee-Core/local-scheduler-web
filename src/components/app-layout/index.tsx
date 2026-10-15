'use client';

import { usePathname } from 'next/navigation';
import { useLayoutEffect, useMemo, useState, type ReactNode } from 'react';
import {
  AppLayoutHeader,
  type AppLayoutBreadcrumb,
  useResolvedDashboardBreadcrumbs,
} from '@/components/app-layout-header';
import { resolveDefaultNavBreadcrumbForPathname } from '@/components/navigation/resolve-default-nav-breadcrumb-for-pathname';
import { Sidebar } from '@/components/sidebar';
import { BreadcrumbBuilderActions } from '@/store/builders/breadcrumbBuilder';
import { useAppDispatch } from '@/store';

const SIDEBAR_VISIBLE_KEY = 'local-scheduler-sidebar-visible';

const readStoredSidebarVisible = (): boolean => {
  try {
    const stored = localStorage.getItem(SIDEBAR_VISIBLE_KEY);
    if (stored === null) {
      return true;
    }
    return stored === 'true';
  } catch {
    return true;
  }
};

type AppLayoutProps = {
  children: ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const dispatch = useAppDispatch();
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const pathname = usePathname();

  useLayoutEffect(() => {
    setIsSidebarVisible(readStoredSidebarVisible());
  }, []);

  useLayoutEffect(() => {
    dispatch(BreadcrumbBuilderActions.reset());
  }, [dispatch, pathname]);

  const defaultNavCrumb = useMemo(
    () => resolveDefaultNavBreadcrumbForPathname(pathname),
    [pathname],
  );

  const navOnlyBreadcrumbItems = useMemo((): AppLayoutBreadcrumb[] => {
    if (!defaultNavCrumb) {
      return [];
    }
    return [{ label: defaultNavCrumb.label, href: defaultNavCrumb.href }];
  }, [defaultNavCrumb]);

  const reduxBreadcrumbItems = useResolvedDashboardBreadcrumbs();

  const breadcrumbItems = useMemo(
    () => (reduxBreadcrumbItems.length > 0 ? reduxBreadcrumbItems : navOnlyBreadcrumbItems),
    [reduxBreadcrumbItems, navOnlyBreadcrumbItems],
  );

  const handleToggleSidebar = () => {
    setIsSidebarVisible((previous) => {
      const next = !previous;
      try {
        localStorage.setItem(SIDEBAR_VISIBLE_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  return (
    <div className={styles.appShell}>
      {isSidebarVisible ? <Sidebar /> : null}
      <div className={styles.mainColumn}>
        <AppLayoutHeader
          isSidebarVisible={isSidebarVisible}
          onToggleSidebar={handleToggleSidebar}
          breadcrumbItems={breadcrumbItems}
        />
        <div className={styles.content}>
          <div className={styles.inner}>{children}</div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  appShell: `
    flex h-screen overflow-hidden bg-gray-50
  `,
  mainColumn: `
    flex flex-1 flex-col min-h-0 min-w-0 overflow-hidden
  `,
  content: `
    flex-1 min-w-0 overflow-y-auto p-4
  `,
  inner: `
    w-full max-w-6xl mx-auto
  `,
};
