"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRightIcon, PlusIcon } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge, EvidenceTag } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { projects } from '@/data/history';

export function Projects() {
  return (
    <div className="px-6 py-6">
      <PageHeader
        title="Projects"
        subtitle="Each project holds its own analyses, detected opportunities and measured experiment history."
        actions={
        <Button variant="primary" icon={PlusIcon}>
            New Project
          </Button>
        } />
      

      <div className="space-y-3">
        {projects.map((project, i) =>
        <Card key={project.name} as="article" className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="min-w-[260px] max-w-lg">
                <div className="flex items-center gap-2">
                  <h2 className="font-mono text-sm font-semibold text-ink">{project.name}</h2>
                  <Badge tone="neutral">{project.language}</Badge>
                  {i === 0 ? <Badge tone="info">Active</Badge> : null}
                </div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-3">
                  {project.description}
                </p>
                <p className="mt-3 text-2xs text-ink-3">Last run {project.lastRun}</p>
              </div>

              <dl className="flex flex-wrap gap-x-8 gap-y-3">
                <div>
                  <dt className="text-2xs uppercase tracking-wide text-ink-3">Analyses</dt>
                  <dd className="mt-1 font-mono text-base font-semibold text-ink tabular">
                    {project.analyses}
                  </dd>
                </div>
                <div>
                  <dt className="text-2xs uppercase tracking-wide text-ink-3">Open opportunities</dt>
                  <dd className="mt-1 font-mono text-base font-semibold text-warn tabular">
                    {project.openOpportunities}
                  </dd>
                </div>
                <div>
                  <dt className="text-2xs uppercase tracking-wide text-ink-3">Validated</dt>
                  <dd className="mt-1 font-mono text-base font-semibold text-ink tabular">
                    {project.validated}
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-2xs uppercase tracking-wide text-ink-3">
                    Energy saved
                    <EvidenceTag kind="measured" />
                  </dt>
                  <dd className="mt-1 font-mono text-base font-semibold text-accent tabular">
                    {project.energySaved}
                  </dd>
                </div>
              </dl>

              <Link
              href="/analysis"
              className="inline-flex items-center gap-1.5 self-center rounded-md border border-line-strong px-3 py-1.5 text-xs font-medium text-ink-2 transition-colors duration-150 ease-out hover:bg-subtle hover:text-ink">
              
                Open analyses
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>);

}

export default Projects;
