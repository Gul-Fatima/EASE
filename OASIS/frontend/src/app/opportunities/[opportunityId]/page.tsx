"use client";

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowRightIcon, SparklesIcon, XIcon } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge, EvidenceTag, SeverityBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { WorkflowStepper } from '@/components/ui/WorkflowStepper';
import { analysisMeta, opportunities } from '@/data/analysis';

export function OpportunityDetail() {
  const { opportunityId } = useParams();
  const router = useRouter();
  const opportunity = opportunities.find((o) => o.id === opportunityId);

  useEffect(() => {
    if (!opportunity) {
      router.replace('/opportunities');
    }
  }, [opportunity, router]);

  if (!opportunity) return null;

  const predicted = [
  { label: 'CPU', value: opportunity.predicted.cpu },
  { label: 'Memory', value: opportunity.predicted.memory },
  { label: 'Execution time', value: opportunity.predicted.time },
  { label: 'Energy', value: opportunity.predicted.energy }];


  return (
    <div className="flex flex-col">
      <WorkflowStepper current={3} />

      <div className="px-6 py-6">
        <PageHeader
          title={opportunity.type}
          subtitle={opportunity.reason}
          meta={
          <>
              <Badge tone="neutral" className="font-mono">{opportunity.id}</Badge>
              <span className="font-mono text-xs text-ink-2">
                {analysisMeta.fileName} · {opportunity.functionName} — line {opportunity.line}
              </span>
            </>
          }
          actions={
          <>
              <Button variant="ghost" icon={XIcon}>
                Dismiss Opportunity
              </Button>
              <Button
              variant="primary"
              icon={SparklesIcon}
              onClick={() => router.push('/optimizations')}>
              
                Generate Candidates
              </Button>
            </>
          } />
        

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-4">
            <Card>
              <CardHeader title="Why was this detected?" />
              <div className="space-y-3 px-5 py-4">
                <p className="max-w-3xl text-[13px] leading-relaxed text-ink-2">
                  {opportunity.reason}
                </p>
                <p className="text-xs text-ink-3">
                  <span className="font-medium text-ink-2">Detected by:</span> AST analysis of{' '}
                  {opportunity.functionName} · dependency check on the loop variable ·{' '}
                  {opportunity.confidence}% confidence
                </p>
              </div>
            </Card>

            <Card>
              <CardHeader
                title="Suggested transformation"
                hint={opportunity.strategy}
                actions={<EvidenceTag kind="predicted" />} />
              
              <div className="grid grid-cols-1 items-stretch gap-3 p-4 lg:grid-cols-[1fr_auto_1fr]">
                <div className="min-w-0">
                  <p className="mb-2 text-2xs font-medium uppercase tracking-wide text-ink-3">
                    Code before
                  </p>
                  <CodeBlock code={opportunity.codeBefore} showLineNumbers={false} />
                </div>
                <div className="flex items-center justify-center lg:px-1">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line-strong bg-subtle">
                    <ArrowRightIcon className="h-3.5 w-3.5 text-ink-3" />
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="mb-2 text-2xs font-medium uppercase tracking-wide text-ink-3">
                    Suggested shape
                  </p>
                  <CodeBlock code={opportunity.codeAfter} showLineNumbers={false} />
                </div>
              </div>
              <p className="border-t border-line px-5 py-3 text-xs text-ink-3">
                This is the transformation family OASIS will ask the generator to explore. Concrete
                implementations are produced on the next step and are not applied to your code.
              </p>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-5">
              <dl className="space-y-3">
                <div className="flex items-center justify-between">
                  <dt className="text-xs text-ink-3">Severity</dt>
                  <dd><SeverityBadge severity={opportunity.severity} /></dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-xs text-ink-3">Confidence</dt>
                  <dd className="font-mono text-sm font-semibold text-ink tabular">
                    {opportunity.confidence}%
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-xs text-ink-3">Potential impact</dt>
                  <dd className="text-xs font-medium text-warn">{opportunity.severity}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-xs text-ink-3">Pattern</dt>
                  <dd className="text-xs text-ink-2">{opportunity.type}</dd>
                </div>
              </dl>
            </Card>

            <Card>
              <CardHeader
                title="Resource impact"
                hint="Static reasoning only"
                actions={<EvidenceTag kind="predicted" />} />
              
              <ul className="px-5 py-2">
                {predicted.map((item) =>
                <li
                  key={item.label}
                  className="flex items-center justify-between gap-3 border-b border-line/70 py-2.5 last:border-0">
                  
                    <span className="text-xs text-ink-3">{item.label}</span>
                    <span className="text-xs font-medium text-ink-2">{item.value}</span>
                  </li>
                )}
              </ul>
              <div className="border-t border-line bg-subtle px-5 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-ink-3">Measured impact</span>
                  <Badge tone="neutral">Not measured yet</Badge>
                </div>
                <p className="mt-1.5 text-2xs leading-snug text-ink-3">
                  Measured values appear only after a candidate passes verification and completes
                  benchmarking.
                </p>
              </div>
            </Card>

            <Card>
              <CardHeader title="Recommended strategy" />
              <div className="px-5 py-4">
                <p className="text-[13px] leading-relaxed text-ink-2">{opportunity.strategy}</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>);

}

export default OpportunityDetail;
