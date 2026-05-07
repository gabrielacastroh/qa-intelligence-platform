import { Sparkles } from 'lucide-react';

interface TechnicalReviewCardProps {
  review?: string;
}

export function TechnicalReviewCard({ review }: TechnicalReviewCardProps) {
  return (
    <div className="rounded-[14px] border border-[#8B5CF6]/20 bg-[#111113] p-5 shadow-[0_0_30px_rgba(139,92,246,0.08)]">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded-md bg-[#8B5CF6]/20 flex items-center justify-center">
          <Sparkles size={11} className="text-[#A78BFA]" />
        </div>
        <h3 className="font-heading text-sm font-semibold text-white/90">Technical Review</h3>
      </div>
      <p className="text-sm text-[#A1A1AA] leading-relaxed whitespace-pre-line">
        {review ?? 'The technical review will appear here after the analysis finishes.'}
      </p>
    </div>
  );
}
