import type { MetricComparison } from '../types/oasis';

export const environment = [
{ label: 'CPU', value: 'AMD Ryzen 7 5800X · 8C/16T' },
{ label: 'GPU', value: 'Not used for this workload' },
{ label: 'RAM', value: '32 GB DDR4-3200' },
{ label: 'Operating System', value: 'Ubuntu 22.04 LTS (container)' },
{ label: 'Python Version', value: '3.11.9' },
{ label: 'Workload', value: 'telemetry_day.json · 250k readings' },
{ label: 'Executions', value: '10 measured runs' }];


export const benchmarkConfig = [
{ label: 'Warm-up runs', value: '3' },
{ label: 'Measured executions', value: '10' },
{ label: 'Workload configuration', value: 'fixed seed · single process' },
{ label: 'Measurement backend', value: 'CodeCarbon 2.4 + psutil' },
{ label: 'Aggregation', value: 'median of 10 runs' },
{ label: 'Isolation', value: 'Container · no network · 60s timeout' }];


export const benchmarkRuns = [
{
  id: 'original',
  label: 'Original Code',
  state: 'complete' as const,
  completed: 10,
  total: 10,
  energy: 5.2,
  time: 1.8
},
{
  id: 'candidate-1',
  label: 'Candidate 1 — Loop Optimization',
  state: 'running' as const,
  completed: 7,
  total: 10,
  energy: 2.1,
  time: 0.8
},
{
  id: 'candidate-2',
  label: 'Candidate 2 — Data Structure Optimization',
  state: 'queued' as const,
  completed: 0,
  total: 10,
  energy: 3.06,
  time: 1.12
},
{
  id: 'candidate-3',
  label: 'Candidate 3 — Algorithmic Optimization',
  state: 'blocked' as const,
  completed: 0,
  total: 10,
  energy: null,
  time: null
}];


export const measuredMetrics = [
{ metric: 'Energy', unit: 'J', original: 5.2, optimized: 2.1 },
{ metric: 'Execution Time', unit: 's', original: 1.8, optimized: 0.8 },
{ metric: 'CPU Utilization', unit: '%', original: 82, optimized: 65 },
{ metric: 'Memory Utilization', unit: 'MB', original: 150, optimized: 130 }];


export const runSamples = [
{ run: 'R1', original: 5.41, optimized: 2.18 },
{ run: 'R2', original: 5.18, optimized: 2.06 },
{ run: 'R3', original: 5.33, optimized: 2.14 },
{ run: 'R4', original: 5.09, optimized: 2.03 },
{ run: 'R5', original: 5.26, optimized: 2.11 },
{ run: 'R6', original: 5.14, optimized: 2.09 },
{ run: 'R7', original: 5.22, optimized: 2.1 },
{ run: 'R8', original: 5.31, optimized: 2.16 },
{ run: 'R9', original: 5.12, optimized: 2.04 },
{ run: 'R10', original: 5.2, optimized: 2.09 }];


export const energyStats = [
{ label: 'Mean', original: '5.23 J', optimized: '2.10 J' },
{ label: 'Median', original: '5.22 J', optimized: '2.10 J' },
{ label: 'Std. deviation', original: '0.10 J', optimized: '0.05 J' },
{ label: 'Min', original: '5.09 J', optimized: '2.03 J' },
{ label: 'Max', original: '5.41 J', optimized: '2.18 J' }];


export const comparisonTable: MetricComparison[] = [
{ metric: 'Energy', original: '5.20 J', optimized: '2.10 J', change: '−59.6%', direction: 'improved' },
{ metric: 'Execution Time', original: '1.80 s', optimized: '0.80 s', change: '−55.6%', direction: 'improved' },
{ metric: 'CPU Utilization', original: '82%', optimized: '65%', change: '−20.7%', direction: 'improved' },
{ metric: 'Memory Utilization', original: '150 MB', optimized: '130 MB', change: '−13.3%', direction: 'improved' },
{ metric: 'CO₂ Emissions', original: '2.31 g', optimized: '0.93 g', change: '−59.7%', direction: 'improved' },
{ metric: 'Correctness', original: 'Pass', optimized: 'Pass', change: '—', direction: 'neutral' }];


export const candidateRanking = [
{
  candidate: 'Candidate 1 — Loop Optimization',
  predicted: 'High',
  correctness: 'PASS',
  measuredEnergy: '−59.6%',
  performance: '−55.6%',
  risk: 'Low',
  status: 'Successful Optimization'
},
{
  candidate: 'Candidate 2 — Data Structure Optimization',
  predicted: 'Moderate',
  correctness: 'PASS',
  measuredEnergy: '−41.2%',
  performance: '−37.8%',
  risk: 'Moderate',
  status: 'Successful Optimization'
},
{
  candidate: 'Candidate 3 — Algorithmic Optimization',
  predicted: 'High',
  correctness: 'FAIL',
  measuredEnergy: 'Not measured',
  performance: 'Not measured',
  risk: 'High',
  status: 'Failed'
}];