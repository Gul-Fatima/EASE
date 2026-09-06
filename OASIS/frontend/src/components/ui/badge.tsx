"use client";

import React from 'react';
import { ActivityIcon, CheckIcon, FlaskConicalIcon, XIcon } from 'lucide-react';
import type { OptimizationStatus, Severity } from '../../types/oasis';

type Tone = 'ok' | 'warn' | 'danger' | 'info' | 'neutral' | 'teal';

const TONES: Record<Tone, string> = {
  ok: 'bg-accent-soft text-accent-strong border-accent/20',
  warn: 'bg-warn-soft text-warn border-warn/20',
  danger: 'bg-danger-soft text-danger border-danger/20',
  info: 'bg-info-soft text-info border-info/20',
  teal: 'bg-[#e6f2f1] text-[#0f766e] border-[#0f766e]/20',
  neutral: 'bg-subtle text-ink-3 border-line-strong'
};

export function Badge({
  children,
  tone = 'neutral',
  className = '',
  icon: Icon





}: {children: React.ReactNode;tone?: Tone;className?: string;icon?: React.ComponentType<{className?: string;}>;}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-2xs font-medium ${TONES[tone]} ${className}`}>
      
      {Icon ? <Icon className="h-3 w-3" /> : null}
      {children}
    </span>);

}

const STATUS_TONES: Record<OptimizationStatus, Tone> = {
  Successful: 'ok',
  Neutral: 'neutral',
  'Performance-only': 'info',
  'Energy-only': 'teal',
  Failed: 'danger',
  Rejected: 'warn'
};

export function StatusBadge({ status }: {status: OptimizationStatus;}) {
  return <Badge tone={STATUS_TONES[status]}>{status}</Badge>;
}

const SEVERITY_TONES: Record<Severity, Tone> = {
  High: 'danger',
  Medium: 'warn',
  Low: 'neutral'
};

export function SeverityBadge({ severity }: {severity: Severity;}) {
  return <Badge tone={SEVERITY_TONES[severity]}>{severity}</Badge>;
}

export function VerificationBadge({ status }: {status: 'PASS' | 'FAIL' | 'Not run';}) {
  if (status === 'PASS') {
    return (
      <Badge tone="ok" icon={CheckIcon} className="font-mono uppercase">
        Pass
      </Badge>);

  }
  if (status === 'FAIL') {
    return (
      <Badge tone="danger" icon={XIcon} className="font-mono uppercase">
        Fail
      </Badge>);

  }
  return <Badge tone="neutral">Not run</Badge>;
}

/**
 * The core epistemic distinction in OASIS: a value is either an estimate or an
 * empirical measurement. Measured values carry stronger visual authority.
 */
export function EvidenceTag({
  kind,
  className = ''



}: {kind: 'predicted' | 'measured';className?: string;}) {
  if (kind === 'measured') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded border border-accent bg-accent text-white px-1.5 py-0.5 text-2xs font-semibold uppercase tracking-wide ${className}`}>
        
        <ActivityIcon className="h-3 w-3" />
        Measured
      </span>);

  }
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border border-dashed border-warn/50 bg-warn-soft px-1.5 py-0.5 text-2xs font-medium uppercase tracking-wide text-warn ${className}`}>
      
      <FlaskConicalIcon className="h-3 w-3" />
      Predicted
    </span>);

}