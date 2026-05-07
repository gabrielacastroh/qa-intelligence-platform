import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link2, Play } from 'lucide-react';
import { PageContainer } from '../layouts/AppLayout';
import { RunningPanel } from '../components/run-test/RunningPanel';
import { ResultSummaryCard } from '../components/run-test/ResultSummaryCard';
import { runTestApi, screenshotPublicUrl } from '../services/test-api';
import { ApiError } from '../services/http';
import type { ReportData } from '../types';

type RunState = 'idle' | 'running' | 'success' | 'error';

export function RunTestPage() {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [runState, setRunState] = useState<RunState>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ReportData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearProgress = () => {
    if (progressRef.current) {
      clearInterval(progressRef.current);
      progressRef.current = null;
    }
  };

  const handleRun = async () => {
    if (!url) return;
    clearProgress();
    abortRef.current?.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    setRunState('running');
    setProgress(5);
    setResult(null);
    setErrorMessage(null);

    progressRef.current = setInterval(() => {
      setProgress((p) => Math.min(p + 3, 85));
    }, 500);

    try {
      const response = await runTestApi(url, controller.signal);
      clearProgress();

      if (!response.success) {
        setRunState('error');
        setErrorMessage(response.error ?? 'Analysis failed. Check the URL and try again.');
        return;
      }

      const report: ReportData = {
        ...response,
        screenshotUrl: response.screenshot ? screenshotPublicUrl(response.screenshot) : undefined,
      };
      setResult(report);
      setRunState('success');
      setProgress(100);
    } catch (err) {
      clearProgress();
      if (err instanceof Error && err.name === 'AbortError') {
        setRunState('idle');
        return;
      }
      setRunState('error');
      setErrorMessage(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Unexpected error. Please try again.'
      );
    }
  };

  const handleAbort = () => {
    clearProgress();
    abortRef.current?.abort();
    setRunState('idle');
    setProgress(0);
  };

  const handleViewReport = () => {
    navigate('/reports', { state: { result } });
  };

  const handleReset = () => {
    setRunState('idle');
    setProgress(0);
    setResult(null);
    setErrorMessage(null);
  };

  return (
    <PageContainer className="min-h-full flex flex-col justify-center pb-16">
      <div className="text-center mb-6">
        <h1 className="font-heading text-3xl font-bold text-white mb-2">Initiate Analysis</h1>

      </div>

      <div className="flex gap-3 mb-6 max-w-2xl mx-auto w-full">
        <div className="flex-1 flex items-center gap-3 bg-[#111113] border border-white/[0.1] rounded-xl px-4 py-3 focus-within:border-[#8B5CF6]/50 transition-colors">
          <Link2 size={16} className="text-[#71717A] flex-shrink-0" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && void handleRun()}
            placeholder="https://your-app.io/page"
            className="flex-1 bg-transparent text-white/90 text-sm placeholder-[#4B4B55] outline-none"
          />
        </div>
        <button
          onClick={() => void handleRun()}
          disabled={!url.trim() || runState === 'running'}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-sm font-semibold transition-all duration-150 shadow-[0_0_20px_rgba(139,92,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          <Play size={15} />
          Run Analysis
        </button>
      </div>

      <div className="max-w-3xl mx-auto w-full">
        {runState === 'idle' && <IdleState onRun={() => void handleRun()} />}
        {runState === 'running' && (
          <RunningPanel progress={progress} url={url} onAbort={handleAbort} />
        )}
        {runState === 'success' && result && (
          <ResultSummaryCard
            result={result}
            onViewReport={handleViewReport}
            onRunAgain={handleReset}
          />
        )}
        {runState === 'error' && (
          <ErrorState message={errorMessage} onRetry={handleReset} />
        )}
      </div>
    </PageContainer>
  );
}

function IdleState({ onRun }: { onRun: () => void }) {
  return (
    <div className="rounded-[14px] border border-white/[0.07] bg-[#111113] flex flex-col items-center justify-center min-h-[420px] gap-4 p-8">
      <div className="w-16 h-16 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center">
        <Play size={24} className="text-[#8B5CF6] ml-1" />
      </div>
      <div className="text-center">
        <p className="font-heading text-base font-semibold text-white/80 mb-1">Ready to analyze</p>
        <p className="text-sm text-[#71717A]">Enter a URL above and click Run Analysis to start</p>
      </div>
      <button
        onClick={onRun}
        className="px-5 py-2 rounded-lg bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#A78BFA] text-sm font-medium hover:bg-[#8B5CF6]/25 transition-colors"
      >
        Start Analysis
      </button>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string | null; onRetry: () => void }) {
  return (
    <div className="rounded-[14px] border border-[#EF4444]/20 bg-[#111113] flex flex-col items-center justify-center min-h-[420px] gap-4 p-8">
      <div className="w-16 h-16 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center">
        <span className="text-[#EF4444] text-2xl font-bold">✕</span>
      </div>
      <div className="text-center max-w-md">
        <p className="font-heading text-base font-semibold text-white/80 mb-2">Analysis Failed</p>
        <p className="text-sm text-[#71717A] leading-relaxed">{message ?? 'An unexpected error occurred.'}</p>
      </div>
      <button
        onClick={onRetry}
        className="px-5 py-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white/70 text-sm font-medium hover:bg-white/[0.08] transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
