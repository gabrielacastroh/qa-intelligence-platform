import { CheckCircle2, ExternalLink, RotateCcw, Clock, Globe, AlertTriangle, Hash } from 'lucide-react';
import type { ReportData } from '../../types';

interface ResultSummaryCardProps {
  result: ReportData;
  onViewReport: () => void;
  onRunAgain: () => void;
}

export function ResultSummaryCard({ result, onViewReport, onRunAgain }: ResultSummaryCardProps) {
  const violationCount = result.accessibility_violations?.length ?? 0;
  const severeViolationCount =
    result.accessibility_violations?.filter(
      (violation) => violation.impact === 'critical' || violation.impact === 'serious'
    ).length ?? 0;

  return (
    <div className="rounded-[14px] border border-[#22C55E]/20 bg-[#111113] overflow-hidden flex flex-col min-h-[420px]">
      <div className="px-5 pt-5 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 size={15} className="text-[#22C55E]" />
          <span className="text-xs text-[#22C55E] font-semibold uppercase tracking-wider">Analysis Complete</span>
          <span className="ml-auto text-xs font-semibold text-[#71717A]">100%</span>
        </div>
        <h3 className="font-heading text-lg font-bold text-white truncate">
          {result.title || 'Untitled Page'}
        </h3>
        <p className="text-xs text-[#71717A] mt-0.5 truncate">{result.url}</p>

        <div className="mt-4 h-1 rounded-full bg-[#22C55E]/20 overflow-hidden">
          <div className="h-full w-full rounded-full bg-[#22C55E]" />
        </div>
      </div>

      <div className="px-5 py-4 grid grid-cols-2 gap-3 border-b border-white/[0.06]">
        <SummaryMetric icon={<Clock size={13} />} label="Load Time" value={result.load_time ? `${result.load_time}s` : '—'} />
        <SummaryMetric icon={<Hash size={13} />} label="HTTP Status" value={result.status_code ? String(result.status_code) : '—'} />
        <SummaryMetric
          icon={<Globe size={13} />}
          label="Violations"
          value={violationCount === 0 ? 'None' : `${violationCount} found`}
          valueColor={violationCount > 0 ? 'text-[#F59E0B]' : 'text-[#22C55E]'}
        />
        <SummaryMetric
          icon={<AlertTriangle size={13} />}
          label="Critical/Serious"
          value={severeViolationCount === 0 ? 'None' : `${severeViolationCount} issues`}
          valueColor={severeViolationCount > 0 ? 'text-[#EF4444]' : 'text-[#22C55E]'}
        />
      </div>

      <div className="flex-1 relative bg-[#0D0D0F] overflow-hidden min-h-[160px]">
        {result.screenshotUrl ? (
          <img
            src={result.screenshotUrl}
            alt="Page screenshot"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-xs text-[#4B4B55]">No screenshot available</p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0F]/60 to-transparent pointer-events-none" />
      </div>

      <div className="px-5 py-4 flex items-center gap-3 border-t border-white/[0.06]">
        <button
          onClick={onViewReport}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-sm font-semibold transition-colors shadow-[0_0_16px_rgba(139,92,246,0.3)]"
        >
          <ExternalLink size={14} />
          View Full Report
        </button>
        <button
          onClick={onRunAgain}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/[0.1] text-[#71717A] text-sm font-medium hover:text-white/80 hover:bg-white/[0.04] transition-colors"
        >
          <RotateCcw size={14} />
          Run Again
        </button>
      </div>
    </div>
  );
}

function SummaryMetric({
  icon,
  label,
  value,
  valueColor = 'text-white/90',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[#71717A] mb-1">
        {icon}
        <span className="text-[10px] uppercase tracking-widest font-semibold">{label}</span>
      </div>
      <p className={`font-heading text-sm font-bold ${valueColor}`}>{value}</p>
    </div>
  );
}
