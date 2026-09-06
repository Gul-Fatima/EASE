"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import { CheckCircle2Icon, LoaderIcon, LockIcon, ScaleIcon } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, DefinitionList } from '@/components/ui/Card';
import { Badge, EvidenceTag } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ComparisonBar } from '@/components/ui/ComparisonBar';
import { WorkflowStepper } from '@/components/ui/WorkflowStepper';
import {
  benchmarkConfig,
  benchmarkRuns,
  energyStats,
  environment,
  measuredMetrics,
  runSamples } from
'@/data/benchmark';

const STATE_META = {
  complete: { label: 'Complete', tone: 'ok' as const, icon: CheckCircle2Icon },
  running: { label: 'Running', tone: 'info' as const, icon: LoaderIcon },
  queued: { label: 'Queued', tone: 'neutral' as const, icon: LoaderIcon },
  blocked: { label: 'Blocked · correctness failed', tone: 'danger' as const, icon: LockIcon }
};

export function Benchmarks() {
  const router = useRouter();

  return (
    <div className="flex flex-col">
      <WorkflowStepper current={7} />

      <div className="px-6 py-6">
        <PageHeader
          title="Energy Benchmark"
          subtitle="Run original and correctness-approved optimized implementations under controlled workloads and compare measured resource consumption."
          meta={
          <>
              <EvidenceTag kind="measured" />
              <span className="text-2xs text-ink-3">
                Median of 10 runs after 3 warm-ups · isolated container
              </span>
            </>
          }
          actions={
          <>
              <Button variant="secondary">Re-run benchmark</Button>
              <Button variant="primary" icon={ScaleIcon} onClick={() => router.push('/validation')}>
                View Comparison
              </Button>
            </>
          } />
        

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-4">
            <Card>
              <CardHeader title="Execution status" hint="Same workload, same environment, same run count" />
              <ul>
                {benchmarkRuns.map((run) => {
                  const meta = STATE_META[run.state];
                  const pct = run.completed / run.total * 100;
                  return (
                    <li
                      key={run.id}
                      className="flex flex-wrap items-center gap-4 border-b border-line px-5 py-3.5 last:border-0">
                      
                      <div className="min-w-[220px] flex-1">
                        <div className="flex items-center gap-2">
                          <p
                            className={`truncate text-[13px] font-medium ${
                            run.state === 'blocked' ? 'text-ink-3' : 'text-ink'}`
                            }>
                            
                            {run.label}
                          </p>
                          <Badge tone={meta.tone} icon={meta.icon}>
                            {meta.label}
                          </Badge>
                        </div>
                        <div className="mt-2 flex items-center gap-3">
                          <div className="h-1.5 max-w-xs flex-1 rounded-full bg-line">
                            <div
                              className={`h-full rounded-full transition-[width] duration-300 ease-out ${
                              run.state === 'complete' ?
                              'bg-accent' :
                              run.state === 'running' ?
                              'bg-info' :
                              'bg-line-strong'}`
                              }
                              style={{ width: `${pct}%` }} />
                            
                          </div>
                          <span className="font-mono text-2xs text-ink-3 tabular">
                            {run.completed}/{run.total} runs
                          </span>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-8">
                        <div className="text-right">
                          <p className="text-2xs uppercase tracking-wide text-ink-3">Energy</p>
                          <p className="font-mono text-sm font-semibold text-ink tabular">
                            {run.energy === null ? '—' : `${run.energy.toFixed(2)} J`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xs uppercase tracking-wide text-ink-3">Time</p>
                          <p className="font-mono text-sm font-semibold text-ink tabular">
                            {run.time === null ? '—' : `${run.time.toFixed(2)} s`}
                          </p>
                        </div>
                      </div>
                    </li>);

                })}
              </ul>
            </Card>

            <Card>
              <CardHeader
                title="Measured comparison — Candidate 1"
                hint="Original vs optimized, median across 10 runs"
                actions={<EvidenceTag kind="measured" />} />
              
              <div className="grid grid-cols-1 gap-px bg-line lg:grid-cols-2">
                {measuredMetrics.map((metric) =>
                <div key={metric.metric} className="bg-surface">
                    <ComparisonBar
                    label={metric.metric}
                    unit={metric.unit}
                    original={metric.original}
                    optimized={metric.optimized}
                    precision={metric.unit === '%' || metric.unit === 'MB' ? 0 : 2} />
                  
                  </div>
                )}
              </div>
            </Card>

            <Card>
              <CardHeader
                title="Per-run energy"
                hint="Energy measurements are noisy — OASIS aggregates across repeated executions"
                actions={<EvidenceTag kind="measured" />} />
              
              <div className="h-[220px] px-3 py-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={runSamples} margin={{ top: 4, right: 12, left: -18, bottom: 0 }}>
                    <CartesianGrid stroke="#e5e7eb" vertical={false} />
                    <XAxis
                      dataKey="run"
                      tick={{ fontSize: 11, fill: '#6d7681' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      tickLine={false} />
                    
                    <YAxis
                      domain={[0, 6]}
                      tick={{ fontSize: 11, fill: '#6d7681' }}
                      axisLine={false}
                      tickLine={false}
                      unit=" J" />
                    
                    <Tooltip
                      contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                      formatter={(value: number) => [`${value} J`, '']} />
                    
                    <Line
                      type="monotone"
                      dataKey="original"
                      name="Original"
                      stroke="#9aa3ae"
                      strokeWidth={2}
                      dot={{ r: 2.5 }} />
                    
                    <Line
                      type="monotone"
                      dataKey="optimized"
                      name="Optimized"
                      stroke="#137a4a"
                      strokeWidth={2}
                      dot={{ r: 2.5 }} />
                    
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="overflow-x-auto border-t border-line">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-line bg-subtle text-2xs uppercase tracking-wide text-ink-3">
                      <th scope="col" className="px-5 py-2 font-medium">Statistic</th>
                      <th scope="col" className="px-3 py-2 font-medium">Original</th>
                      <th scope="col" className="px-5 py-2 font-medium">Optimized</th>
                    </tr>
                  </thead>
                  <tbody>
                    {energyStats.map((stat) =>
                    <tr key={stat.label} className="border-b border-line last:border-0">
                        <td className="px-5 py-2 text-xs text-ink-2">{stat.label}</td>
                        <td className="px-3 py-2 font-mono text-xs text-ink-3 tabular">
                          {stat.original}
                        </td>
                        <td className="px-5 py-2 font-mono text-xs font-semibold text-ink tabular">
                          {stat.optimized}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader title="Benchmark configuration" />
              <div className="px-5 py-2">
                <DefinitionList items={benchmarkConfig.map((i) => ({ label: i.label, value: i.value }))} />
              </div>
            </Card>

            <Card>
              <CardHeader title="Environment" hint="Recorded with every experiment" />
              <div className="px-5 py-2">
                <DefinitionList items={environment.map((i) => ({ label: i.label, value: i.value }))} />
              </div>
            </Card>

            <Card className="border-accent/30 bg-accent-soft/40 p-4">
              <div className="flex items-center gap-2">
                <EvidenceTag kind="measured" />
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-accent-strong">
                Every figure on this screen comes from executed code, not from static prediction.
                Predicted rankings from the candidate screen carry no authority here.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>);

}

export default Benchmarks;
