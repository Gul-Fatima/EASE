"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRightIcon, InfoIcon } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge, EvidenceTag, SeverityBadge } from '@/components/ui/Badge';
import { WorkflowStepper } from '@/components/ui/WorkflowStepper';
import { analysisMeta, opportunities } from '@/data/analysis';

export function Opportunities() {
  return (
    <div className="flex flex-col">
      <WorkflowStepper current={3} />

      <div className="px-6 py-6">
        <PageHeader
          title="Energy Opportunities"
          subtitle="Patterns where the code appears to perform unnecessary or excessive work. Each entry is an opportunity to investigate, not measured evidence of energy waste."
          meta={
          <>
              <Badge tone="neutral" className="font-mono">{analysisMeta.id}</Badge>
              <span className="font-mono text-xs text-ink-2">{analysisMeta.fileName}</span>
            </>
          }
          actions={<EvidenceTag kind="predicted" />} />
        

        <div className="mb-4 flex items-start gap-2.5 rounded-card border border-warn/25 bg-warn-soft px-4 py-3">
          <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-warn" />
          <p className="text-xs leading-relaxed text-warn">
            Severity and confidence are produced by static analysis. Nothing on this screen has been
            executed or measured — candidates must pass correctness verification and empirical
            benchmarking before any saving is claimed.
          </p>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-line bg-subtle text-2xs uppercase tracking-wide text-ink-3">
                  <th scope="col" className="px-5 py-2.5 font-medium">Opportunity</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Location</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Severity</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Confidence</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Resource impact</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Possible optimization</th>
                  <th scope="col" className="px-5 py-2.5 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {opportunities.map((opp) =>
                <tr key={opp.id} className="border-b border-line last:border-0 align-top">
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] font-medium text-ink">{opp.type}</p>
                      <p className="mt-0.5 font-mono text-2xs text-ink-3">{opp.id}</p>
                    </td>
                    <td className="px-3 py-3.5 font-mono text-xs text-ink-2">
                      {opp.functionName} L{opp.line}
                    </td>
                    <td className="px-3 py-3.5">
                      <SeverityBadge severity={opp.severity} />
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-line">
                          <div
                          className="h-full rounded-full bg-ink-3"
                          style={{ width: `${opp.confidence}%` }} />
                        
                        </div>
                        <span className="font-mono text-xs text-ink-2 tabular">{opp.confidence}%</span>
                      </div>
                    </td>
                    <td className="max-w-[220px] px-3 py-3.5 text-xs text-ink-3">
                      {opp.resourceImpact}
                    </td>
                    <td className="max-w-[240px] px-3 py-3.5 text-xs text-ink-2">{opp.strategy}</td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                      href={`/opportunities/${opp.id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-accent-strong transition-colors duration-150 ease-out hover:text-accent">
                      
                        Details
                        <ArrowRightIcon className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>);

}

export default Opportunities;
