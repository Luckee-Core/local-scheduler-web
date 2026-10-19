'use client';

import Link from 'next/link';
import type { AppLayoutBreadcrumb } from './app-layout-breadcrumb';

type BreadcrumbBarProps = {
  items: AppLayoutBreadcrumb[];
};

export const BreadcrumbBar = (props: BreadcrumbBarProps) => {
  const { items } = props;

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      {items.map((item, index) => {
        const separator = index > 0;

        return (
          <li key={`${item.label}-${index}-${item.href ?? ''}`} className={styles.breadcrumbItem}>
            {separator ? (
              <span className={styles.breadcrumbSeparator} aria-hidden="true">
                /
              </span>
            ) : null}
            {item.href ? (
              <Link href={item.href} className={styles.breadcrumbLink}>
                {item.label}
              </Link>
            ) : (
              <span className={styles.breadcrumbCurrent}>{item.label}</span>
            )}
          </li>
        );
      })}
    </>
  );
};

const styles = {
  breadcrumbSeparator: `
    text-xs font-normal text-gray-400
  `,
  breadcrumbItem: `
    relative flex min-w-0 items-center gap-2 text-xs font-medium text-gray-600
  `,
  breadcrumbLink: `
    truncate text-xs font-medium text-gray-600 transition-colors hover:text-gray-900 focus:outline-none cursor-pointer
  `,
  breadcrumbCurrent: `
    truncate text-xs font-medium text-gray-900
  `,
};
