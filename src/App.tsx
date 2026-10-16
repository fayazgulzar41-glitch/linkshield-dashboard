import React, { useState, useEffect } from 'react';
import { 
  ShortLink, 
  ClickLog, 
  CustomDomain, 
  SplashConfig, 
  ActiveTab 
} from './types';
import { 
  INITIAL_LINKS, 
  INITIAL_DOMAINS, 
  INITIAL_CLICK_LOGS, 
  DEFAULT_SPLASH_CONFIG 
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LinkShortenerHero } from './components/LinkShortenerHero';
import { LinksTable } from './components/LinksTable';
import { StatisticsView } from './components/StatisticsView';
import { CustomDomainsView } from './components/CustomDomainsView';
import { SplashSettingsView } from './components/SplashSettingsView';
import { StandaloneExportModal } from './components/StandaloneExportModal';
import { SplashRedirectPage } from './components/SplashRedirectPage';
import { 
  BarChart3, 
  Globe2, 
  Smartphone, 
  ShieldCheck, 
  ExternalLink,
  ArrowRight,
  TrendingUp,
  Link as LinkIcon
} from 'lucide-react';

const STORAGE_KEY_LINKS = 'linkshield_links_v1';
const STORAGE_KEY_LOGS = 'linkshield_logs_v1';
const STORAGE_KEY_DOMAINS = 'linkshield_domains_v1';
const STORAGE_KEY_CONFIG = 'linkshield_splash_config_v1';

export default function App() {
  // Persistent State
  const [links, setLinks] = useState<ShortLink[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LINKS);
    return saved ? JSON.parse(saved) : INITIAL_LINKS;
  });

  const [clickLogs, setClickLogs] = useState<ClickLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LOGS);
    return saved ? JSON.parse(saved) : INITIAL_CLICK_LOGS;
  });

  const [domains, setDomains] = useState<CustomDomain[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_DOMAINS);
    return saved ? JSON.parse(saved) : INITIAL_DOMAINS;
  });

  const [splashConfig, setSplashConfig] = useState<SplashConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
    return saved ? JSON.parse(saved) : DEFAULT_SPLASH_CONFIG;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [activeSplashLink, setActiveSplashLink] = useState<ShortLink | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LINKS, JSON.stringify(links));
  }, [links]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(clickLogs));
  }, [clickLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DOMAINS, JSON.stringify(domains));
  }, [domains]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(splashConfig));
  }, [splashConfig]);

  // Check URL query on mount for direct ?s=slug link testing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('s');
    if (slug) {
      const match = links.find((l) => l.slug.toLowerCase() === slug.toLowerCase());
      if (match) {
        setActiveSplashLink(match);
      }
    }
  }, [links]);

  // Record visitor click
  const handleRecordClick = (linkId: string, slug: string) => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = /iPad|tablet/i.test(navigator.userAgent);
    const deviceType: 'mobile' | 'desktop' | 'tablet' = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop';

    const newLog: ClickLog = {
      id: `clk-${Date.now()}`,
      linkId,
      slug,
      timestamp: new Date().toISOString(),
      country: 'United States',
      countryCode: 'US',
      city: 'Direct Visitor',
      device: deviceType,
      browser: 'Web Browser',
      os: navigator.userAgent.includes('Mac') ? 'macOS' : navigator.userAgent.includes('Win') ? 'Windows' : 'Mobile OS',
      referrer: 'Direct Traffic',
      ip: '142.250.xxx.xxx'
    };

    setClickLogs((prev) => [newLog, ...prev.slice(0, 499)]);

    // Update link counters
    setLinks((prev) =>
      prev.map((l) =>
        l.id === linkId
          ? { ...l, totalClicks: l.totalClicks + 1, todayClicks: l.todayClicks + 1 }
          : l
      )
    );
  };

  // Create Short Link
  const handleShorten = (
    data: Omit<ShortLink, 'id' | 'createdAt' | 'totalClicks' | 'todayClicks'>
  ): ShortLink => {
    const newLink: ShortLink = {
      ...data,
      id: `link-${Date.now()}`,
      createdAt: new Date().toISOString(),
      totalClicks: 0,
      todayClicks: 0
    };

    setLinks((prev) => [newLink, ...prev]);
    return newLink;
  };

  // Toggle status (active/paused)
  const handleToggleStatus = (id: string) => {
    setLinks((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, status: l.status === 'active' ? 'paused' : 'active' } : l
      )
    );
  };

  // Update link fields (e.g. edit destination smartlink)
  const handleUpdateLink = (id: string, updates: Partial<ShortLink>) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
    );
  };

  // Delete link
  const handleDeleteLink = (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  };

  // Domain handlers
  const handleAddDomain = (domain: string, defaultRedirect: string) => {
    const newDomain: CustomDomain = {
      id: `dom-${Date.now()}`,
      domain,
      status: 'pending',
      ssl: false,
      targetHost: 'cname.linkshield.io',
      createdAt: new Date().toISOString(),
      defaultRedirect
    };
    setDomains((prev) => [...prev, newDomain]);
  };

  const handleVerifyDomain = (id: string) => {
    setDomains((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'active', ssl: true } : d))
    );
  };

  const handleDeleteDomain = (id: string) => {
    setDomains((prev) => prev.filter((d) => d.id !== id));
  };

  // Total metrics
  const totalClicks = clickLogs.length;
  const mobileCount = clickLogs.filter((l) => l.device === 'mobile').length;
  const mobilePercentage = totalClicks > 0 ? Math.round((mobileCount / totalClicks) * 100) : 0;

  // Render Fullscreen Splash Page if active
  if (activeSplashLink) {
    return (
      <SplashRedirectPage
        link={activeSplashLink}
        config={splashConfig}
        onBackToDashboard={() => setActiveSplashLink(null)}
        onRecordClick={handleRecordClick}
      />
    );
  }

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-100 font-sans overflow-hidden">
      
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalLinks={links.length}
        totalClicks={totalClicks}
        onOpenTestSplash={() => setActiveSplashLink(links[0] || null)}
      />

      {/* Main Workspace Canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          onNewLinkClick={() => setActiveTab('dashboard')}
          onOpenTestSplash={() => setActiveSplashLink(links[0] || null)}
        />

        {/* Scrollable Content Viewport */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 max-w-6xl mx-auto">
              
              {/* Prominent URL Shortener Hero Component */}
              <LinkShortenerHero
                onShorten={handleShorten}
                domains={domains}
                onTestSplash={(link) => setActiveSplashLink(link)}
              />

              {/* Quick KPI Overview Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-1">
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span>Total Redirects</span>
                    <BarChart3 className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-xl font-bold text-white font-mono tabular-nums">
                    {totalClicks.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Real-time tracking active</span>
                  </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-1">
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span>Active Smartlinks</span>
                    <LinkIcon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xl font-bold text-white font-mono tabular-nums">
                    {links.filter((l) => l.status === 'active').length} / {links.length}
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono">
                    Masked & Safe Gate Protected
                  </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-1">
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span>Mobile Share</span>
                    <Smartphone className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-xl font-bold text-white font-mono tabular-nums">
                    {mobilePercentage}%
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono">
                    Touchscreen Optimized
                  </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-1">
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span>Custom Domains</span>
                    <Globe2 className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-xl font-bold text-white font-mono tabular-nums">
                    {domains.filter((d) => d.status === 'active').length} Active
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono">
                    SSL 256-Bit Encrypted
                  </div>
                </div>

              </div>

              {/* Recent Smartlinks Table Snapshot */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">Your Managed Smartlinks</h3>
                    <p className="text-xs text-neutral-400">Overview of active money links and 5s splash redirects</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('links')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All ({links.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <LinksTable
                  links={links}
                  onToggleStatus={handleToggleStatus}
                  onUpdateLink={handleUpdateLink}
                  onDeleteLink={handleDeleteLink}
                  onTestSplash={(link) => setActiveSplashLink(link)}
                />
              </div>

            </div>
          )}

          {/* TAB 2: LINKS MANAGEMENT */}
          {activeTab === 'links' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Smartlink Directory</h2>
                  <p className="text-xs text-neutral-400">
                    Manage, mask, and swap destinations for your campaigns without breaking published links.
                  </p>
                </div>
              </div>

              <LinksTable
                links={links}
                onToggleStatus={handleToggleStatus}
                onUpdateLink={handleUpdateLink}
                onDeleteLink={handleDeleteLink}
                onTestSplash={(link) => setActiveSplashLink(link)}
              />
            </div>
          )}

          {/* TAB 3: STATISTICS & ANALYTICS */}
          {activeTab === 'statistics' && (
            <div className="max-w-6xl mx-auto">
              <StatisticsView links={links} clickLogs={clickLogs} />
            </div>
          )}

          {/* TAB 4: CUSTOM DOMAINS */}
          {activeTab === 'domains' && (
            <div className="max-w-4xl mx-auto">
              <CustomDomainsView
                domains={domains}
                onAddDomain={handleAddDomain}
                onVerifyDomain={handleVerifyDomain}
                onDeleteDomain={handleDeleteDomain}
              />
            </div>
          )}

          {/* TAB 5: SPLASH SETTINGS */}
          {activeTab === 'splash' && (
            <div className="max-w-5xl mx-auto">
              <SplashSettingsView
                config={splashConfig}
                onSaveConfig={setSplashConfig}
                onLaunchFullPreview={() => setActiveSplashLink(links[0] || null)}
              />
            </div>
          )}

          {/* TAB 6: SELF-HOST SCRIPT EXPORT */}
          {activeTab === 'export' && (
            <div className="max-w-5xl mx-auto">
              <StandaloneExportModal />
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
