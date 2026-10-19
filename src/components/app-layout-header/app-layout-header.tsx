'use client';

import { PanelLeft, PanelLeftClose } from 'lucide-react';
import { useMemo } from 'react';
import { BreadcrumbBar } from './breadcrumb-bar';
import type { AppLayoutBreadcrumb } from './app-layout-breadcrumb';

type AppLayoutHeaderProps = {
  isSidebarVisible: boolean;
  onToggleSidebar: () => void;
  breadcrumbItems: AppLayoutBreadcrumb[];
};

export const AppLayoutHeader = (props: AppLayoutHeaderProps) => {
  const { isSidebarVisible, onToggleSidebar, breadcrumbItems } = props;

  const toggleButtonLabel = useMemo(
    () => (isSidebarVisible ? 'Hide sidebar' : 'Show sidebar'),
    [isSidebarVisible],
  );

  return (
    <header className={styles.header}>
      <button
        type="button"
        onClick={onToggleSidebar}
        className={styles.sidebarToggle}
        aria-pressed={isSidebarVisible}
        aria-label={toggleButtonLabel}
      >
        {isSidebarVisible ? (
          <PanelLeftClose className={styles.sidebarToggleIcon} aria-hidden />
        ) : (
          <PanelLeft className={styles.sidebarToggleIcon} aria-hidden />
        )}
      </button>

      <nav className={styles.breadcrumbNav} aria-label="Breadcrumb">
        <ol className={styles.breadcrumbList}>
          <BreadcrumbBar items={breadcrumbItems} />
        </ol>
      </nav>
    </header>
  );
};

const styles = {
  header: `
    flex items-center gap-3 shrink-0
    border-b border-gray-300 bg-white px-4 py-2.5
  `,
  sidebarToggle: `
    flex h-8 w-8 shrink-0 items-center justify-center rounded-md
    text-gray-600 bg-transparent
    transition-colors hover:bg-gray-100 hover:text-gray-900
    focus:outline-none cursor-pointer
  `,
  sidebarToggleIcon: `
    h-[18px] w-[18px]
  `,
  breadcrumbNav: `
    flex flex-1 items-center overflow-visible min-w-0
  `,
  breadcrumbList: `
    flex min-w-0 flex-wrap items-center gap-x-1 gap-y-1
  `,
};
