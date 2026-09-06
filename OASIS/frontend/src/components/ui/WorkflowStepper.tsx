"use client";

import React from 'react';
import Link from 'next/link';
import { CheckIcon, LockIcon } from 'lucide-react';
import { workflowStages } from '../../data/navigation';

interface WorkflowStepperProps {
  /** 1-9, matching the OASIS pipeline stages. */
  current: number;
  /** Stages after `blockedFrom` are unreachable, e.g. correctness has failed. */
  blockedFrom?: number;
}

export function WorkflowStepper({ current, blockedFrom }: WorkflowStepperProps) {
  return (
    <nav aria-label="Optimization workflow" className="border-b border-line bg-surface">
      <ol className="flex items-stretch overflow-x-auto px-6">
        {workflowStages.map((stage) => {
          const isDone = stage.index < current;
          const isCurrent = stage.index === current;
          const isBlocked = blockedFrom !== undefined && stage.index >= blockedFrom;

          return (
            <li key={stage.id} className="shrink-0">
              <Link
                href={stage.route}
                aria-current={isCurrent ? 'step' : undefined}
                className={[
                'flex items-center gap-2 border-b-2 px-3 py-2.5 text-xs transition-colors duration-150 ease-out',
                isCurrent ?
                'border-accent font-semibold text-ink' :
                'border-transparent text-ink-3 hover:text-ink',
                isBlocked ? 'opacity-45' : ''].
                join(' ')}>
                
                <span
                  className={[
                  'flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold tabular',
                  isDone ?
                  'bg-accent text-white' :
                  isCurrent ?
                  'bg-ink text-white' :
                  isBlocked ?
                  'bg-line text-ink-3' :
                  'border border-line-strong text-ink-3'].
                  join(' ')}>
                  
                  {isDone ?
                  <CheckIcon className="h-2.5 w-2.5" strokeWidth={3} /> :
                  isBlocked ?
                  <LockIcon className="h-2 w-2" /> :

                  stage.index
                  }
                </span>
                {stage.label}
              </Link>
            </li>);

        })}
      </ol>
    </nav>);

}