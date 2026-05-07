export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`rounded bg-white/[0.06] animate-pulse ${className}`}
    />
  );
}

export function PageLoadingState() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#8B5CF6] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[#71717A]">Loading...</p>
      </div>
    </div>
  );
}
