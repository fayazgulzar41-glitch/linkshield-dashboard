import React from 'react';
import { ActiveTab } from '../types';
import { Plus, ExternalLink, Shield } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  onNewLinkClick: () => void;
  onOpenTestSplash: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onNewLinkClick,
  onOpenTestSplash
}) => {
  const titles: Record<ActiveTab, { title: string; subtitle: string }> = {
    dashboard: { title: 'Dashboard', subtitle: 'Overview of money smartlinks, conversion metrics, and quick shortener' },
    links: { title: 'All Smartlinks', subtitle: 'Manage, edit destinations, and monitor active link redirects' },
    statistics: { title: 'Analytics & Tracking', subtitle: 'Real-time GEO location, device types, and visitor click logs' },
    domains: { title: 'Custom Domains', subtitle: 'Configure branded domains and CNAME routing for masked links' },
    splash: { title: 'Splash Page Settings', subtitle: 'Customize the 5-second countdown safety gate and branding' },
    export: { title: 'Self-Host Deployment Script', subtitle: 'Single-file optimized code to deploy your shortener on free hosting' }
  };

  const current = titles[activeTab];

  return (
    <header className="h-16 px-8 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between shrink-0">
      {/* Breadcrumb & Section Name */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <span className="text-neutral-500">LinkShield</span>
          <span>/</span>
          <span className="text-neutral-200 font-medium capitalize">{activeTab}</span>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenTestSplash}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700/80 border border-neutral-700/70 rounded-lg transition"
          title="Open interactive 5-second Splash Page"
        >
          <Shield className="w-3.5 h-3.5 text-indigo-400" />
          <span>Test Splash Page</span>
        </button>

        <button
          onClick={onNewLinkClick}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Create Short Link</span>
        </button>
      </div>
    </header>
  );
};
