import type { Opportunity } from '../types/oasis';

export const analysisMeta = {
  id: 'AN-2418',
  fileName: 'pipeline/process_data.py',
  language: 'Python 3.11',
  project: 'telemetry-ingest',
  lastAnalyzed: '2 minutes ago',
  loc: 34,
  parser: 'Python AST',
  sandbox: 'Isolated container · network disabled · 10s timeout'
};

export const sourceCode = `import json
import math
from statistics import mean

CONFIG_PATH = "config/thresholds.json"


def expensive_calculation(x):
    """Cost model for a single reading."""
    return math.sqrt(x) * math.log(x + 1) ** 3


def process_data(data, x):
    """Score every reading against the configured limit."""
    output = []

    for i in range(len(data)):
        result = expensive_calculation(x)
        thresholds = json.load(open(CONFIG_PATH))

        if data[i] > thresholds["limit"]:
            output.append(result + data[i])

    return output


def summarize(records):
    seen = []

    for record in records:
        if record["id"] not in seen:
            seen.append(record["id"])

    return {"unique": len(seen), "avg": mean(r["value"] for r in records)}
`;

export const codeUnderstanding = [
{ label: 'Functions', value: '3' },
{ label: 'Classes', value: '0' },
{ label: 'Loops', value: '2 (both linear)' },
{ label: 'Function Calls', value: '9' },
{ label: 'Data Structures', value: 'list ×3, dict ×1' },
{ label: 'I/O Operations', value: '1 file read (in loop)' },
{ label: 'Cyclomatic Complexity', value: '7' }];


export const staticAnalysis = [
{ label: 'Loop-invariant expressions', value: '2', tone: 'warn' as const },
{ label: 'I/O inside loop body', value: '1', tone: 'danger' as const },
{ label: 'Object allocations per call', value: '~3n', tone: 'warn' as const },
{ label: 'Membership tests on list', value: '1', tone: 'warn' as const },
{ label: 'Pure functions', value: '2', tone: 'ok' as const },
{ label: 'External dependencies', value: 'json, math, statistics', tone: 'ok' as const }];


export const opportunities: Opportunity[] = [
{
  id: 'OPP-1042',
  type: 'Repeated Computation',
  functionName: 'process_data()',
  line: 18,
  lineRange: [17, 18],
  severity: 'High',
  confidence: 92,
  reason:
  'expensive_calculation(x) is evaluated on every iteration, but its only argument does not depend on the loop variable i. The expression is loop-invariant, so the same value is recomputed n times.',
  resourceImpact: 'CPU-bound arithmetic repeated n times',
  strategy: 'Cache the computed value outside the loop.',
  predicted: {
    energy: 'High reduction potential',
    time: 'High reduction potential',
    cpu: 'High reduction potential',
    memory: 'No expected change'
  },
  codeBefore: `for i in range(len(data)):
    result = expensive_calculation(x)
    output.append(result + data[i])`,
  codeAfter: `result = expensive_calculation(x)

for i in range(len(data)):
    output.append(result + data[i])`
},
{
  id: 'OPP-1043',
  type: 'Repeated I/O',
  functionName: 'process_data()',
  line: 19,
  lineRange: [19, 19],
  severity: 'High',
  confidence: 88,
  reason:
  'The threshold configuration file is opened and parsed inside the loop body. The file contents do not change during execution, so each iteration performs a redundant filesystem read and JSON parse.',
  resourceImpact: 'Filesystem I/O and JSON parsing repeated n times',
  strategy: 'Read and parse the configuration once before the loop.',
  predicted: {
    energy: 'High reduction potential',
    time: 'High reduction potential',
    cpu: 'Moderate reduction potential',
    memory: 'Slight reduction potential'
  },
  codeBefore: `for i in range(len(data)):
    thresholds = json.load(open(CONFIG_PATH))
    ...`,
  codeAfter: `with open(CONFIG_PATH) as fh:
    thresholds = json.load(fh)

for i in range(len(data)):
    ...`
},
{
  id: 'OPP-1044',
  type: 'Inefficient Data Structure',
  functionName: 'summarize()',
  line: 31,
  lineRange: [28, 32],
  severity: 'Medium',
  confidence: 84,
  reason:
  'seen is a list used purely for membership testing, giving O(n) lookups and O(n²) overall behaviour as the record count grows.',
  resourceImpact: 'Quadratic comparison work on large inputs',
  strategy: 'Use a set for membership tracking.',
  predicted: {
    energy: 'Moderate reduction potential',
    time: 'Moderate reduction potential',
    cpu: 'Moderate reduction potential',
    memory: 'Slight increase possible'
  },
  codeBefore: `seen = []

for record in records:
    if record["id"] not in seen:
        seen.append(record["id"])`,
  codeAfter: `seen = set()

for record in records:
    seen.add(record["id"])`
},
{
  id: 'OPP-1045',
  type: 'Inefficient Loop',
  functionName: 'process_data()',
  line: 17,
  lineRange: [17, 17],
  severity: 'Low',
  confidence: 71,
  reason:
  'range(len(data)) creates an index sequence only to dereference data[i]. Direct iteration removes the index arithmetic and bounds lookups.',
  resourceImpact: 'Minor interpreter overhead per iteration',
  strategy: 'Iterate over the sequence directly.',
  predicted: {
    energy: 'Low reduction potential',
    time: 'Low reduction potential',
    cpu: 'Low reduction potential',
    memory: 'No expected change'
  },
  codeBefore: `for i in range(len(data)):
    output.append(result + data[i])`,
  codeAfter: `for value in data:
    output.append(result + value)`
}];