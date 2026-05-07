import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileBarChart } from 'lucide-react';
import { PageContainer } from '../layouts/AppLayout';
import { ReportMetrics } from '../components/test-results/ReportMetrics';
import { TechnicalReviewCard } from '../components/test-results/TechnicalReviewCard';
import { ScreenshotViewer } from '../components/test-results/ScreenshotViewer';
import { AccessibilityIssuesList } from '../components/test-results/AccessibilityIssuesList';
import { ConsoleLogsPanel } from '../components/test-results/ConsoleLogsPanel';
import type { ReportData } from '../types';

interface LocationState {
  result?: ReportData;
}

export function ReportPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = (location.state as LocationState | null)?.result;

  if (!result) {
    return <EmptyReportState onRunTest={() => navigate('/run-test')} />;
  }

  const hasLogs = (result.console_logs ?? []).length > 0;

  return (
    <PageContainer>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => navigate('/run-test')}
              className="flex items-center gap-1.5 text-xs text-[#71717A] hover:text-white/70 transition-colors"
            >
              <ArrowLeft size={13} />
              New check
            </button>
          </div>
          <h1 className="font-heading text-xl font-bold text-white">
            {result.title || 'Untitled page'}
          </h1>
          <p className="text-xs text-[#71717A] mt-0.5 truncate max-w-xl">{result.url}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#71717A] flex-shrink-0 pt-1">
          <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
          Completed
        </div>
      </div>

      <div className="mb-5">
        <ReportMetrics result={result} />
      </div>

      <div className="mb-5">
        <TechnicalReviewCard review={result.technical_review} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 mb-5">
        <ScreenshotViewer screenshotUrl={result.screenshotUrl} title={result.title} />
        <div className="min-w-0">
          <AccessibilityIssuesList violations={result.accessibility_violations} />
        </div>
      </div>

      {hasLogs && (
        <div className="mb-5">
          <ConsoleLogsPanel logs={result.console_logs!} />
        </div>
      )}
    </PageContainer>
  );
}

function EmptyReportState({ onRunTest }: { onRunTest: () => void }) {
  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
        <div className="w-20 h-20 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
          <FileBarChart size={32} className="text-[#4B4B55]" />
        </div>
        <div className="text-center">
          <h2 className="font-heading text-lg font-bold text-white/80 mb-2">No report selected</h2>
          <p className="text-sm text-[#71717A] max-w-sm leading-relaxed">
            Run a page check first. The report will open here when the check finishes.
          </p>
        </div>
        <button
          onClick={onRunTest}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-sm font-semibold transition-colors shadow-[0_0_16px_rgba(139,92,246,0.3)]"
        >
          Run a Check
        </button>
      </div>
    </PageContainer>
  );
}
