import { API_BASE_URL } from '../constants/api';
import { apiClient } from './http';
import type { AccessibilityViolation, ConsoleLog } from '../types';

export interface RunTestResponse {
  success: boolean;
  title?: string;
  screenshot?: string;
  url?: string;
  load_time?: number;
  status_code?: number;
  console_logs?: ConsoleLog[];
  accessibility_violations?: AccessibilityViolation[];
  technical_review?: string;
  error?: string;
}

export function runTestApi(url: string, signal?: AbortSignal): Promise<RunTestResponse> {
  return apiClient.post<RunTestResponse>('/run-test', { url }, { signal });
}

export function screenshotPublicUrl(backendPath: string): string {
  const trimmed = backendPath.trim();
  const relativePath = trimmed.includes('screenshots/')
    ? trimmed.slice(trimmed.indexOf('screenshots/'))
    : trimmed.replace(/^\//, '');
  return `${API_BASE_URL}/${relativePath.replace(/^\//, '')}`;
}
