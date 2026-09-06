"use client";

import React from 'react';
import Link from 'next/link';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

const VARIANTS: Record<Variant, string> = {
  primary:
  'bg-accent text-white border border-accent hover:bg-accent-strong hover:border-accent-strong',
  secondary:
  'bg-surface text-ink-2 border border-line-strong hover:bg-subtle hover:text-ink',
  ghost: 'bg-transparent text-ink-3 border border-transparent hover:bg-line/60 hover:text-ink',
  danger: 'bg-surface text-danger border border-danger/30 hover:bg-danger-soft'
};

const SIZES: Record<Size, string> = {
  sm: 'h-7 px-2.5 text-xs gap-1.5',
  md: 'h-9 px-3.5 text-[13px] gap-2'
};

interface BaseProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  icon?: React.ComponentType<{className?: string;}>;
}

function classes(variant: Variant, size: Size, className: string, disabled?: boolean) {
  return [
  'inline-flex items-center justify-center rounded-md font-medium',
  'transition-colors duration-150 ease-out',
  VARIANTS[variant],
  SIZES[size],
  disabled ? 'pointer-events-none opacity-45' : '',
  className].

  filter(Boolean).
  join(' ');
}

export function Button({
  children,
  variant = 'secondary',
  size = 'md',
  className = '',
  icon: Icon,
  disabled,
  ...rest
}: BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={classes(variant, size, className, disabled)}
      {...rest}>
      
      {Icon ? <Icon className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} /> : null}
      {children}
    </button>);

}

export function ButtonLink({
  children,
  to,
  variant = 'secondary',
  size = 'md',
  className = '',
  icon: Icon
}: BaseProps & {to: string;}) {
  return (
    <Link href={to} className={classes(variant, size, className)}>
      {Icon ? <Icon className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} /> : null}
      {children}
    </Link>);

}