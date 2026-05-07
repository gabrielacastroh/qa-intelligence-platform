export type ImpactLevel = 'critical' | 'serious' | 'moderate' | 'minor';
export type TestStatus = 'pass' | 'failed' | 'running' | 'pending' | 'aborted';

export interface TestConfig {
  visualTesting: boolean;
  accessibility: boolean;
  consoleLogs: boolean;
  performance: boolean;
  environment: string;
}

export interface ConsoleLog {
  type: string;
  message: string;
}

export interface AccessibilityViolation {
  id: string;
  impact: ImpactLevel | null;
  description: string;
  help: string;
  nodes_affected: number;
}

export interface ReportData {
  success: boolean;
  title?: string;
  url?: string;
  status_code?: number;
  load_time?: number;
  screenshot?: string;
  screenshotUrl?: string;
  console_logs?: ConsoleLog[];
  accessibility_violations?: AccessibilityViolation[];
  technical_review?: string;
  error?: string;
}
