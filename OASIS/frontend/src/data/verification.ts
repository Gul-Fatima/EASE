import type { VerificationTest } from '../types/oasis';

export const verificationSummary = {
  candidate: 'Candidate 1 — Loop Optimization',
  status: 'PASS' as const,
  testsPassed: 24,
  testsFailed: 0,
  total: 24,
  duration: '1.94 s',
  suite: 'pytest 8.2 · isolated container',
  groups: [
  { label: 'Unit tests', passed: 11, total: 11 },
  { label: 'Regression tests', passed: 6, total: 6 },
  { label: 'Edge cases', passed: 4, total: 4 },
  { label: 'Input/output comparison', passed: 2, total: 2 },
  { label: 'Exception behaviour', passed: 1, total: 1 }]

};

export const verificationTests: VerificationTest[] = [
{
  id: 'T-01',
  name: 'test_matches_original_on_reference_workload',
  group: 'Input/output comparison',
  status: 'Pass',
  runtime: '412 ms',
  details: 'Output identical for 10,000 sampled readings'
},
{
  id: 'T-02',
  name: 'test_preserves_ordering',
  group: 'Unit',
  status: 'Pass',
  runtime: '38 ms',
  details: 'Append order unchanged'
},
{
  id: 'T-03',
  name: 'test_empty_input_returns_empty_list',
  group: 'Edge case',
  status: 'Pass',
  runtime: '4 ms',
  details: 'Returns []'
},
{
  id: 'T-04',
  name: 'test_all_values_below_threshold',
  group: 'Edge case',
  status: 'Pass',
  runtime: '61 ms',
  details: 'Returns [] with no allocations'
},
{
  id: 'T-05',
  name: 'test_threshold_file_missing_raises_oserror',
  group: 'Exception behaviour',
  status: 'Pass',
  runtime: '9 ms',
  details: 'Raises OSError as in the original implementation'
},
{
  id: 'T-06',
  name: 'test_regression_daily_report_totals',
  group: 'Regression',
  status: 'Pass',
  runtime: '298 ms',
  details: 'Report totals match golden fixture'
},
{
  id: 'T-07',
  name: 'test_regression_downstream_summarize',
  group: 'Regression',
  status: 'Pass',
  runtime: '187 ms',
  details: 'Downstream aggregation unchanged'
},
{
  id: 'T-08',
  name: 'test_non_numeric_reading_raises_typeerror',
  group: 'Exception behaviour',
  status: 'Pass',
  runtime: '12 ms',
  details: 'Raises TypeError as in the original implementation'
}];


export const failedCandidateTests: VerificationTest[] = [
{
  id: 'T-08',
  name: 'test_non_numeric_reading_raises_typeerror',
  group: 'Exception behaviour',
  status: 'Fail',
  runtime: '14 ms',
  details: 'Comprehension swallows the comparison error',
  error: `E   AssertionError: expected TypeError, got no exception
E   original:  raises TypeError("'>' not supported between 'str' and 'int'")
E   candidate: returns [] and continues
pipeline/process_data.py:7 in process_data`
},
{
  id: 'T-09',
  name: 'test_partial_write_recovery',
  group: 'Regression',
  status: 'Fail',
  runtime: '206 ms',
  details: 'Recovery path returns 0 rows instead of 148',
  error: `E   assert len(result) == 148
E    +  where len(result) = 0
pipeline/process_data.py:7 in process_data`
}];