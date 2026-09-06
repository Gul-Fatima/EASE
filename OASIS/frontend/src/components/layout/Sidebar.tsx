"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LeafIcon, SettingsIcon, BookOpenIcon, ShieldIcon } from 'lucide-react';
import { navItems } from '@/data/navigation';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-[232px] shrink-0 flex-col border-r border-line bg-surface">
      <div className="flex h-14 items-center gap-2.5 border-b border-line px-5">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-ink">
          <LeafIcon className="h-4 w-4 text-accent" strokeWidth={2.2} />
        </span>
        <div className="leading-none">
          <p className="text-sm font-semibold tracking-tight text-ink">OASIS</p>
          <p className="mt-0.5 text-2xs text-ink-3">Sustainable software</p>
        </div>
      </div>

      <nav aria-label="Main" className="flex-1 overflow-y-auto px-2.5 py-3">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive =
              item.to === '/' ? pathname === '/' : pathname.startsWith(item.to);

            return (
              <li key={item.to}>
                <Link
                  href={item.to}
                  className={[
                    'flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[13px] transition-colors duration-150 ease-out',
                    isActive
                      ? 'bg-accent-soft font-semibold text-accent-strong'
                      : 'text-ink-2 hover:bg-subtle hover:text-ink',
                  ].join(' ')}
                >
                  <item.icon
                    className={`h-4 w-4 shrink-0 ${isActive ? 'text-accent' : 'text-ink-3'}`}
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-line px-2.5 py-3">
        <div className="mb-3 flex items-start gap-2 rounded-md bg-subtle px-2.5 py-2">
          <ShieldIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
          <p className="text-2xs leading-snug text-ink-3">
            Submitted code runs in an isolated container with no network access.
          </p>
        </div>

        <ul className="space-y-0.5">
          <li>
            <button
              type="button"
              className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[13px] text-ink-2 transition-colors duration-150 ease-out hover:bg-subtle hover:text-ink"
            >
              <SettingsIcon className="h-4 w-4 text-ink-3" />
              Settings
            </button>
          </li>
          <li>
            <button
              type="button"
              className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[13px] text-ink-2 transition-colors duration-150 ease-out hover:bg-subtle hover:text-ink"
            >
              <BookOpenIcon className="h-4 w-4 text-ink-3" />
              Help &amp; documentation
            </button>
          </li>
        </ul>

        <div className="mt-2 flex items-center gap-2.5 border-t border-line px-2.5 pt-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-2xs font-semibold text-white">
            AK
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-xs font-medium text-ink">Ayesha Khan</p>
            <p className="truncate text-2xs text-ink-3">Technical lead</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
