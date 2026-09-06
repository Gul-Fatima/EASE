"use client";

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDownIcon, DownloadIcon, SearchIcon, XIcon } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, DefinitionList } from '@/components/ui/Card';
import { Badge, EvidenceTag, StatusBadge, VerificationBadge } from '@/components/ui/Badge';
import { Button, ButtonLink } from '@/components/ui/Button';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { experiments, historyFilters } from '@/data/history';
import { originalCode } from '@/data/candidates';
import { environment } from '@/data/benchmark';
import type { Experiment } from '@/types/oasis';

function ChangeCell({ value }: {value: number | null;}) {
  if (value === null) return <span className="font-mono text-xs text-ink-3">Not measured</span>;
  const improved = value < 0;
  return (
    <span
      className={`font-mono text-xs font-semibold tabular ${improved ? 'text-accent' : 'text-danger'}`}>
      
      {improved ? '−' : '+'}
      {Math.abs(value).toFixed(1)}%
    </span>);

}

function ExperimentDrawer({
  experiment,
  onClose



}: {experiment: Experiment;onClose: () => void;}) {
  return (
    <motion.aside
      key={experiment.id}
      initial={{ x: 24, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 24, opacity: 0 }}
      transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
      aria-label={`Experiment record ${experiment.id}`}
      className="oasis-scroll fixed right-0 top-14 z-20 h-[calc(100%-3.5rem)] w-[440px] overflow-y-auto border-l border-line bg-surface shadow-pop">
      
      <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-line bg-surface px-5 py-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-mono text-sm font-semibold text-ink">{experiment.id}</h2>
            <StatusBadge status={experiment.decision} />
          </div>
          <p className="mt-1 text-xs text-ink-3">
            {experiment.project} · {experiment.timestamp}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close experiment record"
          className="rounded-md p-1 text-ink-3 transition-colors duration-150 ease-out hover:bg-subtle hover:text-ink">
          
          <XIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-5 px-5 py-5">
        <section>
          <h3 className="text-2xs font-semibold uppercase tracking-wide text-ink-3">
            Detected opportunity
          </h3>
          <p className="mt-1.5 text-[13px] text-ink-2">{experiment.opportunity}</p>
        </section>

        <section>
          <h3 className="text-2xs font-semibold uppercase tracking-wide text-ink-3">
            Original code
          </h3>
          <div className="mt-2">
            <CodeBlock code={originalCode} maxHeight="180px" />
          </div>
        </section>

        <section>
          <h3 className="text-2xs font-semibold uppercase tracking-wide text-ink-3">
            Candidate &amp; prediction
          </h3>
          <div className="mt-1.5">
            <DefinitionList
              items={[
              { label: 'Candidate', value: experiment.candidate },
              { label: 'Strategy', value: experiment.strategy },
              { label: 'Predicted impact', value: 'High' },
              { label: 'Transformation risk', value: 'Low' }]
              } />
            
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h3 className="text-2xs font-semibold uppercase tracking-wide text-ink-3">
              Verification
            </h3>
            <VerificationBadge status={experiment.verification} />
          </div>
          <div className="mt-1.5">
            <DefinitionList
              items={[
              { label: 'Tests passed', value: experiment.verification === 'PASS' ? '24 / 24' : '22 / 24' },
              { label: 'Suite', value: 'pytest 8.2' }]
              } />
            
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h3 className="text-2xs font-semibold uppercase tracking-wide text-ink-3">
              Measurements
            </h3>
            <EvidenceTag kind="measured" />
          </div>
          <div className="mt-1.5">
            <DefinitionList
              items={[
              {
                label: 'Energy change',
                value: experiment.energyChange === null ? 'Not measured' : `${experiment.energyChange}%`
              },
              {
                label: 'Execution time change',
                value:
                experiment.performanceChange === null ?
                'Not measured' :
                `${experiment.performanceChange}%`
              },
              { label: 'Executions', value: '10 runs + 3 warm-ups' },
              { label: 'Backend', value: 'CodeCarbon 2.4' }]
              } />
            
          </div>
        </section>

        <section>
          <h3 className="text-2xs font-semibold uppercase tracking-wide text-ink-3">Environment</h3>
          <div className="mt-1.5">
            <DefinitionList items={environment.slice(0, 5).map((i) => ({ label: i.label, value: i.value }))} />
          </div>
        </section>

        <section>
          <h3 className="text-2xs font-semibold uppercase tracking-wide text-ink-3">
            Final decision
          </h3>
          <div className="mt-2 flex items-center gap-2">
            <StatusBadge status={experiment.decision} />
            <span className="font-mono text-2xs text-ink-3">{experiment.timestamp}</span>
          </div>
        </section>

        <ButtonLink to="/validation" variant="secondary" className="w-full">
          Open validation record
        </ButtonLink>
      </div>
    </motion.aside>);

}

export function History() {
  const [selected, setSelected] = useState<Experiment | null>(null);

  return (
    <div className="px-6 py-6">
      <PageHeader
        title="Optimization History"
        subtitle="Every experiment is stored with its code, prediction, verification result, measurements and final decision, so any result can be traced and reproduced."
        actions={
        <Button variant="secondary" icon={DownloadIcon}>
            Export results
          </Button>
        } />
      

      <Card className="mb-4 p-4">
        <div className="flex flex-wrap items-end gap-3">
          <label className="relative min-w-[220px] flex-1">
            <span className="mb-1 block text-2xs font-medium uppercase tracking-wide text-ink-3">
              Search
            </span>
            <SearchIcon className="pointer-events-none absolute bottom-2.5 left-2.5 h-3.5 w-3.5 text-ink-3" />
            <input
              type="search"
              placeholder="Experiment ID, opportunity, candidate…"
              className="h-8 w-full rounded-md border border-line bg-subtle pl-8 pr-3 text-xs text-ink placeholder:text-ink-3 focus:border-line-strong focus:bg-surface focus:outline-none" />
            
          </label>

          {historyFilters.map((filter) =>
          <label key={filter.label} className="relative">
              <span className="mb-1 block text-2xs font-medium uppercase tracking-wide text-ink-3">
                {filter.label}
              </span>
              <select
              className="h-8 appearance-none rounded-md border border-line bg-subtle pl-2.5 pr-7 text-xs text-ink focus:border-line-strong focus:bg-surface focus:outline-none"
              defaultValue={filter.options[0]}>
              
                {filter.options.map((option) =>
              <option key={option}>{option}</option>
              )}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute bottom-2.5 right-2 h-3.5 w-3.5 text-ink-3" />
            </label>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader
          title={`${experiments.length} experiments`}
          hint="Select a row to open the full experiment record"
          actions={<Badge tone="neutral">Python</Badge>} />
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line bg-subtle text-2xs uppercase tracking-wide text-ink-3">
                <th scope="col" className="px-5 py-2.5 font-medium">Experiment</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Project</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Opportunity</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Candidate</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Verification</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Energy</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Performance</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Decision</th>
                <th scope="col" className="px-5 py-2.5 font-medium">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {experiments.map((experiment) =>
              <tr
                key={experiment.id}
                onClick={() => setSelected(experiment)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setSelected(experiment);
                }}
                className={`cursor-pointer border-b border-line transition-colors duration-150 ease-out last:border-0 hover:bg-subtle ${
                selected?.id === experiment.id ? 'bg-accent-soft/50' : ''}`
                }>
                
                  <td className="px-5 py-3 font-mono text-xs font-medium text-ink">
                    {experiment.id}
                  </td>
                  <td className="px-3 py-3 text-xs text-ink-2">{experiment.project}</td>
                  <td className="max-w-[240px] px-3 py-3 text-xs text-ink-2">
                    <span className="block truncate">{experiment.opportunity}</span>
                  </td>
                  <td className="px-3 py-3 text-xs text-ink-2">{experiment.candidate}</td>
                  <td className="px-3 py-3">
                    <VerificationBadge status={experiment.verification} />
                  </td>
                  <td className="px-3 py-3">
                    <ChangeCell value={experiment.energyChange} />
                  </td>
                  <td className="px-3 py-3">
                    <ChangeCell value={experiment.performanceChange} />
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge status={experiment.decision} />
                  </td>
                  <td className="px-5 py-3 font-mono text-2xs text-ink-3">{experiment.timestamp}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <AnimatePresence>
        {selected ?
        <ExperimentDrawer experiment={selected} onClose={() => setSelected(null)} /> :
        null}
      </AnimatePresence>
    </div>);

}

export default History;
