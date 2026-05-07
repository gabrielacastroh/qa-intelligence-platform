import { Loader2, XCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface RunningPanelProps {
  progress: number;
  url: string;
  onAbort: () => void;
}

const ANALYSIS_STEPS = [
  { threshold: 0, label: 'Launching browser...' },
  { threshold: 20, label: 'Navigating to page...' },
  { threshold: 40, label: 'Running accessibility audit (Axe-core)...' },
  { threshold: 65, label: 'Capturing screenshot...' },
  { threshold: 80, label: 'Processing results...' },
];

export function RunningPanel({ progress, url, onAbort }: RunningPanelProps) {
  const currentStep =
    [...ANALYSIS_STEPS].reverse().find((step) => progress >= step.threshold) ?? ANALYSIS_STEPS[0];
  const targetHost = (() => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  })();

  return (
    <div className="rounded-[14px] border border-white/[0.07] bg-[#111113] overflow-hidden flex flex-col min-h-[420px]">
      <div className="px-5 pt-5 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse" />
          <span className="text-xs text-[#A78BFA] font-semibold uppercase tracking-wider">Running Analysis</span>
          <span className="ml-auto text-xs font-semibold text-[#71717A]">{progress}%</span>
        </div>
        <h3 className="font-heading text-lg font-bold text-white truncate">{targetHost}</h3>
        <p className="text-xs text-[#71717A] mt-0.5 truncate">{url}</p>

        <div className="mt-4 h-1 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full progress-shimmer transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="px-5 py-4 space-y-2.5 border-b border-white/[0.06]">
        {ANALYSIS_STEPS.map((step) => {
          const isComplete = progress > step.threshold + 18;
          const isActive = !isComplete && progress >= step.threshold;
          return (
            <div key={step.label} className="flex items-center gap-2.5 text-xs">
              {isComplete && <span className="w-3.5 h-3.5 rounded-full bg-[#22C55E]/20 flex items-center justify-center flex-shrink-0"><span className="text-[#22C55E] text-[9px]">✓</span></span>}
              {isActive && <Loader2 size={13} className="text-[#06B6D4] flex-shrink-0 animate-spin" />}
              {!isComplete && !isActive && <span className="w-3.5 h-3.5 rounded-full border border-white/[0.1] flex-shrink-0" />}
              <span className={cn(
                isComplete && 'text-[#4B4B55] line-through',
                isActive && 'text-[#06B6D4]',
                !isComplete && !isActive && 'text-[#4B4B55]'
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex-1 flex items-center justify-center bg-[#0D0D0F] relative overflow-hidden">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border border-[#8B5CF6]/20 absolute inset-0 scale-[1.4] animate-ping" style={{ animationDuration: '2.5s' }} />
          <div className="w-20 h-20 rounded-full border border-[#06B6D4]/10 absolute inset-0 scale-[2]" />
          <div className="w-20 h-20 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center">
            <Loader2 size={28} className="text-[#8B5CF6] animate-spin" />
          </div>
        </div>
        <p className="absolute bottom-3 text-xs text-[#4B4B55] font-mono">{currentStep.label}</p>
      </div>

      <div className="px-5 py-4 flex justify-end border-t border-white/[0.06]">
        <button
          onClick={onAbort}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/25 text-[#EF4444] text-sm font-medium hover:bg-[#EF4444]/20 transition-colors"
        >
          <XCircle size={14} />
          Abort
        </button>
      </div>
    </div>
  );
}
