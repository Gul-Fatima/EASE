"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BellIcon, ChevronRightIcon, ChevronsUpDownIcon, SearchIcon } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

const CRUMBS: Record<string, { label: string; parent?: string }> = {
  '/': { label: 'Overview' },
  '/projects': { label: 'Projects' },
  '/analysis': { label: 'Code Analysis' },
  '/opportunities': { label: 'Opportunities', parent: '/analysis' },
  '/optimizations': { label: 'Optimization Candidates', parent: '/opportunities' },
  '/verification': { label: 'Verification', parent: '/optimizations' },
  '/benchmarks': { label: 'Energy Benchmark', parent: '/verification' },
  '/validation': { label: 'Optimization Validation', parent: '/benchmarks' },
  '/history': { label: 'Optimization History' },
};

function trail(pathname: string) {
  const key = pathname.startsWith('/opportunities/') ? '/opportunities' : pathname;
  const items: { to: string; label: string }[] = [];
  let cursor: string | undefined = CRUMBS[key] ? key : '/';

  while (cursor) {
    const entry = CRUMBS[cursor];
    items.unshift({ to: cursor, label: entry.label });
    cursor = entry.parent;
  }

  if (pathname.startsWith('/opportunities/')) {
    items.push({ to: pathname, label: pathname.split('/').pop() ?? '' });
  }
  return items;
}

export function Header() {
  const pathname = usePathname();
  const crumbs = trail(pathname);

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-line bg-surface px-6">
      <button
        type="button"
        className="flex items-center gap-2 rounded-md border border-line px-2.5 py-1.5 text-left transition-colors duration-150 ease-out hover:bg-subtle"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded bg-accent-soft font-mono text-2xs font-semibold text-accent-strong">
          T
        </span>
        <span className="text-xs font-medium text-ink">telemetry-ingest</span>
        <ChevronsUpDownIcon className="h-3.5 w-3.5 text-ink-3" />
      </button>

      <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
        <ol className="flex items-center gap-1 overflow-hidden">
          {crumbs.map((crumb, i) => {
            const last = i === crumbs.length - 1;
            return (
              <li key={crumb.to} className="flex shrink-0 items-center gap-1">
                {i > 0 ? <ChevronRightIcon className="h-3.5 w-3.5 text-line-strong" /> : null}
                {last ? (
                  <span aria-current="page" className="text-xs font-medium text-ink">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.to}
                    className="text-xs text-ink-3 transition-colors duration-150 ease-out hover:text-ink"
                  >
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <Badge tone="neutral">Demo data</Badge>

      <label className="relative hidden lg:block">
        <span className="sr-only">Search analyses, opportunities and experiments</span>
        <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-3" />
        <input
          type="search"
          placeholder="Search analyses, experiments…"
          className="h-8 w-64 rounded-md border border-line bg-subtle pl-8 pr-3 text-xs text-ink placeholder:text-ink-3 focus:border-line-strong focus:bg-surface focus:outline-none"
        />
      </label>

      <button
        type="button"
        className="relative flex h-8 w-8 items-center justify-center rounded-md text-ink-3 transition-colors duration-150 ease-out hover:bg-subtle hover:text-ink"
        aria-label="Notifications, 2 unread"
      >
        <BellIcon className="h-4 w-4" />
        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-danger" />
      </button>

      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-2xs font-semibold text-white">
        AK
      </span>
    </header>
  );
}
