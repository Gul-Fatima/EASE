export const headlineMetric = {
  label: 'Measured energy saved',
  value: '184.6',
  unit: 'J',
  caption: 'Across 63 validated optimizations · median −38.4% per experiment',
  supporting: [
  { label: 'Execution time improvement', value: '−31.4%' },
  { label: 'CO₂ reduction', value: '0.42 kg' }]

};

export const secondaryMetrics = [
{ label: 'Total analyses', value: '128', delta: '+12 this week', tone: 'neutral' as const },
{ label: 'Open optimization opportunities', value: '412', delta: '87 high severity', tone: 'warn' as const },
{ label: 'Successful optimizations', value: '63', delta: '49% of benchmarked', tone: 'ok' as const },
{ label: 'Rejected at correctness gate', value: '21', delta: 'never benchmarked', tone: 'danger' as const }];


export const energyTrend = [
{ experiment: 'EX-201', original: 4.8, optimized: 3.1 },
{ experiment: 'EX-202', original: 6.2, optimized: 2.4 },
{ experiment: 'EX-203', original: 3.4, optimized: 3.3 },
{ experiment: 'EX-204', original: 7.1, optimized: 3.6 },
{ experiment: 'EX-205', original: 5.5, optimized: 5.6 },
{ experiment: 'EX-206', original: 4.2, optimized: 2.2 },
{ experiment: 'EX-207', original: 6.8, optimized: 3.9 },
{ experiment: 'EX-208', original: 5.2, optimized: 2.1 }];


export const statusBreakdown = [
{ name: 'Successful', value: 63, color: '#137a4a' },
{ name: 'Neutral', value: 24, color: '#9aa3ae' },
{ name: 'Performance-only', value: 16, color: '#1d4ed8' },
{ name: 'Energy-only', value: 9, color: '#0f766e' },
{ name: 'Failed', value: 21, color: '#b42318' },
{ name: 'Rejected', value: 14, color: '#a5620a' }];


export const recentAnalyses = [
{
  id: 'AN-2418',
  file: 'pipeline/process_data.py',
  project: 'telemetry-ingest',
  opportunities: 4,
  status: 'Awaiting decision',
  energyImpact: '−59.6%',
  measured: true,
  date: 'Today, 09:41'
},
{
  id: 'AN-2417',
  file: 'reports/aggregate.py',
  project: 'telemetry-ingest',
  opportunities: 2,
  status: 'Benchmarking',
  energyImpact: 'Pending',
  measured: false,
  date: 'Today, 08:12'
},
{
  id: 'AN-2415',
  file: 'billing/invoice_batch.py',
  project: 'billing-core',
  opportunities: 6,
  status: 'Verified',
  energyImpact: '−22.4%',
  measured: true,
  date: 'Yesterday, 17:55'
},
{
  id: 'AN-2412',
  file: 'search/indexer.py',
  project: 'search-api',
  opportunities: 3,
  status: 'Correctness failed',
  energyImpact: 'Not measured',
  measured: false,
  date: 'Yesterday, 11:20'
},
{
  id: 'AN-2409',
  file: 'etl/normalize.py',
  project: 'billing-core',
  opportunities: 5,
  status: 'Accepted',
  energyImpact: '−34.1%',
  measured: true,
  date: '2 Sep, 16:04'
}];


export const recentOptimizations = [
{ id: 'EX-208', label: 'Loop-invariant hoisting', project: 'telemetry-ingest', status: 'Successful' as const, change: '−59.6% energy' },
{ id: 'EX-207', label: 'Set-based membership', project: 'search-api', status: 'Performance-only' as const, change: '−12.9% time' },
{ id: 'EX-206', label: 'Batched file reads', project: 'billing-core', status: 'Successful' as const, change: '−47.6% energy' },
{ id: 'EX-205', label: 'Comprehension rewrite', project: 'search-api', status: 'Neutral' as const, change: '+1.8% energy' },
{ id: 'EX-204', label: 'Cached serialization', project: 'billing-core', status: 'Energy-only' as const, change: '−49.3% energy' },
{ id: 'EX-203', label: 'Generator streaming', project: 'telemetry-ingest', status: 'Rejected' as const, change: '−2.9% energy' }];