import React from 'react';
import { ActiveTab } from '../types';
import { 
  LayoutDashboard, 
  Link2, 
  BarChart3, 
  Globe2, 
  ShieldCheck, 
  Code2, 
  ExternalLink,
  Zap,
  Server
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  totalLinks: number;
  totalClicks: number;
  onOpenTestSplash: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  totalLinks,
  totalClicks,
  onOpenTestSplash
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ElementType; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'links', label: 'Links', icon: Link2, badge: totalLinks },
    { id: 'statistics', label: 'Statistics', icon: BarChart3 },
    { id: 'domains', label: 'Custom Domains', icon: Globe2 },
    { id: 'splash', label: 'Splash Screen', icon: ShieldCheck },
    { id: 'export', label: 'Self-Host Script', icon: Code2, badge: 'Free' }
  ];

  return (
    <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col shrink-0">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-tight">LinkShield</div>
            <div className="text-[10px] text-neutral-400 font-mono">Smartlink Masker</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1 flex-1">
        <div className="px-3 py-2 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
          Management
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-neutral-800 text-white font-semibold shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-neutral-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-indigo-500/20 text-indigo-300' : 'bg-neutral-800 text-neutral-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Test Splash Redirect Button */}
      <div className="p-4 border-t border-neutral-800">
        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-neutral-400 font-medium">Redirect Engine</span>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
              5s Active
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Test how visitors see the 5-second countdown safe splash page.
          </p>
          <button
            onClick={onOpenTestSplash}
            className="w-full flex items-center justify-center gap-1.5 bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/30 text-indigo-300 hover:text-white px-3 py-2 rounded-lg text-xs font-medium transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Launch Splash Preview</span>
          </button>
        </div>

        {/* Self-Host info card */}
        <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
          <span className="flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-neutral-400" />
            Self-Host Ready
          </span>
          <span className="font-mono text-neutral-400 tabular-nums">v1.2.0</span>
        </div>
      </div>
    </aside>
  );
};
