import type { Candidate } from '../types/oasis';

export const originalCode = `def process_data(data, x):
    output = []

    for i in range(len(data)):
        result = expensive_calculation(x)
        thresholds = json.load(open(CONFIG_PATH))

        if data[i] > thresholds["limit"]:
            output.append(result + data[i])

    return output
`;

export const candidates: Candidate[] = [
{
  id: 'CD-01',
  rank: 1,
  name: 'Candidate 1 — Loop Optimization',
  strategy: 'Rule-based · loop-invariant code motion',
  explanation:
  'Hoists the invariant computation and the configuration read out of the loop body. The loop shape, ordering and return value are unchanged, which keeps the transformation risk low.',
  code: `def process_data(data, x):
    output = []
    result = expensive_calculation(x)

    with open(CONFIG_PATH) as fh:
        thresholds = json.load(fh)

    for value in data:
        if value > thresholds["limit"]:
            output.append(result + value)

    return output
`,
  predictedEnergy: 82,
  predictedPerformance: 78,
  memoryImpact: 4,
  complexity: 'O(n) → O(n)',
  correctnessConfidence: 96,
  risk: 'Low',
  score: 88,
  status: 'Verified · Benchmarked',
  verification: 'PASS',
  measuredEnergy: -59.6
},
{
  id: 'CD-02',
  rank: 2,
  name: 'Candidate 2 — Data Structure Optimization',
  strategy: 'LLM-assisted · container substitution',
  explanation:
  'Hoists the invariant work and replaces the accumulator with a preallocated buffer plus a cached threshold lookup. Slightly higher peak memory in exchange for fewer resize operations.',
  code: `def process_data(data, x):
    result = expensive_calculation(x)

    with open(CONFIG_PATH) as fh:
        limit = json.load(fh)["limit"]

    output = [None] * len(data)
    count = 0

    for value in data:
        if value > limit:
            output[count] = result + value
            count += 1

    return output[:count]
`,
  predictedEnergy: 71,
  predictedPerformance: 74,
  memoryImpact: -18,
  complexity: 'O(n) → O(n)',
  correctnessConfidence: 89,
  risk: 'Moderate',
  score: 74,
  status: 'Verified · Benchmarked',
  verification: 'PASS',
  measuredEnergy: -41.2
},
{
  id: 'CD-03',
  rank: 3,
  name: 'Candidate 3 — Algorithmic Optimization',
  strategy: 'LLM-assisted · vectorised rewrite',
  explanation:
  'Rewrites the filter and map as a vectorised comprehension over a cached threshold. Fastest predicted candidate, but it changes the handling of non-numeric readings.',
  code: `def process_data(data, x):
    result = expensive_calculation(x)

    with open(CONFIG_PATH) as fh:
        limit = json.load(fh)["limit"]

    return [result + value for value in data if value > limit]
`,
  predictedEnergy: 86,
  predictedPerformance: 84,
  memoryImpact: 9,
  complexity: 'O(n) → O(n)',
  correctnessConfidence: 62,
  risk: 'High',
  score: 58,
  status: 'Rejected at correctness gate',
  verification: 'FAIL',
  measuredEnergy: null
}];


export const candidateDiff = {
  original: [
  { n: 1, text: 'def process_data(data, x):', kind: 'same' as const },
  { n: 2, text: '    output = []', kind: 'same' as const },
  { n: 3, text: '', kind: 'same' as const },
  { n: 4, text: '    for i in range(len(data)):', kind: 'removed' as const },
  { n: 5, text: '        result = expensive_calculation(x)', kind: 'removed' as const },
  { n: 6, text: '        thresholds = json.load(open(CONFIG_PATH))', kind: 'removed' as const },
  { n: 7, text: '', kind: 'same' as const },
  { n: 8, text: '        if data[i] > thresholds["limit"]:', kind: 'removed' as const },
  { n: 9, text: '            output.append(result + data[i])', kind: 'removed' as const },
  { n: 10, text: '', kind: 'same' as const },
  { n: 11, text: '    return output', kind: 'same' as const }],

  candidate: [
  { n: 1, text: 'def process_data(data, x):', kind: 'same' as const },
  { n: 2, text: '    output = []', kind: 'same' as const },
  { n: 3, text: '    result = expensive_calculation(x)', kind: 'added' as const },
  { n: 4, text: '', kind: 'same' as const },
  { n: 5, text: '    with open(CONFIG_PATH) as fh:', kind: 'added' as const },
  { n: 6, text: '        thresholds = json.load(fh)', kind: 'added' as const },
  { n: 7, text: '', kind: 'same' as const },
  { n: 8, text: '    for value in data:', kind: 'added' as const },
  { n: 9, text: '        if value > thresholds["limit"]:', kind: 'added' as const },
  { n: 10, text: '            output.append(result + value)', kind: 'added' as const },
  { n: 11, text: '    return output', kind: 'same' as const }]

};