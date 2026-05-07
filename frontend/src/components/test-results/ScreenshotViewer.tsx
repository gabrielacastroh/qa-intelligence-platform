interface ScreenshotViewerProps {
  screenshotUrl?: string;
  title?: string;
}

export function ScreenshotViewer({ screenshotUrl, title }: ScreenshotViewerProps) {
  return (
    <div className="rounded-[14px] border border-white/[0.07] bg-[#111113] overflow-hidden min-w-0">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.07]">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]/70" />
        </div>
        <span className="text-xs text-[#71717A] ml-1 truncate">{title ?? 'Captured page'}</span>
      </div>
      {screenshotUrl ? (
        <img
          src={screenshotUrl}
          alt="Page screenshot"
          className="w-full object-cover object-top"
        />
      ) : (
        <div className="h-64 flex items-center justify-center bg-[#0D0D0F]">
          <p className="text-sm text-[#4B4B55]">Screenshot unavailable</p>
        </div>
      )}
    </div>
  );
}
