import { cn } from '../../utils/cn';

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  glowAccent?: 'primary' | 'cyan' | 'none';
}

export function SectionCard({ children, className, noPadding, glowAccent = 'none' }: SectionCardProps) {
  return (
    <div
      className={cn(
        'rounded-[14px] border border-white/[0.07] bg-[#111113] min-w-0 overflow-hidden',
        !noPadding && 'p-5',
        glowAccent === 'primary' && 'shadow-[0_0_30px_rgba(139,92,246,0.08)]',
        glowAccent === 'cyan' && 'shadow-[0_0_30px_rgba(6,182,212,0.08)]',
        className
      )}
    >
      {children}
    </div>
  );
}

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function SectionTitle({ children, className, action }: SectionTitleProps) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      <h2 className="font-heading text-base font-semibold text-white/90">{children}</h2>
      {action && <div>{action}</div>}
    </div>
  );
}
