import type { Experiment } from '../types/oasis';

export const experiments: Experiment[] = [
{
  id: 'EX-208',
  project: 'telemetry-ingest',
  opportunity: 'Repeated Computation · process_data() L18',
  candidate: 'Loop Optimization',
  verification: 'PASS',
  energyChange: -59.6,
  performanceChange: -55.6,
  decision: 'Successful',
  timestamp: '2026-09-03 09:41',
  strategy: 'Rule-based'
},
{
  id: 'EX-207',
  project: 'search-api',
  opportunity: 'Inefficient Data Structure · index_terms() L44',
  candidate: 'Set-based membership',
  verification: 'PASS',
  energyChange: -3.1,
  performanceChange: -12.9,
  decision: 'Performance-only',
  timestamp: '2026-09-03 08:02',
  strategy: 'Rule-based'
},
{
  id: 'EX-206',
  project: 'billing-core',
  opportunity: 'Repeated I/O · load_rates() L27',
  candidate: 'Batched file reads',
  verification: 'PASS',
  energyChange: -47.6,
  performanceChange: -44.2,
  decision: 'Successful',
  timestamp: '2026-09-02 16:04',
  strategy: 'LLM-assisted'
},
{
  id: 'EX-205',
  project: 'search-api',
  opportunity: 'Inefficient Loop · rank_results() L61',
  candidate: 'Comprehension rewrite',
  verification: 'PASS',
  energyChange: 1.8,
  performanceChange: -6.4,
  decision: 'Neutral',
  timestamp: '2026-09-02 11:37',
  strategy: 'LLM-assisted'
},
{
  id: 'EX-204',
  project: 'billing-core',
  opportunity: 'Redundant Computation · render_invoice() L88',
  candidate: 'Cached serialization',
  verification: 'PASS',
  energyChange: -49.3,
  performanceChange: 3.2,
  decision: 'Energy-only',
  timestamp: '2026-09-01 14:19',
  strategy: 'LLM-assisted'
},
{
  id: 'EX-203',
  project: 'telemetry-ingest',
  opportunity: 'Excessive Memory Operations · load_batch() L12',
  candidate: 'Generator streaming',
  verification: 'PASS',
  energyChange: -2.9,
  performanceChange: -1.1,
  decision: 'Rejected',
  timestamp: '2026-09-01 10:02',
  strategy: 'Rule-based'
},
{
  id: 'EX-202',
  project: 'search-api',
  opportunity: 'Unnecessary Object Creation · tokenize() L19',
  candidate: 'Object reuse pool',
  verification: 'FAIL',
  energyChange: null,
  performanceChange: null,
  decision: 'Failed',
  timestamp: '2026-08-31 18:44',
  strategy: 'LLM-assisted'
},
{
  id: 'EX-201',
  project: 'billing-core',
  opportunity: 'Redundant Operations · reconcile() L140',
  candidate: 'Early-exit guard',
  verification: 'PASS',
  energyChange: -35.4,
  performanceChange: -29.8,
  decision: 'Successful',
  timestamp: '2026-08-31 09:15',
  strategy: 'Rule-based'
}];


export const historyFilters = [
{ label: 'Project', options: ['All projects', 'telemetry-ingest', 'billing-core', 'search-api'] },
{ label: 'Status', options: ['All statuses', 'Successful', 'Neutral', 'Performance-only', 'Energy-only', 'Failed', 'Rejected'] },
{ label: 'Date', options: ['Last 30 days', 'Last 7 days', 'Last 90 days'] },
{ label: 'Energy improvement', options: ['Any', '> 10%', '> 25%', '> 50%'] },
{ label: 'Strategy', options: ['All strategies', 'Rule-based', 'LLM-assisted'] },
{ label: 'Language', options: ['Python'] }];


export const projects = [
{
  name: 'telemetry-ingest',
  description: 'Sensor ingestion and daily efficiency reporting pipeline',
  language: 'Python 3.11',
  analyses: 54,
  openOpportunities: 168,
  validated: 27,
  energySaved: '82.4 J',
  lastRun: 'Today, 09:41'
},
{
  name: 'billing-core',
  description: 'Invoice batching, rate resolution and reconciliation',
  language: 'Python 3.11',
  analyses: 41,
  openOpportunities: 131,
  validated: 22,
  energySaved: '63.9 J',
  lastRun: 'Yesterday, 17:55'
},
{
  name: 'search-api',
  description: 'Document indexing and query ranking service',
  language: 'Python 3.10',
  analyses: 33,
  openOpportunities: 113,
  validated: 14,
  energySaved: '38.3 J',
  lastRun: '2 Sep, 11:37'
}];