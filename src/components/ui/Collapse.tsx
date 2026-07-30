import type { ReactNode } from 'react';

/**
 * Enter/exit for content that appears and disappears as a story advances.
 *
 * Pure CSS: the row track animates 0fr → 1fr, so height is interpolated without
 * measuring anything, and the block collapses completely when closed. The
 * spacing lives inside the clipped area so a closed block leaves no gap behind.
 *
 * `group`/`data-open` is exposed so children can stagger their own reveal off
 * the parent's state — see `staggerStyle`.
 */
export function Collapse({
  open,
  children,
  className = '',
  /**
   * Leading space, inside the clipped area so it collapses with the content.
   * `none` is for collapses that are already inside a padded container.
   */
  lead = 'block',
}: {
  open: boolean;
  children: ReactNode;
  className?: string;
  lead?: 'block' | 'tight' | 'none';
}) {
  const leadClass = lead === 'block' ? 'pt-3 sm:pt-4' : lead === 'tight' ? 'pt-1.5' : '';

  return (
    <div
      data-open={open}
      aria-hidden={!open}
      className={
        'group grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] ' +
        'duration-[var(--dur-slow)] ease-[var(--ease-out-expo)] ' +
        'data-[open=true]:grid-rows-[1fr] data-[open=true]:opacity-100 ' +
        className
      }
    >
      <div className="min-h-0 overflow-hidden">
        <div className={leadClass}>{children}</div>
      </div>
    </div>
  );
}

/**
 * Child of a `Collapse` that slides in with a per-item delay, giving the
 * staggered build-up the spec asks for without any JS.
 */
export function CollapseItem({
  index,
  children,
  className = '',
}: {
  index: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      style={{ transitionDelay: `${Math.min(index, 6) * 55}ms` }}
      className={
        'translate-y-2 opacity-0 transition-[opacity,transform] duration-[var(--dur-slow)] ' +
        'ease-[var(--ease-out-expo)] group-data-[open=true]:translate-y-0 ' +
        'group-data-[open=true]:opacity-100 ' +
        className
      }
    >
      {children}
    </div>
  );
}
