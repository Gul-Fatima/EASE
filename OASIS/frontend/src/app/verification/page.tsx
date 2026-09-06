"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2Icon,
  ChevronDownIcon,
  GaugeIcon,
  OctagonAlertIcon,
  ShieldCheckIcon,
  XCircleIcon } from
'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, DefinitionList } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { WorkflowStepper } from '@/components/ui/WorkflowStepper';
import { candidates } from '@/data/candidates';
import { failedCandidateTests, verificationSummary, verificationTests } from '@/data/verification';
import type { VerificationTest } from '@/types/oasis';

const GATES = [
{ label: 'Candidate', state: 'done' as const },
{ label: 'Correctness Test', state: 'done' as const },
{ label: 'Performance Test', state: 'current' as const },
{ label: 'Energy Test', state: 'upcoming' as const }];


function Gate({ index }: {index: number;}) {
  const gate = GATES[index];
  const isLast = index === GATES.length - 1;
  return (
    <li className="flex min-w-0 flex-1 items-center gap-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          className={[
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-2xs font-semibold',
          gate.state === 'done' ?
          'bg-accent text-white' :
          gate.state === 'current' ?
          'bg-ink text-white' :
          'border border-line-strong text-ink-3'].
          join(' ')}>
          
          {gate.state === 'done' ? <CheckCircle2Icon className="h-3.5 w-3.5" /> : index + 1}
        </span>
        <div className="min-w-0">
          <p
            className={`truncate text-[13px] ${
            gate.state === 'upcoming' ? 'text-ink-3' : 'font-medium text-ink'}`
            }>
            
            {gate.label}
          </p>
          <p className="text-2xs text-ink-3">
            {gate.state === 'done' ? 'Passed' : gate.state === 'current' ? 'Running' : 'Waiting'}
          </p>
        </div>
      </div>
      {!isLast ? <span className="h-px min-w-6 flex-1 bg-line" /> : null}
    </li>);

}

function TestRow({ test }: {test: VerificationTest;}) {
  const [open, setOpen] = useState(false);
  const failed = test.status === 'Fail';

  return (
    <>
      <tr className="border-b border-line last:border-0">
        <td className="px-5 py-2.5">
          <button
            type="button"
            disabled={!failed}
            onClick={() => setOpen((v) => !v)}
            className={`flex items-center gap-2 text-left font-mono text-xs ${
            failed ? 'text-danger hover:underline' : 'cursor-default text-ink-2'}`
            }>
            
            {failed ?
            <ChevronDownIcon
              className={`h-3.5 w-3.5 transition-transform duration-150 ease-out ${
              open ? 'rotate-0' : '-rotate-90'}`
              } /> :


            <span className="w-3.5" />
            }
            {test.name}
          </button>
        </td>
        <td className="px-3 py-2.5 text-xs text-ink-3">{test.group}</td>
        <td className="px-3 py-2.5">
          {failed ?
          <Badge tone="danger" icon={XCircleIcon}>Fail</Badge> :

          <Badge tone="ok" icon={CheckCircle2Icon}>Pass</Badge>
          }
        </td>
        <td className="px-3 py-2.5 font-mono text-xs text-ink-2 tabular">{test.runtime}</td>
        <td className="px-5 py-2.5 text-xs text-ink-3">{test.details}</td>
      </tr>
      {failed && open ?
      <tr className="border-b border-line bg-danger-soft/50">
          <td colSpan={5} className="px-5 py-3">
            <pre className="oasis-scroll overflow-x-auto rounded-md border border-danger/20 bg-surface p-3 font-mono text-2xs leading-relaxed text-danger">
              {test.error}
            </pre>
          </td>
        </tr> :
      null}
    </>);

}

export function Verification() {
  const router = useRouter();
  const failedCandidate = candidates[2];

  return (
    <div className="flex flex-col">
      <WorkflowStepper current={6} />

      <div className="px-6 py-6">
        <PageHeader
          title="Candidate Verification"
          subtitle="Correctness is the first gate. A candidate that changes behaviour never reaches energy benchmarking, regardless of how promising its prediction was."
          meta={
          <>
              <Badge tone="neutral" className="font-mono">CD-01</Badge>
              <span className="text-xs text-ink-2">{verificationSummary.candidate}</span>
              <span className="text-2xs text-ink-3">{verificationSummary.suite}</span>
            </>
          }
          actions={
          <Button variant="primary" icon={GaugeIcon} onClick={() => router.push('/benchmarks')}>
              Run Benchmark
            </Button>
          } />
        

        <Card className="mb-4">
          <CardHeader title="Safety gate" hint="Correctness → performance → energy" />
          <ol className="flex flex-wrap items-center gap-4 px-5 py-4">
            {GATES.map((_, i) =>
            <Gate key={GATES[i].label} index={i} />
            )}
          </ol>
        </Card>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_340px]">
          <div className="min-w-0 space-y-4">
            <Card className="border-accent/40">
              <div className="flex flex-wrap items-center justify-between gap-6 px-5 py-5">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft">
                    <ShieldCheckIcon className="h-6 w-6 text-accent" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-mono text-2xl font-semibold tracking-tight text-accent-strong">
                        PASS
                      </h2>
                      <Badge tone="ok">Cleared for benchmarking</Badge>
                    </div>
                    <p className="mt-1 text-[13px] text-ink-3">
                      Functional behaviour preserved across all required checks.
                    </p>
                  </div>
                </div>
                <dl className="flex flex-wrap gap-x-8 gap-y-3">
                  <div>
                    <dt className="text-2xs uppercase tracking-wide text-ink-3">Tests passed</dt>
                    <dd className="mt-1 font-mono text-lg font-semibold text-ink tabular">
                      {verificationSummary.testsPassed} / {verificationSummary.total}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-2xs uppercase tracking-wide text-ink-3">Tests failed</dt>
                    <dd className="mt-1 font-mono text-lg font-semibold text-ink tabular">
                      {verificationSummary.testsFailed}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-2xs uppercase tracking-wide text-ink-3">Suite duration</dt>
                    <dd className="mt-1 font-mono text-lg font-semibold text-ink tabular">
                      {verificationSummary.duration}
                    </dd>
                  </div>
                </dl>
              </div>
            </Card>

            <Card>
              <CardHeader
                title="Test details"
                hint={`${verificationTests.length} of ${verificationSummary.total} shown`} />
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-line bg-subtle text-2xs uppercase tracking-wide text-ink-3">
                      <th scope="col" className="px-5 py-2 font-medium">Test</th>
                      <th scope="col" className="px-3 py-2 font-medium">Group</th>
                      <th scope="col" className="px-3 py-2 font-medium">Status</th>
                      <th scope="col" className="px-3 py-2 font-medium">Runtime</th>
                      <th scope="col" className="px-5 py-2 font-medium">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {verificationTests.map((test) =>
                    <TestRow key={test.id} test={test} />
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="border-danger/30">
              <CardHeader
                title={`Rejected — ${failedCandidate.name}`}
                hint="Candidate removed from benchmarking because correctness verification failed"
                actions={<Badge tone="danger" icon={OctagonAlertIcon}>Blocked</Badge>} />
              
              <div className="flex items-start gap-2.5 border-b border-line bg-danger-soft/40 px-5 py-3">
                <OctagonAlertIcon className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                <p className="text-xs leading-relaxed text-danger">
                  Candidate rejected from benchmarking because correctness verification failed. Its
                  predicted energy potential was the highest of the three candidates — prediction does
                  not override the correctness gate.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-line bg-subtle text-2xs uppercase tracking-wide text-ink-3">
                      <th scope="col" className="px-5 py-2 font-medium">Test</th>
                      <th scope="col" className="px-3 py-2 font-medium">Group</th>
                      <th scope="col" className="px-3 py-2 font-medium">Status</th>
                      <th scope="col" className="px-3 py-2 font-medium">Runtime</th>
                      <th scope="col" className="px-5 py-2 font-medium">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {failedCandidateTests.map((test) =>
                    <TestRow key={test.id} test={test} />
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader title="Verification summary" />
              <ul className="px-5 py-2">
                {verificationSummary.groups.map((group) => {
                  const complete = group.passed === group.total;
                  return (
                    <li
                      key={group.label}
                      className="flex items-center justify-between gap-3 border-b border-line/70 py-2.5 last:border-0">
                      
                      <span className="text-xs text-ink-2">{group.label}</span>
                      <span className="flex items-center gap-2">
                        <span className="font-mono text-xs text-ink tabular">
                          {group.passed}/{group.total}
                        </span>
                        {complete ?
                        <CheckCircle2Icon className="h-3.5 w-3.5 text-accent" /> :

                        <XCircleIcon className="h-3.5 w-3.5 text-danger" />
                        }
                      </span>
                    </li>);

                })}
              </ul>
            </Card>

            <Card>
              <CardHeader title="Execution environment" hint="Sandboxed" />
              <div className="px-5 py-2">
                <DefinitionList
                  items={[
                  { label: 'Runner', value: 'pytest 8.2' },
                  { label: 'Isolation', value: 'Container' },
                  { label: 'Network', value: 'Disabled' },
                  { label: 'Filesystem', value: 'Read-only + tmp' },
                  { label: 'Timeout', value: '60 s' }]
                  } />
                
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-[13px] font-semibold text-ink">Why correctness comes first</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-3">
                An energy reduction is meaningless if the optimized program produces different
                results. Candidates must pass the correctness gate before any measurement is taken or
                reported.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>);

}

export default Verification;
