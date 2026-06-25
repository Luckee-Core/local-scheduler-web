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
      <div className={styles.logoArea}>
        <Link href={TASKS_PATH} className={styles.logoLink}>
          <span className={styles.logoMark}>LS</span>
          <span className={styles.logoText}>Local Scheduler</span>
        </Link>
      </div>

      <nav className={styles.nav}>
        {sections.map((section) => (
          <div key={section.title} className={styles.navGroup}>
            <p className={styles.navGroupTitle}>{section.title}</p>
            <div className={styles.navGroupItems}>
              {section.links.map((link) => {
                const active = isActiveHref(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={styles.navLink(active)}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

const styles = {
  sidebar: `
    w-56 flex flex-col border-r border-zinc-800 bg-zinc-900 text-zinc-100 shrink-0 self-stretch
  `,
  logoArea: `
    flex items-center px-4 py-4 border-b border-zinc-800 shrink-0
  `,
  logoLink: `
    flex items-center gap-2.5 min-w-0
  `,
  logoMark: `
    flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-sm font-bold text-white
  `,
  logoText: `
    truncate text-sm font-semibold text-zinc-100
  `,
  nav: `
    flex-1 overflow-y-auto px-2 py-3
  `,
  navGroup: `
    mb-4
  `,
  navGroupTitle: `
    px-2 mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500
  `,
  navGroupItems: `
    space-y-0.5
  `,
  navLink: (active: boolean) =>
    `block rounded-md px-2.5 py-2 text-sm transition-colors ${
      active ? 'bg-zinc-800 text-white' : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-white'
    }`,
};
