'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { TASKS_PATH, TASK_DETAIL_PAGE_PATH } from '@/config/routes';
import { getSchedulerSidebarSections } from './get-scheduler-sidebar-sections';

export const Sidebar = () => {
  const pathname = usePathname();
  const sections = useMemo(() => getSchedulerSidebarSections(), []);

  const isActiveHref = useCallback(
    (href: string) => {
      if (href === TASKS_PATH) {
        return pathname === TASKS_PATH || pathname === TASK_DETAIL_PAGE_PATH;
      }
      return pathname === href || pathname.startsWith(`${href}/`);
    },
    [pathname],
  );

  return (
    <aside className={styles.sidebar}>
      <div className={styles.inner}>
        <div className={styles.brandPanel}>
          <div className={styles.logoMark}>LS</div>
          <div className={styles.brandTextGroup}>
            <span className={styles.logoText}>Local Scheduler</span>
            <span className={styles.logoHint}>Workspace</span>
          </div>
        </div>

        <nav className={styles.navigation} aria-label="Primary">
          {sections.map((section) => (
            <div key={section.title} className={styles.navGroup}>
              <p className={styles.navLabel}>{section.title}</p>
              <ul className={styles.menuList}>
                {section.links.map((link) => {
                  const active = isActiveHref(link.href);
                  return (
                    <li key={link.href} className={styles.menuItem}>
                      <Link
                        href={link.href}
                        className={`${styles.menuButton} ${
                          active ? styles.menuButtonActive : styles.menuButtonInactive
                        }`}
                      >
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: `
    relative flex h-screen w-[15.5rem] flex-col shrink-0
    border-r border-gray-300 bg-white overflow-y-auto
  `,
  inner: `
    flex h-full flex-1 flex-col gap-4 p-3
  `,
  brandPanel: `
    flex items-center gap-2.5 rounded border border-gray-300 bg-gray-50 px-3 py-2.5
  `,
  logoMark: `
    flex h-8 w-8 shrink-0 items-center justify-center rounded
    border border-gray-300 bg-gray-900 text-[10px] font-bold tracking-tight text-white
  `,
  brandTextGroup: `
    flex min-w-0 flex-col
  `,
  logoText: `
    text-sm font-semibold text-gray-900 tracking-tight truncate
  `,
  logoHint: `
    text-[10px] font-semibold uppercase tracking-wide text-gray-500
  `,
  navigation: `
    flex-1 overflow-y-auto
  `,
  navGroup: `
    mb-2
  `,
  navLabel: `
    mb-2 px-2 text-[10px] font-semibold uppercase tracking-wide text-gray-500
  `,
  menuList: `
    flex flex-col gap-0.5
  `,
  menuItem: `
    group relative
  `,
  menuButton: `
    flex w-full items-center gap-2 rounded px-2.5 py-2 text-xs font-medium
    text-gray-700 transition-colors cursor-pointer
    hover:bg-gray-50 hover:text-gray-900
  `,
  menuButtonActive: `
    bg-gray-100 text-gray-900 font-semibold
    ring-1 ring-inset ring-gray-300
  `,
  menuButtonInactive: `
    bg-transparent
  `,
};
