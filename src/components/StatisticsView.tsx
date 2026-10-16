import React, { useState } from 'react';
import { ShortLink, ClickLog } from '../types';
import { 
  BarChart3, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Globe2, 
  Clock, 
  Compass, 
  Filter,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

interface StatisticsViewProps {
  links: ShortLink[];
  clickLogs: ClickLog[];
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({
  links,
  clickLogs
}) => {
  const [selectedSlugFilter, setSelectedSlugFilter] = useState<string>('all');

  // Filter logs if a specific link is selected
  const activeLogs = selectedSlugFilter === 'all' 
    ? clickLogs 
    : clickLogs.filter(log => log.slug === selectedSlugFilter);

  // Compute stats
  const totalClicks = activeLogs.length;
  
  // Device breakdown
  const mobileCount = activeLogs.filter(l => l.device === 'mobile').length;
  const desktopCount = activeLogs.filter(l => l.device === 'desktop').length;
  const tabletCount = activeLogs.filter(l => l.device === 'tablet').length;
  const mobilePct = totalClicks > 0 ? Math.round((mobileCount / totalClicks) * 100) : 0;
  const desktopPct = totalClicks > 0 ? Math.round((desktopCount / totalClicks) * 100) : 0;
  const tabletPct = totalClicks > 0 ? Math.round((tabletCount / totalClicks) * 100) : 0;

  // GEO Country distribution
  const countryMap: Record<string, { count: number; code: string; flag: string }> = {};
  
  const getFlag = (code: string) => {
    switch (code.toUpperCase()) {
      case 'US': return '🇺🇸';
      case 'GB': return '🇬🇧';
      case 'DE': return '🇩🇪';
      case 'CA': return '🇨🇦';
      case 'AU': return '🇦🇺';
      case 'FR': return '🇫🇷';
      case 'JP': return '🇯🇵';
      case 'IN': return '🇮🇳';
      case 'BR': return '🇧🇷';
      default: return '🌐';
    }
  };

  activeLogs.forEach(log => {
    const country = log.country || 'Global';
    const code = log.countryCode || 'GL';
    if (!countryMap[country]) {
      countryMap[country] = { count: 0, code, flag: getFlag(code) };
    }
    countryMap[country].count++;
  });

  const topCountries = Object.entries(countryMap)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 6);

  // Referrer breakdown
  const referrerMap: Record<string, number> = {};
  activeLogs.forEach(log => {
    const ref = log.referrer || 'Direct Traffic';
    referrerMap[ref] = (referrerMap[ref] || 0) + 1;
  });
  const topReferrers = Object.entries(referrerMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Simulated 7-day trend
  const trendDays = [
    { day: 'Mon', clicks: 320 },
    { day: 'Tue', clicks: 485 },
    { day: 'Wed', clicks: 612 },
    { day: 'Thu', clicks: 540 },
    { day: 'Fri', clicks: 780 },
    { day: 'Sat', clicks: 920 },
    { day: 'Today', clicks: 1108 }
  ];
  const maxDayClicks = Math.max(...trendDays.map(d => d.clicks));

  return (
    <div className="space-y-6">
      
      {/* Top Filter and Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Traffic & Redirect Analytics</h2>
          <p className="text-xs text-neutral-400">Detailed breakdown of clicks, GEO locations, and device metrics.</p>
        </div>

        {/* Link Filter Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400 font-medium">Filter Link:</span>
          <select
            value={selectedSlugFilter}
            onChange={(e) => setSelectedSlugFilter(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500 font-mono"
          >
            <option value="all">All Smartlinks ({links.length})</option>
            {links.map(l => (
              <option key={l.id} value={l.slug}>/s/{l.slug} ({l.title})</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Clicks */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Tracked Clicks</span>
            <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {totalClicks.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>+18.4% vs last period</span>
          </div>
        </div>

        {/* Mobile Traffic Share */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Mobile Device Share</span>
            <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {mobilePct}%
          </div>
          <div className="text-[11px] text-neutral-400 font-mono">
            {mobileCount} Mobile · {desktopCount} Desktop
          </div>
        </div>

        {/* Top Country */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Top GEO Country</span>
            <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
              <Globe2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white flex items-center gap-2 font-mono">
            <span>{topCountries[0]?.[1].flag || '🌐'}</span>
            <span className="truncate">{topCountries[0]?.[0] || 'United States'}</span>
          </div>
          <div className="text-[11px] text-neutral-400 font-mono">
            {topCountries[0] ? `${Math.round((topCountries[0][1].count / totalClicks) * 100)}% of all clicks` : 'Leading traffic source'}
          </div>
        </div>

        {/* Splash Security Handshake */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Splash Gateway Passed</span>
            <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
            99.8%
          </div>
          <div className="text-[11px] text-neutral-400">
            5s countdown protection active
          </div>
        </div>

      </div>

      {/* Charts Section: 7-Day Trend & Device Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend Graph */}
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Click Volume Trend</h3>
              <p className="text-xs text-neutral-400">Daily redirect impressions over the past 7 days</p>
            </div>
            <div className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
              Live Aggregate
            </div>
          </div>

          <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2">
            {trendDays.map((d, index) => {
              const heightPct = Math.round((d.clicks / maxDayClicks) * 100);
              const isToday = index === trendDays.length - 1;
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] font-mono text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                    {d.clicks}
                  </span>
                  <div className="w-full max-w-[44px] bg-neutral-800 rounded-t-lg overflow-hidden flex items-end">
                    <div 
                      className={`w-full transition-all duration-500 rounded-t-lg ${
                        isToday ? 'bg-indigo-500' : 'bg-neutral-700 group-hover:bg-indigo-400'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className={`text-[11px] font-medium ${isToday ? 'text-indigo-400 font-bold' : 'text-neutral-500'}`}>
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-white">Device Breakdown</h3>
            <p className="text-xs text-neutral-400">Mobile vs Desktop vs Tablet</p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Mobile */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-neutral-300 flex items-center gap-2">
                  <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Mobile</span>
                </span>
                <span className="font-mono text-white font-bold tabular-nums">
                  {mobilePct}% ({mobileCount})
                </span>
              </div>
              <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${mobilePct}%` }} />
              </div>
            </div>

            {/* Desktop */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-neutral-300 flex items-center gap-2">
                  <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Desktop</span>
                </span>
                <span className="font-mono text-white font-bold tabular-nums">
                  {desktopPct}% ({desktopCount})
                </span>
              </div>
              <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${desktopPct}%` }} />
              </div>
            </div>

            {/* Tablet */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-neutral-300 flex items-center gap-2">
                  <Tablet className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tablet</span>
                </span>
                <span className="font-mono text-white font-bold tabular-nums">
                  {tabletPct}% ({tabletCount})
                </span>
              </div>
              <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${tabletPct}%` }} />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-800 text-[11px] text-neutral-500 leading-relaxed">
            Responsive splash countdown automatically optimizes for mobile touchscreens and desktop browsers.
          </div>
        </div>

      </div>

      {/* GEO Distribution & Traffic Sources Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* GEO Country Breakdown */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-indigo-400" />
                <span>Top Countries (GEO)</span>
              </h3>
              <p className="text-xs text-neutral-400">Visitor distribution by country origin</p>
            </div>
            <span className="text-[11px] font-mono text-neutral-500">Tier 1 & Global</span>
          </div>

          <div className="space-y-3">
            {topCountries.map(([country, data]) => {
              const pct = totalClicks > 0 ? Math.round((data.count / totalClicks) * 100) : 0;
              return (
                <div key={country} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-200 flex items-center gap-2">
                      <span className="text-base">{data.flag}</span>
                      <span>{country}</span>
                    </span>
                    <span className="font-mono text-neutral-300 tabular-nums">
                      {data.count} clicks <span className="text-neutral-500">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full" 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Referrers */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>Referral Traffic Sources</span>
              </h3>
              <p className="text-xs text-neutral-400">Where visitors find your smartlinks</p>
            </div>
            <span className="text-[11px] font-mono text-neutral-500">Channels</span>
          </div>

          <div className="space-y-3">
            {topReferrers.map(([ref, count]) => {
              const pct = totalClicks > 0 ? Math.round((count / totalClicks) * 100) : 0;
              return (
                <div key={ref} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-200">{ref}</span>
                    <span className="font-mono text-neutral-300 tabular-nums">
                      {count} clicks <span className="text-neutral-500">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full" 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Live Click Logs Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Live Visitor Stream & Click Logs</h3>
            <p className="text-xs text-neutral-400">Real-time incoming redirection requests and client metadata</p>
          </div>
          <span className="text-xs font-mono text-neutral-400 bg-neutral-950 px-3 py-1 rounded-lg border border-neutral-800">
            {activeLogs.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950/60 text-neutral-400 border-b border-neutral-800 text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Target Slug</th>
                <th className="py-3 px-4">Country & City</th>
                <th className="py-3 px-4">Device / OS</th>
                <th className="py-3 px-4">Referrer</th>
                <th className="py-3 px-4 text-right">Masked IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-mono text-[11px]">
              {activeLogs.map((log) => (
                <tr key={log.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="py-3 px-4 text-neutral-400 tabular-nums">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="py-3 px-4 text-indigo-400 font-medium">
                    /s/{log.slug}
                  </td>
                  <td className="py-3 px-4 text-neutral-200">
                    <span className="mr-1.5">{getFlag(log.countryCode)}</span>
                    <span>{log.country}</span>
                    {log.city && <span className="text-neutral-500 ml-1">({log.city})</span>}
                  </td>
                  <td className="py-3 px-4 text-neutral-300">
                    <span className="capitalize">{log.device}</span> · <span className="text-neutral-500">{log.os}</span>
                  </td>
                  <td className="py-3 px-4 text-neutral-400 font-sans">
                    {log.referrer}
                  </td>
                  <td className="py-3 px-4 text-right text-neutral-500 tabular-nums">
                    {log.ip}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
