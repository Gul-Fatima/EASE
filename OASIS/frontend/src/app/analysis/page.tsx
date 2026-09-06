"use client";

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRightIcon, PlayIcon, ScanSearchIcon, UploadIcon } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, DefinitionList } from '@/components/ui/Card';
import { Badge, SeverityBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CodeBlock, type CodeMarker } from '@/components/ui/CodeBlock';
import { WorkflowStepper } from '@/components/ui/WorkflowStepper';
import {
  analysisMeta,
  codeUnderstanding,
  opportunities,
  sourceCode,
  staticAnalysis } from
  '@/data/analysis';

const TONE_DOT = {
  ok: 'bg-accent',
  warn: 'bg-warn',
  danger: 'bg-danger'
} as const;

export function CodeAnalysis() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(opportunities[0].id);

  const markers = useMemo<CodeMarker[]>(
    () =>
    opportunities.flatMap((opp) =>
    opp.lineRange.map((line) => ({
      line,
      tone:
      opp.severity === 'High' ? 'danger' as const : opp.severity === 'Medium' ? 'warn' as const : 'info' as const
    }))
    ),
    []
  );

  const selected = opportunities.find((o) => o.id === selectedId) ?? opportunities[0];
  const activeLines = selected.lineRange;

  return (
    <div className="flex flex-col">
      <WorkflowStepper current={2} />

      <div className="px-6 py-6">
        <PageHeader
          title="Code Analysis"
          subtitle="OASIS parses the submitted source into an AST, extracts code characteristics, and flags optimization opportunities. Detection indicates an opportunity — it is not proof of excess energy use."
          meta={
          <>
              <Badge tone="neutral" className="font-mono">{analysisMeta.id}</Badge>
              <span className="font-mono text-xs text-ink-2">{analysisMeta.fileName}</span>
              <span className="text-2xs text-ink-3">
                {analysisMeta.language} · {analysisMeta.loc} LOC · analyzed {analysisMeta.lastAnalyzed}
              </span>
            </>
          }
          actions={
          <>
              <Button variant="secondary" icon={UploadIcon}>
                Upload file
              </Button>
              <Button variant="secondary" icon={PlayIcon}>
                Run Baseline
              </Button>
              <Button variant="primary" icon={ScanSearchIcon}>
                Analyze Code
              </Button>
            </>
          } />
        

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-4">
            <Card className="overflow-hidden">
              <CardHeader
                title="Source"
                hint={`Parsed with ${analysisMeta.parser} · ${analysisMeta.sandbox}`}
                actions={
                <div className="flex items-center gap-3">
                    {[
                  { label: 'High', tone: 'bg-[#f85149]' },
                  { label: 'Medium', tone: 'bg-[#e3b341]' },
                  { label: 'Low', tone: 'bg-[#4c8bf5]' }].
                  map((legend) =>
                  <span key={legend.label} className="flex items-center gap-1.5 text-2xs text-ink-3">
                        <span className={`h-2 w-2 rounded-sm ${legend.tone}`} />
                        {legend.label}
                      </span>
                  )}
                  </div>
                } />
              
              <div className="p-3">
                <CodeBlock
                  code={sourceCode}
                  markers={markers}
                  activeLines={activeLines}
                  fileName={analysisMeta.fileName}
                  onLineClick={(line) => {
                    const match = opportunities.find((o) => o.lineRange.includes(line));
                    if (match) setSelectedId(match.id);
                  }} />
                
              </div>
            </Card>

            <Card>
              <CardHeader
                title={`Selected opportunity — ${selected.type}`}
                hint={`${selected.functionName} · line ${selected.line} · ${selected.confidence}% confidence`}
                actions={
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => router.push(`/opportunities/${selected.id}`)}>
                  
                    Open details
                  </Button>
                } />
              
              <div className="px-5 py-4">
                <p className="max-w-3xl text-[13px] leading-relaxed text-ink-2">{selected.reason}</p>
                <p className="mt-3 text-xs text-ink-3">
                  <span className="font-medium text-ink-2">Recommended strategy:</span>{' '}
                  {selected.strategy}
                </p>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader title="Code Understanding" hint="Extracted from the AST" />
              <div className="px-5 py-2">
                <DefinitionList items={codeUnderstanding.map((i) => ({ label: i.label, value: i.value }))} />
              </div>
            </Card>

            <Card>
              <CardHeader title="Static Analysis" hint="Detected code characteristics" />
              <ul className="px-5 py-2">
                {staticAnalysis.map((item) =>
                <li
                  key={item.label}
                  className="flex items-center justify-between gap-3 border-b border-line/70 py-2 last:border-0">
                  
                    <span className="flex items-center gap-2 text-xs text-ink-3">
                      <span className={`h-1.5 w-1.5 rounded-full ${TONE_DOT[item.tone]}`} />
                      {item.label}
                    </span>
                    <span className="font-mono text-xs font-medium text-ink-2">{item.value}</span>
                  </li>
                )}
              </ul>
            </Card>

            <Card>
              <CardHeader
                title="Energy Opportunities"
                hint={`${opportunities.length} detected · select to highlight code`} />
              
              <ul>
                {opportunities.map((opp) => {
                  const isSelected = opp.id === selectedId;
                  return (
                    <li key={opp.id} className="border-b border-line last:border-0">
                      <button
                        type="button"
                        onClick={() => setSelectedId(opp.id)}
                        aria-pressed={isSelected}
                        className={`flex w-full items-start gap-3 px-5 py-3 text-left transition-colors duration-150 ease-out ${
                        isSelected ? 'bg-accent-soft/60' : 'hover:bg-subtle'}`
                        }>
                        
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-[13px] font-medium text-ink">{opp.type}</p>
                            <SeverityBadge severity={opp.severity} />
                          </div>
                          <p className="mt-1 font-mono text-2xs text-ink-3">
                            {opp.functionName} · L{opp.line} · {opp.confidence}% confidence
                          </p>
                          <p className="mt-1 text-2xs text-ink-3">{opp.resourceImpact}</p>
                        </div>
                        <ChevronRightIcon
                          className={`mt-1 h-4 w-4 shrink-0 ${isSelected ? 'text-accent' : 'text-line-strong'}`} />
                        
                      </button>
                    </li>);

                })}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>);

}

export default CodeAnalysis;
