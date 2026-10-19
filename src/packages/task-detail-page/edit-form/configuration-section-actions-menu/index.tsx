'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '@/store';
import { startConfigurationSectionEditThunk } from '@/store/thunks';
import type { TaskConfigurationSectionKey } from '../configuration-section-key';

type ConfigurationSectionActionsMenuProps = {
  sectionKey: TaskConfigurationSectionKey;
};

/**
 * Ellipsis menu for a configuration section panel (read mode).
 */
export const ConfigurationSectionActionsMenu = (props: ConfigurationSectionActionsMenuProps) => {
  const { sectionKey } = props;
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen]);

  const handleEdit = () => {
    setIsOpen(false);
    dispatch(startConfigurationSectionEditThunk(sectionKey));
  };

  return (
    <div className={styles.wrapper} ref={menuRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen((open) => !open)}
        aria-label="Section actions"
        aria-expanded={isOpen}
      >
        ⋯
      </button>
      {isOpen ? (
        <div className={styles.menu} role="menu">
          <button type="button" className={styles.menuItem} onClick={handleEdit} role="menuitem">
            Edit
          </button>
        </div>
      ) : null}
    </div>
  );
};

const styles = {
  wrapper: `
    relative overflow-visible shrink-0
  `,
  trigger: `
    flex h-7 w-7 items-center justify-center rounded border border-gray-300 bg-white
    text-base leading-none text-gray-600
    transition-colors hover:bg-gray-50 hover:text-gray-900 cursor-pointer
  `,
  menu: `
    absolute right-0 top-full left-auto mt-1 z-50 max-h-60 overflow-y-auto overflow-x-hidden
    min-w-[9rem] rounded border border-gray-300 bg-white py-0.5 shadow-sm
  `,
  menuItem: `
    block w-full px-2.5 py-1.5 text-left text-xs text-gray-700 transition-colors
    hover:bg-gray-50 border-none bg-white cursor-pointer
  `,
};
