"use client";

import React from 'react';
import Link from 'next/link';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import { ArrowRightIcon, PlusIcon } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge, EvidenceTag, StatusBadge } from '@/components/ui/Badge';
import { Button, ButtonLink } from '@/components/ui/Button';
import {
  energyTrend,
  headlineMetric,
  recentAnalyses,
  recentOptimizations,
  secondaryMetrics,
  statusBreakdown } from
'../data/overview';

const TONE_TEXT = {
  neutral: 'text-ink',
  ok: 'text-accent-strong',
  warn: 'text-warn',
  danger: 'text-danger'
} as const;

export function Overview() {
  const totalStatus = statusBreakdown.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="px-6 py-6">
      <PageHeader
        title="Project Overview"
        subtitle="Monitor code efficiency, optimization opportunities, and validated energy improvements."
        actions={
        <>
            <ButtonLink to="/history" variant="secondary">
              View history
            </ButtonLink>
            <Button variant="primary" icon={PlusIcon}>
              New Analysis
            </Button>
          </>
        } />
      

      {/* Primary evidence panel + supporting counts. Measured savings outrank counts, so it gets the weight. */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_1fr]">
        <Card className="flex flex-col justify-between p-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[13px] font-medium text-ink-3">{headlineMetric.label}</h2>
              <EvidenceTag kind="measured" />
            </div>
            <p className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-[44px] font-semibold leading-none tracking-tight text-ink tabular">
                {headlineMetric.value}
              </span>
              <span className="font-mono text-lg text-ink-3">{headlineMetric.unit}</span>
            </p>
            <p className="mt-2 max-w-md text-xs leading-relaxed text-ink-3">
              {headlineMetric.caption}
            </p>
          </div>

          <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-4">
            {headlineMetric.supporting.map((item) =>
            <div key={item.label}>
                <dt className="text-2xs uppercase tracking-wide text-ink-3">{item.label}</dt>
                <dd className="mt-1 font-mono text-lg font-semibold text-accent tabular">
                  {item.value}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-2xs uppercase tracking-wide text-ink-3">Measurement backend</dt>
              <dd className="mt-1 font-mono text-xs text-ink-2">CodeCarbon 2.4 + psutil</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <CardHeader title="Pipeline throughput" hint="Counts, not measurements" />
          <ul>
            {secondaryMetrics.map((metric) =>
            <li
              key={metric.label}
              className="flex items-center justify-between gap-4 border-b border-line px-5 py-[13px] last:border-0">
              
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-ink">{metric.label}</p>
                  <p className="mt-0.5 text-2xs text-ink-3">{metric.delta}</p>
                </div>
                <span
                className={`font-mono text-xl font-semibold tabular ${TONE_TEXT[metric.tone]}`}>
                
                  {metric.value}
                </span>
              </li>
            )}
          </ul>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader
            title="Energy impact — original vs optimized"
            hint="Median measured joules per experiment, last 8 experiments"
            actions={<EvidenceTag kind="measured" />} />
          
          <div className="h-[248px] px-3 py-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={energyTrend} barGap={4} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="experiment"
                  tick={{ fontSize: 11, fill: '#6d7681' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={false} />
                
                <YAxis
                  tick={{ fontSize: 11, fill: '#6d7681' }}
                  axisLine={false}
                  tickLine={false}
                  unit=" J" />
                
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    fontSize: 12,
                    boxShadow: '0 8px 24px -6px rgba(16,19,24,0.18)'
                  }}
                  formatter={(value: number) => [`${value} J`, '']} />
                
                <Legend
                  verticalAlign="top"
                  align="right"
                  height={28}
                  iconType="square"
                  iconSize={9}
                  wrapperStyle={{ fontSize: 11, color: '#6d7681' }} />
                
                <Bar dataKey="original" name="Original" fill="#9aa3ae" radius={[2, 2, 0, 0]} />
                <Bar dataKey="optimized" name="Optimized" fill="#137a4a" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Optimization status" hint={`${totalStatus} benchmarked candidates`} />
          <div className="flex items-center gap-2 px-5 py-4">
            <div className="h-[176px] w-[176px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusBreakdown}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={52}
                    outerRadius={80}
                    paddingAngle={1.5}
                    stroke="none">
                    
                    {statusBreakdown.map((entry) =>
                    <Cell key={entry.name} fill={entry.color} />
                    )}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: '1px solid #e5e7eb',
                      fontSize: 12
                    }} />
                  
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="min-w-0 flex-1 space-y-1.5">
              {statusBreakdown.map((entry) =>
              <li key={entry.name} className="flex items-center gap-2">
                  <span
                  className="h-2 w-2 shrink-0 rounded-sm"
                  style={{ backgroundColor: entry.color }} />
                
                  <span className="min-w-0 flex-1 truncate text-xs text-ink-2">{entry.name}</span>
                  <span className="font-mono text-xs text-ink tabular">{entry.value}</span>
                </li>
              )}
            </ul>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader
            title="Recent analyses"
            actions={
            <Link
              href="/analysis"
              className="text-xs font-medium text-accent-strong transition-colors duration-150 ease-out hover:text-accent">
              
                Open workspace
              </Link>
            } />
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-line bg-subtle text-2xs uppercase tracking-wide text-ink-3">
                  <th scope="col" className="px-5 py-2 font-medium">Analysis</th>
                  <th scope="col" className="px-3 py-2 font-medium">Project</th>
                  <th scope="col" className="px-3 py-2 font-medium text-right">Opps.</th>
                  <th scope="col" className="px-3 py-2 font-medium">Status</th>
                  <th scope="col" className="px-3 py-2 font-medium">Energy impact</th>
                  <th scope="col" className="px-3 py-2 font-medium">Date</th>
                  <th scope="col" className="px-5 py-2 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentAnalyses.map((row) =>
                <tr key={row.id} className="border-b border-line last:border-0">
                    <td className="px-5 py-3">
                      <p className="font-mono text-xs font-medium text-ink">{row.id}</p>
                      <p className="mt-0.5 font-mono text-2xs text-ink-3">{row.file}</p>
                    </td>
                    <td className="px-3 py-3 text-xs text-ink-2">{row.project}</td>
                    <td className="px-3 py-3 text-right font-mono text-xs text-ink tabular">
                      {row.opportunities}
                    </td>
                    <td className="px-3 py-3">
                      <Badge
                      tone={
                      row.status === 'Correctness failed' ?
                      'danger' :
                      row.status === 'Accepted' ?
                      'ok' :
                      row.status === 'Benchmarking' ?
                      'info' :
                      'neutral'
                      }>
                      
                        {row.status}
                      </Badge>
                    </td>
                    <td className="px-3 py-3">
                      <span
                      className={`font-mono text-xs tabular ${
                      row.measured ? 'font-semibold text-accent' : 'text-ink-3'}`
                      }>
                      
                        {row.energyImpact}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs text-ink-3">{row.date}</td>
                    <td className="px-5 py-3 text-right">
                      <Link
                      href="/analysis"
                      className="inline-flex items-center gap-1 text-xs font-medium text-accent-strong transition-colors duration-150 ease-out hover:text-accent">
                      
                        Open
                        <ArrowRightIcon className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader title="Recent optimizations" hint="Classified after measurement" />
          <ul>
            {recentOptimizations.map((item) =>
            <li
              key={item.id}
              className="flex items-center gap-3 border-b border-line px-5 py-3 last:border-0">
              
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-ink">{item.label}</p>
                  <p className="mt-0.5 font-mono text-2xs text-ink-3">
                    {item.id} · {item.project}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <StatusBadge status={item.status} />
                  <p className="mt-1 font-mono text-2xs text-ink-3 tabular">{item.change}</p>
                </div>
              </li>
            )}
          </ul>
        </Card>
      </div>
    </div>);

}

export default Overview;
