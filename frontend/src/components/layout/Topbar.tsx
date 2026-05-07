import { Bell, Settings, Search } from 'lucide-react';

interface TopbarProps {
  title?: string;
}

export function Topbar({ title = 'QA Intelligence' }: TopbarProps) {
  return (
    <header className="h-14 shrink-0 border-b border-white/[0.06] bg-[#09090B]/80 backdrop-blur-sm flex items-center px-6 gap-4 z-20">
      <div className="flex items-center gap-2 mr-4">
        <span className="font-heading font-bold text-white text-base tracking-tight">{title}</span>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] rounded-lg px-3 py-1.5 w-52">
          <Search size={13} className="text-[#71717A]" />
          <span className="text-xs text-[#4B4B55]">Search tests...</span>
        </div>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.06] text-[#71717A] hover:text-white/80 transition-colors relative">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.06] text-[#71717A] hover:text-white/80 transition-colors">
          <Settings size={16} />
        </button>
        <button className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] flex items-center justify-center text-xs font-semibold text-white ml-1">
          GC
        </button>
      </div>
    </header>
  );
}
