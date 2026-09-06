"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GaugeIcon, ShieldCheckIcon, TrophyIcon } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge, EvidenceTag, VerificationBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CodeBlock, DiffPane } from '@/components/ui/CodeBlock';
import { WorkflowStepper } from '@/components/ui/WorkflowStepper';
import { candidateDiff, candidates, originalCode } from '@/data/candidates';
import { opportunities } from '@/data/analysis';
import type { Candidate } from '@/types/oasis';

function PredictionMeter({ label, value }: {label: string;value: number;}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-2xs text-ink-3">{label}</span>
        <span className="font-mono text-2xs font-medium text-ink-2 tabular">{value}</span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-line">
        <div
          className="h-full rounded-full bg-warn/70"
          style={{ width: `${Math.min(Math.abs(value), 100)}%` }} />
        
      </div>
    </div>);

}

function CandidateCard({
  candidate,
  isSelected,
  onSelect,
  featured





}: {candidate: Candidate;isSelected: boolean;onSelect: () => void;featured: boolean;}) {
  const router = useRouter();
  const failed = candidate.verification === 'FAIL';

  return (
    <Card
      as="article"
      className={`flex min-w-0 flex-col transition-colors duration-150 ease-out ${
      isSelected ? 'border-accent/60 ring-1 ring-accent/25' : ''}`
      }>
      
      <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {featured ?
            <Badge tone="warn" icon={TrophyIcon}>#1 Ranked prediction</Badge> :

            <Badge tone="neutral">#{candidate.rank} ranked</Badge>
            }
            <VerificationBadge status={candidate.verification} />
          </div>
          <h3
            className={`mt-2 font-semibold tracking-tight text-ink ${
            featured ? 'text-[15px]' : 'text-[13px]'}`
            }>
            
            {candidate.name}
          </h3>
          <p className="mt-0.5 font-mono text-2xs text-ink-3">{candidate.strategy}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-2xs uppercase tracking-wide text-ink-3">Score</p>
          <p className="font-mono text-xl font-semibold text-ink tabular">{candidate.score}</p>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col px-4 py-3">
        <p className="text-xs leading-relaxed text-ink-2">{candidate.explanation}</p>

        <div className="mt-3 min-w-0">
          <CodeBlock
            code={candidate.code}
            showLineNumbers={false}
            maxHeight={featured ? '208px' : '148px'} />
          
        </div>

        <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-2.5">
          <PredictionMeter label="Energy potential" value={candidate.predictedEnergy} />
          <PredictionMeter label="Performance potential" value={candidate.predictedPerformance} />
          <PredictionMeter label="Correctness confidence" value={candidate.correctnessConfidence} />
          <div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-2xs text-ink-3">Memory impact</span>
              <span className="font-mono text-2xs font-medium text-ink-2 tabular">
                {candidate.memoryImpact > 0 ? '−' : '+'}
                {Math.abs(candidate.memoryImpact)}%
              </span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-line">
              <div
                className={`h-full rounded-full ${candidate.memoryImpact > 0 ? 'bg-warn/70' : 'bg-danger/60'}`}
                style={{ width: `${Math.min(Math.abs(candidate.memoryImpact) * 3, 100)}%` }} />
              
            </div>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-1.5 border-t border-line pt-3 text-2xs">
          <div className="flex justify-between gap-2">
            <dt className="text-ink-3">Complexity</dt>
            <dd className="font-mono text-ink-2">{candidate.complexity}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-ink-3">Transformation risk</dt>
            <dd
              className={`font-medium ${
              candidate.risk === 'High' ?
              'text-danger' :
              candidate.risk === 'Moderate' ?
              'text-warn' :
              'text-accent-strong'}`
              }>
              
              {candidate.risk}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-ink-3">Measured energy</dt>
            <dd className={`font-mono ${candidate.measuredEnergy === null ? 'text-ink-3' : 'font-semibold text-accent'}`}>
              {candidate.measuredEnergy === null ? 'Not measured' : `${candidate.measuredEnergy}%`}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-ink-3">Status</dt>
            <dd className={failed ? 'text-danger' : 'text-ink-2'}>{candidate.status}</dd>
          </div>
        </dl>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button size="sm" variant="secondary" onClick={onSelect}>
            {isSelected ? 'Comparing' : 'Compare'}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            icon={ShieldCheckIcon}
            onClick={() => router.push('/verification')}>
            
            Verify
          </Button>
          <Button
            size="sm"
            variant={featured ? 'primary' : 'secondary'}
            icon={GaugeIcon}
            disabled={failed}
            onClick={() => router.push('/benchmarks')}>
            
            Run Benchmark
          </Button>
          {failed ?
          <span className="text-2xs text-danger">Blocked by correctness gate</span> :
          null}
        </div>
      </div>
    </Card>);

}

export function Optimizations() {
  const [selectedId, setSelectedId] = useState(candidates[0].id);
  const selected = candidates.find((c) => c.id === selectedId) ?? candidates[0];
  const opportunity = opportunities[0];

  return (
    <div className="flex flex-col">
      <WorkflowStepper current={5} />

      <div className="px-6 py-6">
        <PageHeader
          title="Optimization Candidates"
          subtitle="Alternative implementations generated for the selected opportunity, ranked by predicted potential. Ranking is a prediction used to prioritise work — it is not proof of a saving."
          meta={
          <>
              <Badge tone="neutral" className="font-mono">{opportunity.id}</Badge>
              <span className="text-xs text-ink-2">
                {opportunity.type} · {opportunity.functionName} L{opportunity.line}
              </span>
              <EvidenceTag kind="predicted" />
            </>
          }
          actions={
          <Button variant="secondary">Regenerate candidates</Button>
          } />
        

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
          <div className="space-y-4">
            <Card>
              <CardHeader title="Original implementation" hint="Baseline reference" />
              <div className="p-3">
                <CodeBlock code={originalCode} maxHeight="320px" />
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-[13px] font-semibold text-ink">How ranking works</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-3">
                Optimization score combines energy potential, performance potential, resource
                efficiency and correctness confidence, minus transformation risk.
              </p>
              <p className="mt-2.5 text-xs leading-relaxed text-ink-3">
                Generated code is a suggestion. OASIS only treats a candidate as an improvement after
                correctness verification and empirical measurement.
              </p>
            </Card>
          </div>

          <div className="min-w-0 space-y-4">
            <CandidateCard
              candidate={candidates[0]}
              featured
              isSelected={selectedId === candidates[0].id}
              onSelect={() => setSelectedId(candidates[0].id)} />
            

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {candidates.slice(1).map((candidate) =>
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                featured={false}
                isSelected={selectedId === candidate.id}
                onSelect={() => setSelectedId(candidate.id)} />

              )}
            </div>
          </div>
        </div>

        <Card className="mt-4">
          <CardHeader
            title="Code comparison"
            hint={`Original vs ${selected.name} · line-level diff`}
            actions={
            <div className="flex items-center gap-2">
                <Badge tone="danger">− removed</Badge>
                <Badge tone="ok">+ added</Badge>
              </div>
            } />
          
          <div className="grid grid-cols-1 gap-3 p-4 lg:grid-cols-2">
            <DiffPane
              side="original"
              title="Original"
              subtitle="process_data.py"
              lines={candidateDiff.original} />
            
            <DiffPane
              side="candidate"
              title={selected.name}
              subtitle={selected.id}
              lines={candidateDiff.candidate} />
            
          </div>
        </Card>
      </div>
    </div>);

}

export default Optimizations;
