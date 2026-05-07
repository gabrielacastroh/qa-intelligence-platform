import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { AccessibilityViolation, ImpactLevel } from '../../types';

const IMPACT_STYLES: Record<ImpactLevel, { label: string; color: string; bg: string; border: string }> = {
  critical: { label: 'Critical', color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10', border: 'border-[#EF4444]/20' },
  serious:  { label: 'Serious',  color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/20' },
  moderate: { label: 'Moderate', color: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/10', border: 'border-[#3B82F6]/20' },
  minor:    { label: 'Minor',    color: 'text-[#71717A]', bg: 'bg-white/[0.04]', border: 'border-white/[0.08]' },
};

const UNKNOWN_IMPACT_STYLE = { label: 'Unknown', color: 'text-[#71717A]', bg: 'bg-white/[0.04]', border: 'border-white/[0.08]' };

function ViolationItem({ violation }: { violation: AccessibilityViolation }) {
  const impactStyle = violation.impact ? IMPACT_STYLES[violation.impact] : UNKNOWN_IMPACT_STYLE;
  return (
    <div className={cn('rounded-[10px] border p-3.5', impactStyle.bg, impactStyle.border)}>
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-start gap-2 min-w-0">
          <AlertTriangle size={13} className={cn('mt-0.5 flex-shrink-0', impactStyle.color)} />
          <p className="text-xs font-semibold text-white/90 leading-tight">{violation.help}</p>
        </div>
        <span className={cn('text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded flex-shrink-0', impactStyle.color, impactStyle.bg)}>
          {impactStyle.label}
        </span>
      </div>
      <p className="text-[11px] text-[#71717A] leading-relaxed ml-5">{violation.description}</p>
      <div className="flex items-center gap-1.5 mt-2 ml-5">
        <code className="text-[10px] text-[#06B6D4] font-mono bg-[#06B6D4]/10 px-1.5 py-0.5 rounded">
          {violation.id}
        </code>
        <span className="text-[10px] text-[#4B4B55]">{violation.nodes_affected} node{violation.nodes_affected !== 1 ? 's' : ''} affected</span>
      </div>
    </div>
  );
}

interface AccessibilityIssuesListProps {
  violations: AccessibilityViolation[] | undefined;
}

export function AccessibilityIssuesList({ violations }: AccessibilityIssuesListProps) {
  const sortedViolations = [...(violations ?? [])].sort((first, second) => {
    const impactOrder: (ImpactLevel | null)[] = ['critical', 'serious', 'moderate', 'minor', null];
    return impactOrder.indexOf(first.impact) - impactOrder.indexOf(second.impact);
  });

  return (
    <div className="rounded-[14px] border border-[#8B5CF6]/20 bg-[#111113] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#8B5CF6]/20 flex items-center justify-center">
            <AlertTriangle size={11} className="text-[#A78BFA]" />
          </div>
          <h3 className="font-heading text-sm font-semibold text-white/90">Accessibility</h3>
        </div>
        {sortedViolations.length > 0 ? (
          <span className="text-xs font-semibold text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded-full">
            {sortedViolations.length} issue{sortedViolations.length !== 1 ? 's' : ''}
          </span>
        ) : (
          <span className="text-xs font-semibold text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-full">
            Passed
          </span>
        )}
      </div>

      {sortedViolations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 gap-2">
          <CheckCircle2 size={28} className="text-[#22C55E]" />
          <p className="text-sm text-white/70 font-medium">No accessibility violations found</p>
          <p className="text-xs text-[#71717A]">This page passes all Axe-core checks</p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
          {sortedViolations.map((violation) => (
            <ViolationItem key={violation.id} violation={violation} />
          ))}
        </div>
      )}
    </div>
  );
}
