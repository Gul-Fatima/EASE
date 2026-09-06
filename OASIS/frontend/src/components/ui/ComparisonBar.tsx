"use client";

import React from 'react';

interface ComparisonBarProps {
  label: string;
  unit: string;
  original: number;
  optimized: number;
  /** Lower is better for every metric OASIS measures. */
  precision?: number;
}

export function ComparisonBar({ label, unit, original, optimized, precision = 2 }: ComparisonBarProps) {
  const max = Math.max(original, optimized);
  const change = (optimized - original) / original * 100;
  const improved = change < 0;
  const fmt = (v: number) => v.toFixed(precision === 0 ? 0 : precision).replace(/\.00$/, '');

  return (
    <div className="px-5 py-4">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-[13px] font-medium text-ink">{label}</h3>
        <span
          className={`font-mono text-[13px] font-semibold tabular ${
          improved ? 'text-accent' : 'text-danger'}`
          }>
          
          {improved ? '−' : '+'}
          {Math.abs(change).toFixed(1)}%
        </span>
      </div>

      <div className="mt-3 space-y-2">
        {[
        { name: 'Original', value: original, tone: 'bg-ink-3' },
        { name: 'Optimized', value: optimized, tone: 'bg-accent' }].
        map((row) =>
        <div key={row.name} className="flex items-center gap-3">
            <span className="w-16 shrink-0 text-2xs uppercase tracking-wide text-ink-3">
              {row.name}
            </span>
            <div className="h-2.5 flex-1 rounded-full bg-line/70">
              <div
              className={`h-full rounded-full ${row.tone}`}
              style={{ width: `${Math.max(row.value / max * 100, 3)}%` }} />
            
            </div>
            <span className="w-20 shrink-0 text-right font-mono text-xs font-medium text-ink tabular">
              {fmt(row.value)} {unit}
            </span>
          </div>
        )}
      </div>
    </div>);

}