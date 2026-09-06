"use client";

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article';
}

export function Card({ children, className = '', as = 'section' }: CardProps) {
  const Tag = as;
  return (
    <Tag className={`rounded-card border border-line bg-surface shadow-card ${className}`}>
      {children}
    </Tag>);

}

interface CardHeaderProps {
  title: string;
  hint?: string;
  actions?: React.ReactNode;
  level?: 2 | 3;
}

export function CardHeader({ title, hint, actions, level = 2 }: CardHeaderProps) {
  const Heading = level === 2 ? 'h2' : 'h3';
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-3.5">
      <div className="min-w-0">
        <Heading className="text-[13px] font-semibold tracking-tight text-ink">{title}</Heading>
        {hint ? <p className="mt-0.5 text-xs text-ink-3">{hint}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>);

}

export function DefinitionList({
  items,
  columns = 1



}: {items: {label: string;value: React.ReactNode;}[];columns?: 1 | 2;}) {
  return (
    <dl className={columns === 2 ? 'grid grid-cols-2 gap-x-6' : 'block'}>
      {items.map((item) =>
      <div
        key={item.label}
        className="flex items-baseline justify-between gap-4 border-b border-line/70 py-2 last:border-0">
        
          <dt className="text-xs text-ink-3">{item.label}</dt>
          <dd className="font-mono text-xs font-medium text-ink-2 tabular">{item.value}</dd>
        </div>
      )}
    </dl>);

}