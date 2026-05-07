import { NavLink } from 'react-router-dom';
import {
  Play,
  BarChart2,
  Settings,
  HelpCircle,
  Plus,
  ChevronDown,
} from 'lucide-react';
import { cn } from '../../utils/cn';

const PRIMARY_NAV_ITEMS = [
  { label: 'Run Test', icon: Play, to: '/run-test' },
  { label: 'Reports', icon: BarChart2, to: '/reports' },
];

const SUPPORT_NAV_ITEMS = [
  { label: 'Settings', icon: Settings, to: '/settings' },
  { label: 'Help', icon: HelpCircle, to: '/help' },
];

export function Sidebar() {
  return (
    <aside className="w-[210px] h-full bg-[#0D0D10] border-r border-white/[0.06] flex flex-col flex-shrink-0 overflow-hidden">
      <div className="px-4 py-5 border-b border-white/[0.06]">
        <button className="w-full flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 flex items-center justify-center flex-shrink-0">
            <div className="w-3 h-3 rounded-sm bg-[#8B5CF6]" />
          </div>
          <div className="text-left min-w-0">
            <p className="text-sm font-semibold text-white/90 font-heading truncate">Project Alpha</p>
            <p className="text-[10px] text-[#71717A]">Staging Environment</p>
          </div>
          <ChevronDown size={14} className="text-[#71717A] ml-auto flex-shrink-0 group-hover:text-white/60 transition-colors" />
        </button>
      </div>

      <div className="px-3 py-3 border-b border-white/[0.06]">
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] text-[#71717A] text-xs hover:bg-white/[0.07] transition-colors">
          <span className="opacity-60">⌘K</span>
          <span className="flex-1 text-left">Search...</span>
        </button>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {PRIMARY_NAV_ITEMS.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group',
                isActive
                  ? 'bg-[#8B5CF6]/15 text-white border border-[#8B5CF6]/20'
                  : 'text-[#71717A] hover:text-white/80 hover:bg-white/[0.04]'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={isActive ? 'text-[#A78BFA]' : ''} />
                <span className="font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-2 py-3 border-t border-white/[0.06] space-y-0.5">
        {SUPPORT_NAV_ITEMS.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-[#71717A] hover:text-white/80 hover:bg-white/[0.04] transition-all duration-150"
          >
            <Icon size={16} />
            <span className="font-medium">{label}</span>
          </NavLink>
        ))}

        <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] transition-colors duration-150 mt-3">
          <Plus size={15} />
          New Test Suite
        </button>
      </div>
    </aside>
  );
}
