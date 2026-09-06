import {
  LayoutDashboardIcon,
  FolderIcon,
  FileCode2Icon,
  ScanSearchIcon,
  SparklesIcon,
  ShieldCheckIcon,
  GaugeIcon,
  HistoryIcon } from
'lucide-react';
import type { WorkflowStage } from '../types/oasis';

export const navItems = [
{ label: 'Overview', to: '/', icon: LayoutDashboardIcon },
{ label: 'Projects', to: '/projects', icon: FolderIcon },
{ label: 'Code Analysis', to: '/analysis', icon: FileCode2Icon },
{ label: 'Opportunities', to: '/opportunities', icon: ScanSearchIcon },
{ label: 'Optimizations', to: '/optimizations', icon: SparklesIcon },
{ label: 'Verification', to: '/verification', icon: ShieldCheckIcon },
{ label: 'Benchmarks', to: '/benchmarks', icon: GaugeIcon },
{ label: 'History', to: '/history', icon: HistoryIcon }];


export const workflowStages: WorkflowStage[] = [
{ id: 'input', index: 1, label: 'Code Input', route: '/analysis' },
{ id: 'understand', index: 2, label: 'Understand', route: '/analysis' },
{ id: 'detect', index: 3, label: 'Detect', route: '/opportunities' },
{ id: 'generate', index: 4, label: 'Generate', route: '/optimizations' },
{ id: 'predict', index: 5, label: 'Predict', route: '/optimizations' },
{ id: 'verify', index: 6, label: 'Verify', route: '/verification' },
{ id: 'measure', index: 7, label: 'Measure', route: '/benchmarks' },
{ id: 'compare', index: 8, label: 'Compare', route: '/validation' },
{ id: 'decide', index: 9, label: 'Decide', route: '/validation' }];