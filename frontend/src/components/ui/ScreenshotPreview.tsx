import { StatusBadge } from './StatusBadge';
import type { TestStatus } from '../../types';

interface ScreenshotPreviewProps {
  status: TestStatus;
  browser?: string;
  imageUrl?: string;
}

const MOCK_NAV_WIDTHS = [72, 84, 66, 88, 78, 70];

export function ScreenshotPreview({ status, browser = 'CHROME 124.0.0', imageUrl }: ScreenshotPreviewProps) {
  return (
    <div className="rounded-[14px] border border-white/[0.07] bg-[#111113] overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.07]">
        <StatusBadge status={status} size="md" />
        <span className="text-xs font-mono text-[#71717A] font-semibold tracking-wide">{browser}</span>
      </div>
      <div className="aspect-video bg-[#0D0D0F] relative overflow-hidden flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt="Test screenshot" className="w-full h-full object-cover" />
        ) : (
          <MockScreenshot status={status} />
        )}
      </div>
    </div>
  );
}

function MockScreenshot({ status }: { status: TestStatus }) {
  return (
    <div className="w-full h-full flex flex-col p-4 gap-2 opacity-60">
      <div className="flex gap-2 mb-2">
        <div className="h-6 w-24 rounded bg-[#8B5CF6]/20" />
        <div className="h-6 w-16 rounded bg-white/[0.05]" />
        <div className="h-6 w-16 rounded bg-white/[0.05]" />
      </div>
      <div className="flex gap-3 flex-1">
        <div className="w-48 rounded bg-white/[0.04] flex flex-col gap-1.5 p-2">
          {MOCK_NAV_WIDTHS.map((width, index) => (
            <div key={index} className="h-3 rounded bg-white/[0.06]" style={{ width: `${width}%` }} />
          ))}
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-24 rounded bg-white/[0.03] border border-white/[0.05]" />
          <div className="grid grid-cols-3 gap-2 flex-1">
            {MOCK_NAV_WIDTHS.map((_, index) => (
              <div key={index} className={`rounded ${status === 'failed' && index === 2 ? 'bg-[#EF4444]/15 border border-[#EF4444]/30' : 'bg-white/[0.04]'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
