"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { CheckIcon, CircleCheckBigIcon, CodeIcon, ShieldCheckIcon, XIcon } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge, EvidenceTag, VerificationBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { WorkflowStepper } from '@/components/ui/WorkflowStepper';
import { candidateRanking, comparisonTable } from '@/data/benchmark';

const HEADLINE = [
{ label: 'Energy', original: '5.20 J', optimized: '2.10 J', reduction: '59.6%' },
{ label: 'Execution time', original: '1.80 s', optimized: '0.80 s', reduction: '55.6%' }];


export function Validation() {
  const router = useRouter();

  return (
    <div className="flex flex-col">
      <WorkflowStepper current={9} />

      <div className="px-6 py-6">
        <PageHeader
          title="Optimization Validation"
          subtitle="The decision point. Measured evidence outranks every prediction made earlier in the pipeline."
          meta={
          <>
              <Badge tone="neutral" className="font-mono">EX-208</Badge>
              <span className="text-xs text-ink-2">Candidate 1 — Loop Optimization</span>
              <EvidenceTag kind="measured" />
            </>
          }
          actions={
          <>
              <Button variant="secondary" icon={CodeIcon} onClick={() => router.push('/optimizations')}>
                Review Code
              </Button>
              <Button
              variant="secondary"
              icon={ShieldCheckIcon}
              onClick={() => router.push('/verification')}>
              
                View Verification
              </Button>
            </>
          } />
        

        <Card className="mb-4 border-accent/40">
          <div className="flex flex-wrap items-start justify-between gap-8 px-6 py-6">
            <div className="max-w-md">
              <div className="flex items-center gap-2.5">
                <CircleCheckBigIcon className="h-6 w-6 text-accent" />
                <h2 className="text-xl font-semibold tracking-tight text-accent-strong">
                  Validated Optimization
                </h2>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-2">
                Energy consumption decreased while functional correctness was preserved. This
                classification is based on measured execution, not on the earlier prediction.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="text-xs text-ink-3">Correctness</span>
                <VerificationBadge status="PASS" />
                <span className="font-mono text-xs text-ink-3">24 / 24 tests</span>
              </div>
            </div>

            <dl className="flex flex-wrap gap-10">
              {HEADLINE.map((item) =>
              <div key={item.label}>
                  <dt className="text-2xs uppercase tracking-wide text-ink-3">{item.label}</dt>
                  <dd className="mt-1.5">
                    <p className="font-mono text-3xl font-semibold leading-none text-accent tabular">
                      −{item.reduction}
                    </p>
                    <p className="mt-2 font-mono text-xs text-ink-3 tabular">
                      {item.original} → <span className="font-semibold text-ink">{item.optimized}</span>
                    </p>
                  </dd>
                </div>
              )}
            </dl>

            <div className="flex shrink-0 flex-col gap-2 self-center">
              <Button variant="primary" icon={CheckIcon}>
                Accept Optimization
              </Button>
              <Button variant="danger" icon={XIcon}>
                Reject Optimization
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-4">
            <Card>
              <CardHeader
                title="Detailed comparison"
                hint="Original vs optimized, median of 10 measured runs"
                actions={<EvidenceTag kind="measured" />} />
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-line bg-subtle text-2xs uppercase tracking-wide text-ink-3">
                      <th scope="col" className="px-5 py-2.5 font-medium">Metric</th>
                      <th scope="col" className="px-3 py-2.5 font-medium">Original</th>
                      <th scope="col" className="px-3 py-2.5 font-medium">Optimized</th>
                      <th scope="col" className="px-5 py-2.5 font-medium text-right">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonTable.map((row) =>
                    <tr key={row.metric} className="border-b border-line last:border-0">
                        <td className="px-5 py-2.5 text-[13px] font-medium text-ink">{row.metric}</td>
                        <td className="px-3 py-2.5 font-mono text-xs text-ink-3 tabular">
                          {row.original}
                        </td>
                        <td className="px-3 py-2.5 font-mono text-xs font-semibold text-ink tabular">
                          {row.optimized}
                        </td>
                        <td
                        className={`px-5 py-2.5 text-right font-mono text-xs font-semibold tabular ${
                        row.direction === 'improved' ?
                        'text-accent' :
                        row.direction === 'regressed' ?
                        'text-danger' :
                        'text-ink-3'}`
                        }>
                        
                          {row.change}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card>
              <CardHeader
                title="Candidate ranking"
                hint="Final ordering after measurement — predicted ranking is shown for contrast" />
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-line bg-subtle text-2xs uppercase tracking-wide text-ink-3">
                      <th scope="col" className="px-5 py-2.5 font-medium">Candidate</th>
                      <th scope="col" className="px-3 py-2.5 font-medium">Predicted</th>
                      <th scope="col" className="px-3 py-2.5 font-medium">Correctness</th>
                      <th scope="col" className="px-3 py-2.5 font-medium">Measured energy</th>
                      <th scope="col" className="px-3 py-2.5 font-medium">Performance</th>
                      <th scope="col" className="px-3 py-2.5 font-medium">Risk</th>
                      <th scope="col" className="px-5 py-2.5 font-medium">Final status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidateRanking.map((row) => {
                      const failed = row.correctness === 'FAIL';
                      return (
                        <tr key={row.candidate} className="border-b border-line last:border-0">
                          <td className="px-5 py-3 text-[13px] text-ink">{row.candidate}</td>
                          <td className="px-3 py-3 text-xs text-warn">{row.predicted}</td>
                          <td className="px-3 py-3">
                            <VerificationBadge status={failed ? 'FAIL' : 'PASS'} />
                          </td>
                          <td
                            className={`px-3 py-3 font-mono text-xs tabular ${
                            failed ? 'text-ink-3' : 'font-semibold text-accent'}`
                            }>
                            
                            {row.measuredEnergy}
                          </td>
                          <td
                            className={`px-3 py-3 font-mono text-xs tabular ${
                            failed ? 'text-ink-3' : 'text-ink-2'}`
                            }>
                            
                            {row.performance}
                          </td>
                          <td className="px-3 py-3 text-xs text-ink-2">{row.risk}</td>
                          <td className="px-5 py-3">
                            <Badge tone={failed ? 'danger' : 'ok'}>{row.status}</Badge>
                          </td>
                        </tr>);

                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader title="Evidence summary" hint="Why OASIS recommends accepting" />
              <ol className="px-5 py-3">
                {[
                {
                  title: 'Correctness preserved',
                  body: '24 of 24 tests passed, including regression, edge case and exception behaviour checks.',
                  tone: 'ok' as const
                },
                {
                  title: 'Energy reduction measured',
                  body: 'Median 5.20 J → 2.10 J across 10 executions (σ 0.10 / 0.05), well beyond run-to-run noise.',
                  tone: 'ok' as const
                },
                {
                  title: 'No performance regression',
                  body: 'Execution time fell 55.6% and memory use fell 13.3% under the same workload.',
                  tone: 'ok' as const
                },
                {
                  title: 'Prediction did not decide this',
                  body: 'Candidate 3 had the highest predicted energy potential but failed the correctness gate and was never measured.',
                  tone: 'warn' as const
                }].
                map((item, i) =>
                <li
                  key={item.title}
                  className="flex gap-3 border-b border-line/70 py-3 last:border-0">
                  
                    <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-2xs font-semibold ${
                    item.tone === 'ok' ?
                    'bg-accent-soft text-accent-strong' :
                    'bg-warn-soft text-warn'}`
                    }>
                    
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-[13px] font-medium text-ink">{item.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-ink-3">{item.body}</p>
                    </div>
                  </li>
                )}
              </ol>
            </Card>

            <Card className="p-4">
              <h3 className="text-[13px] font-semibold text-ink">Acceptance criteria</h3>
              <ul className="mt-2.5 space-y-2">
                {[
                { label: 'Correctness = PASS', met: true },
                { label: 'Energy improvement > 10%', met: true },
                { label: 'No unacceptable performance regression', met: true }].
                map((rule) =>
                <li key={rule.label} className="flex items-center gap-2 text-xs text-ink-2">
                    <CheckIcon className="h-3.5 w-3.5 text-accent" strokeWidth={2.5} />
                    {rule.label}
                  </li>
                )}
              </ul>
              <p className="mt-3 text-2xs leading-snug text-ink-3">
                Thresholds are configurable per project. The final decision stays with the developer.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>);

}

export default Validation;
