"use client";

import React from 'react';
import { highlightPython } from '../../utils/pythonHighlight';

export interface CodeMarker {
  line: number;
  tone: 'danger' | 'warn' | 'info';
  label?: string;
}

interface CodeBlockProps {
  code: string;
  markers?: CodeMarker[];
  activeLines?: number[];
  startLine?: number;
  showLineNumbers?: boolean;
  onLineClick?: (line: number) => void;
  className?: string;
  maxHeight?: string;
  fileName?: string;
}

const MARKER_BG: Record<CodeMarker['tone'], string> = {
  danger: 'bg-[#3d1d1c]',
  warn: 'bg-[#3a2d16]',
  info: 'bg-[#152341]'
};

const MARKER_RAIL: Record<CodeMarker['tone'], string> = {
  danger: 'bg-[#f85149]',
  warn: 'bg-[#e3b341]',
  info: 'bg-[#4c8bf5]'
};

export function CodeBlock({
  code,
  markers = [],
  activeLines = [],
  startLine = 1,
  showLineNumbers = true,
  onLineClick,
  className = '',
  maxHeight,
  fileName
}: CodeBlockProps) {
  const lines = code.replace(/\n$/, '').split('\n');
  const markerByLine = new Map(markers.map((m) => [m.line, m]));

  return (
    <div className={`overflow-hidden rounded-card border border-code-line bg-code-bg ${className}`}>
      {fileName ?
      <div className="flex items-center justify-between border-b border-code-line bg-code-alt px-4 py-2">
          <span className="font-mono text-xs text-code-text">{fileName}</span>
          <span className="font-mono text-2xs uppercase tracking-wide text-code-dim">Python</span>
        </div> :
      null}
      <div className="oasis-scroll-dark overflow-auto" style={maxHeight ? { maxHeight } : undefined}>
        <pre className="min-w-full py-2 font-mono text-xs leading-[1.7] text-code-text">
          <code>
            {lines.map((line, i) => {
              const n = startLine + i;
              const marker = markerByLine.get(n);
              const isActive = activeLines.includes(n);
              const interactive = Boolean(onLineClick && marker);

              return (
                <div
                  key={n}
                  onClick={interactive ? () => onLineClick?.(n) : undefined}
                  role={interactive ? 'button' : undefined}
                  tabIndex={interactive ? 0 : undefined}
                  onKeyDown={
                  interactive ?
                  (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onLineClick?.(n);
                    }
                  } :
                  undefined
                  }
                  className={[
                  'group relative flex items-start pr-4 transition-colors duration-150 ease-out',
                  marker ? MARKER_BG[marker.tone] : '',
                  isActive ? 'ring-1 ring-inset ring-[#4c8bf5]/60 bg-[#152341]' : '',
                  interactive ? 'cursor-pointer hover:brightness-125' : ''].

                  filter(Boolean).
                  join(' ')}>
                  
                  {marker ?
                  <span
                    aria-hidden
                    className={`absolute left-0 top-0 h-full w-[2px] ${MARKER_RAIL[marker.tone]}`} /> :

                  null}
                  {showLineNumbers ?
                  <span className="w-12 shrink-0 select-none pr-3 text-right text-code-dim tabular">
                      {n}
                    </span> :

                  <span className="w-4 shrink-0" />
                  }
                  <span className="whitespace-pre">{highlightPython(line)}</span>
                  {marker?.label ?
                  <span className="ml-auto shrink-0 pl-6 text-2xs font-medium uppercase tracking-wide text-code-dim">
                      {marker.label}
                    </span> :
                  null}
                </div>);

            })}
          </code>
        </pre>
      </div>
    </div>);

}

export interface DiffLine {
  n: number;
  text: string;
  kind: 'same' | 'added' | 'removed';
}

export function DiffPane({
  title,
  subtitle,
  lines,
  side





}: {title: string;subtitle?: string;lines: DiffLine[];side: 'original' | 'candidate';}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-card border border-code-line bg-code-bg">
      <div className="flex items-center justify-between border-b border-code-line bg-code-alt px-4 py-2">
        <span className="font-mono text-xs text-code-text">{title}</span>
        {subtitle ?
        <span className="font-mono text-2xs uppercase tracking-wide text-code-dim">{subtitle}</span> :
        null}
      </div>
      <pre className="oasis-scroll-dark overflow-auto py-2 font-mono text-xs leading-[1.7] text-code-text">
        <code>
          {lines.map((line) =>
          <div
            key={`${side}-${line.n}`}
            className={[
            'flex items-start pr-4',
            line.kind === 'removed' ? 'bg-[#3d1d1c]' : '',
            line.kind === 'added' ? 'bg-[#12291d]' : ''].

            filter(Boolean).
            join(' ')}>
            
              <span className="w-10 shrink-0 select-none pr-2 text-right text-code-dim tabular">
                {line.n}
              </span>
              <span className="w-4 shrink-0 select-none text-code-dim">
                {line.kind === 'added' ? '+' : line.kind === 'removed' ? '−' : ' '}
              </span>
              <span className="whitespace-pre">{highlightPython(line.text)}</span>
            </div>
          )}
        </code>
      </pre>
    </div>);

}