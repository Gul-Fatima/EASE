import React from 'react';

const TOKEN_RE =
/(#[^\n]*)|("""[\s\S]*?"""|'[^']*'|"[^"]*")|\b(def|class|return|for|in|if|elif|else|while|import|from|with|as|not|and|or|lambda|try|except|finally|pass|yield|global|raise|assert|None|True|False)\b|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_][A-Za-z0-9_]*)(?=\s*\()/g;

const CLASSES = {
  comment: 'text-code-dim italic',
  string: 'text-[#a5d6ff]',
  keyword: 'text-[#ff7b72]',
  number: 'text-[#79c0ff]',
  call: 'text-[#d2a8ff]'
};

/** Lightweight Python tokenizer for read-only code display. */
export function highlightPython(line: string): React.ReactNode {
  if (!line) return '\u00A0';

  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  let key = 0;
  TOKEN_RE.lastIndex = 0;

  let match = TOKEN_RE.exec(line);
  while (match) {
    if (match.index > cursor) {
      nodes.push(line.slice(cursor, match.index));
    }

    const [raw, comment, str, keyword, num, call] = match;
    let className = '';
    if (comment) className = CLASSES.comment;else
    if (str) className = CLASSES.string;else
    if (keyword) className = CLASSES.keyword;else
    if (num) className = CLASSES.number;else
    if (call) className = CLASSES.call;

    nodes.push(
      <span key={key++} className={className}>
        {raw}
      </span>
    );

    cursor = match.index + raw.length;
    match = TOKEN_RE.exec(line);
  }

  if (cursor < line.length) {
    nodes.push(line.slice(cursor));
  }

  return nodes;
}