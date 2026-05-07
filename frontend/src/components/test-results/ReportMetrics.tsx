import { Clock, Globe, Hash, AlertTriangle } from 'lucide-react';
import type { ReportData } from '../../types';

function MetricTile({
  icon,
  label,
  value,
  valueColor = 'text-white',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="rounded-[12px] border border-white/[0.07] bg-[#111113] px-4 py-3.5 hover:border-white/[0.12] transition-colors">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#71717A]">{label}</p>
        <div className="text-[#4B4B55]">{icon}</div>
      </div>
      <p className={`font-heading text-xl font-bold ${valueColor}`}>{value}</p>
    </div>
  );
}

interface ReportMetricsProps {
  result: ReportData;
}

export function ReportMetrics({ result }: ReportMetricsProps) {
  const violationCount = result.accessibility_violations?.length ?? 0;
  const severeViolationCount =
    result.accessibility_violations?.filter(
      (violation) => violation.impact === 'critical' || violation.impact === 'serious'
    ).length ?? 0;

  const isSuccessfulStatus = result.status_code && result.status_code < 400;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <MetricTile
        icon={<Clock size={16} />}
        label="Load Time"
        value={result.load_time != null ? `${result.load_time}s` : '—'}
      />
      <MetricTile
        icon={<Hash size={16} />}
        label="HTTP Status"
        value={result.status_code ? String(result.status_code) : '—'}
        valueColor={isSuccessfulStatus ? 'text-[#22C55E]' : 'text-[#EF4444]'}
      />
      <MetricTile
        icon={<AlertTriangle size={16} />}
        label="Violations"
        value={violationCount === 0 ? 'None' : String(violationCount)}
        valueColor={violationCount > 0 ? 'text-[#F59E0B]' : 'text-[#22C55E]'}
      />
      <MetricTile
        icon={<Globe size={16} />}
        label="Critical Issues"
        value={severeViolationCount === 0 ? 'None' : String(severeViolationCount)}
        valueColor={severeViolationCount > 0 ? 'text-[#EF4444]' : 'text-[#22C55E]'}
      />
    </div>
  );
}
