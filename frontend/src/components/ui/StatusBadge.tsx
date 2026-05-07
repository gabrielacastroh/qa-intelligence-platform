import { cn } from '../../utils/cn';
import type { TestStatus } from '../../types';

interface StatusBadgeProps {
  status: TestStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<TestStatus, { label: string; dotColor: string; bg: string; text: string }> = {
  pass: {
    label: 'Pass',
    dotColor: 'bg-[#22C55E]',
    bg: 'bg-[rgba(34,197,94,0.1)]',
    text: 'text-[#22C55E]',
  },
  failed: {
    label: 'Failed',
    dotColor: 'bg-[#EF4444]',
    bg: 'bg-[rgba(239,68,68,0.1)]',
    text: 'text-[#EF4444]',
  },
  running: {
    label: 'Running',
    dotColor: 'bg-[#8B5CF6] animate-pulse',
    bg: 'bg-[rgba(139,92,246,0.1)]',
    text: 'text-[#A78BFA]',
  },
  pending: {
    label: 'Pending',
    dotColor: 'bg-[#71717A]',
    bg: 'bg-[rgba(113,113,122,0.1)]',
    text: 'text-[#A1A1AA]',
  },
  aborted: {
    label: 'Aborted',
    dotColor: 'bg-[#F59E0B]',
    bg: 'bg-[rgba(245,158,11,0.1)]',
    text: 'text-[#F59E0B]',
  },
};

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        config.bg,
        config.text,
        size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', config.dotColor)} />
      {config.label}
    </span>
  );
}
