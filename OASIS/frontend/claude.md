# OASIS Frontend — CLAUDE.md

## Purpose
Developer-facing interface for OASIS. Presentation layer only — no energy
measurement or optimization-decision logic lives here.

## Stack
Next.js (App Router) + TypeScript + Tailwind + shadcn/ui + TanStack Query + Zustand + Recharts.

## Structure rule
`app/` = routing only. All domain logic and UI lives in `features/<domain>/`,
one folder per backend module (projects, code-analysis, opportunities,
candidates, verification, benchmark, comparison, history). Shared
cross-feature UI goes in `components/`.

## Non-negotiable UX rule
Predicted and measured values must NEVER be visually identical. Every
number sourced from prediction vs. actual execution must carry a
PredictedVsMeasuredBadge or equivalent visual distinction.

## Other UX rules
- Always show loading states for async operations (jobs can run long).
- Never hide failed experiments — show them in history, clearly marked.
- Confirm destructive operations (delete project, discard candidate) via dialog.
- Accept/Reject controls must appear AFTER verification + measurement evidence,
  never above it.
- Keep code comparison (diff) view readable — syntax highlighting required.

## API
All backend calls go through `lib/api-client.ts` and typed via
`lib/api-types.generated.ts` (regenerate from `/openapi.json`, never hand-edit).
No business logic for energy/optimization decisions in components — the
backend is the source of truth.