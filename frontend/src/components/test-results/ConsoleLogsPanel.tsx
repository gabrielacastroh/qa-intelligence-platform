import { Copy } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { ConsoleLog } from '../../types';

const LOG_LEVEL_COLORS: Record<string, string> = {
  error:   'text-[#EF4444]',
  warning: 'text-[#F59E0B]',
  warn:    'text-[#F59E0B]',
  info:    'text-[#3B82F6]',
  log:     'text-[#A1A1AA]',
};

interface ConsoleLogsPanelProps {
  logs: ConsoleLog[];
}

export function ConsoleLogsPanel({ logs }: ConsoleLogsPanelProps) {
  const handleCopy = () => {
    const logText = logs.map((entry) => `[${entry.type}] ${entry.message}`).join('\n');
    void navigator.clipboard.writeText(logText);
  };

  return (
    <div className="rounded-[14px] border border-white/[0.07] bg-[#0D0D0F] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#EF4444]/70" />
            <span className="w-3 h-3 rounded-full bg-[#F59E0B]/70" />
            <span className="w-3 h-3 rounded-full bg-[#22C55E]/70" />
          </div>
          <span className="text-xs text-[#71717A] font-mono ml-2">CONSOLE OUTPUT</span>
          <span className="text-[10px] text-[#4B4B55] ml-1">({logs.length} entries)</span>
        </div>
        <button
          onClick={handleCopy}
          className="text-[#71717A] hover:text-white/80 transition-colors p-1"
          title="Copy logs"
        >
          <Copy size={13} />
        </button>
      </div>
      <div className="p-4 font-mono text-xs space-y-1.5 max-h-56 overflow-y-auto overflow-x-hidden">
        {logs.map((entry, index) => (
          <div key={`${entry.type}-${entry.message}-${index}`} className="flex gap-2.5">
            <span className={cn('flex-shrink-0 font-semibold uppercase', LOG_LEVEL_COLORS[entry.type] ?? 'text-[#A1A1AA]')}>
              [{entry.type}]
            </span>
            <span className="text-[#A1A1AA] break-all leading-relaxed">{entry.message}</span>
          </div>
        ))}
        <div className="flex gap-2.5">
          <span className="text-[#4B4B55] invisible">[log]</span>
          <span className="text-[#A1A1AA] animate-blink">_</span>
        </div>
      </div>
    </div>
  );
}
