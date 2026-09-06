export type Severity = 'High' | 'Medium' | 'Low';

export type EvidenceKind = 'predicted' | 'measured';

export type OptimizationStatus =
'Successful' |
'Neutral' |
'Performance-only' |
'Energy-only' |
'Failed' |
'Rejected';

export type VerificationStatus = 'PASS' | 'FAIL' | 'Not run';

export type StageState = 'done' | 'current' | 'blocked' | 'upcoming';

export interface WorkflowStage {
  id: string;
  index: number;
  label: string;
  route: string;
}

export interface CodeLine {
  n: number;
  text: string;
}

export interface Opportunity {
  id: string;
  type: string;
  functionName: string;
  line: number;
  lineRange: number[];
  severity: Severity;
  confidence: number;
  reason: string;
  resourceImpact: string;
  strategy: string;
  predicted: {
    energy: string;
    time: string;
    cpu: string;
    memory: string;
  };
  codeBefore: string;
  codeAfter: string;
}

export interface Candidate {
  id: string;
  rank: number;
  name: string;
  strategy: string;
  explanation: string;
  code: string;
  predictedEnergy: number;
  predictedPerformance: number;
  memoryImpact: number;
  complexity: string;
  correctnessConfidence: number;
  risk: 'Low' | 'Moderate' | 'High';
  score: number;
  status: string;
  verification: VerificationStatus;
  measuredEnergy: number | null;
}

export interface VerificationTest {
  id: string;
  name: string;
  group: string;
  status: 'Pass' | 'Fail' | 'Skipped';
  runtime: string;
  details: string;
  error?: string;
}

export interface MetricComparison {
  metric: string;
  original: string;
  optimized: string;
  change: string;
  direction: 'improved' | 'regressed' | 'neutral';
}

export interface Experiment {
  id: string;
  project: string;
  opportunity: string;
  candidate: string;
  verification: VerificationStatus;
  energyChange: number | null;
  performanceChange: number | null;
  decision: OptimizationStatus;
  timestamp: string;
  strategy: string;
}