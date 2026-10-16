import React, { useState } from 'react';
import { SplashConfig } from '../types';
import { 
  ShieldCheck, 
  Clock, 
  Settings2, 
  Save, 
  Check, 
  Eye, 
  Sparkles,
  Smartphone,
  Monitor
} from 'lucide-react';

interface SplashSettingsViewProps {
  config: SplashConfig;
  onSaveConfig: (updated: SplashConfig) => void;
  onLaunchFullPreview: () => void;
}

export const SplashSettingsView: React.FC<SplashSettingsViewProps> = ({
  config,
  onSaveConfig,
  onLaunchFullPreview
}) => {
  const [currentConfig, setCurrentConfig] = useState<SplashConfig>(config);
  const [saved, setSaved] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(currentConfig);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Title & Fullscreen Preview Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Splash Page & Safe Gateway Settings</h2>
          <p className="text-xs text-neutral-400">
            Customize the 5-second countdown timer, security messaging, and design theme.
          </p>
        </div>

        <button
          onClick={onLaunchFullPreview}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
        >
          <Eye className="w-4 h-4" />
          <span>Launch Fullscreen Splash</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Settings Form (5 columns) */}
        <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
            <Settings2 className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Gateway Configuration</h3>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            
            {/* Timer Duration */}
            <div>
              <label className="block text-neutral-300 font-medium mb-1">
                Default Countdown Timer
              </label>
              <select
                value={currentConfig.seconds}
                onChange={(e) => setCurrentConfig({ ...currentConfig, seconds: Number(e.target.value) })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-xs"
              >
                <option value={3}>3 Seconds (Quick Forward)</option>
                <option value={5}>5 Seconds (Recommended Standard)</option>
                <option value={8}>8 Seconds (Enhanced Verification)</option>
                <option value={10}>10 Seconds (Maximum Safety)</option>
              </select>
              <p className="text-[11px] text-neutral-500 mt-1">
                5 seconds is optimal for user retention and anti-bot verification.
              </p>
            </div>

            {/* Headline */}
            <div>
              <label className="block text-neutral-300 font-medium mb-1">
                Gateway Headline
              </label>
              <input
                type="text"
                value={currentConfig.headline}
                onChange={(e) => setCurrentConfig({ ...currentConfig, headline: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-xs"
                required
              />
            </div>

            {/* Subtext */}
            <div>
              <label className="block text-neutral-300 font-medium mb-1">
                Subtext Explanation
              </label>
              <textarea
                value={currentConfig.subtext}
                onChange={(e) => setCurrentConfig({ ...currentConfig, subtext: e.target.value })}
                rows={2}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-xs"
                required
              />
            </div>

            {/* Theme Style */}
            <div>
              <label className="block text-neutral-300 font-medium mb-1">
                Visual Theme Style
              </label>
              <select
                value={currentConfig.theme}
                onChange={(e) => setCurrentConfig({ ...currentConfig, theme: e.target.value as SplashConfig['theme'] })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-xs"
              >
                <option value="cyber-shield">Cyber Shield (Deep Slate & Indigo)</option>
                <option value="cloudflare-verify">Cloudflare Style (Security Check)</option>
                <option value="minimal-clean">Minimalist Clean (Monochrome & Emerald)</option>
              </select>
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-2 border-t border-neutral-800">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-neutral-200 font-medium">Show Instant Skip Button</span>
                  <p className="text-[11px] text-neutral-500">Allows visitors to click and proceed without waiting</p>
                </div>
                <input
                  type="checkbox"
                  checked={currentConfig.showSkipButton}
                  onChange={(e) => setCurrentConfig({ ...currentConfig, showSkipButton: e.target.checked })}
                  className="rounded bg-neutral-950 border-neutral-800 text-indigo-600 focus:ring-0 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-neutral-200 font-medium">Display Security Checklist Badges</span>
                  <p className="text-[11px] text-neutral-500">Shows SSL, anti-malware, and clean route checks</p>
                </div>
                <input
                  type="checkbox"
                  checked={currentConfig.showSecurityBadges}
                  onChange={(e) => setCurrentConfig({ ...currentConfig, showSecurityBadges: e.target.checked })}
                  className="rounded bg-neutral-950 border-neutral-800 text-indigo-600 focus:ring-0 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
              <span>{saved ? 'Configuration Saved!' : 'Save Gateway Settings'}</span>
            </button>

          </form>
        </div>

        {/* Live Device Interactive Preview (7 columns) */}
        <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Live Interactive Preview</span>
              </h3>
              <p className="text-xs text-neutral-400">Real-time simulation of visitor viewport</p>
            </div>

            {/* Desktop / Mobile toggle */}
            <div className="flex items-center gap-1 p-1 bg-neutral-950 border border-neutral-800 rounded-lg">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded transition ${previewDevice === 'desktop' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'}`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded transition ${previewDevice === 'mobile' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'}`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Device Mockup Shell */}
          <div className="my-auto py-4 flex items-center justify-center">
            <div 
              className={`bg-neutral-950 border border-neutral-800 rounded-3xl p-6 text-center space-y-4 shadow-xl transition-all duration-300 ${
                previewDevice === 'mobile' ? 'w-[320px] py-8' : 'w-full max-w-md'
              }`}
            >
              {/* Top micro bar */}
              <div className="flex items-center justify-between text-[10px] text-neutral-500 border-b border-neutral-900 pb-2">
                <span className="font-bold text-neutral-300">LinkShield Gate</span>
                <span className="text-emerald-400 font-mono">● 256-Bit SSL</span>
              </div>

              {/* Mockup Timer Ring */}
              <div className="w-20 h-20 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 flex flex-col items-center justify-center mx-auto my-2 animate-spin-slow">
                <span className="text-2xl font-black text-white font-mono">{currentConfig.seconds}</span>
                <span className="text-[8px] uppercase tracking-wider text-neutral-400">Sec</span>
              </div>

              {/* Title & text */}
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white leading-tight">
                  {currentConfig.headline}
                </h4>
                <p className="text-[11px] text-neutral-400 line-clamp-2">
                  {currentConfig.subtext}
                </p>
              </div>

              {/* Badges */}
              {currentConfig.showSecurityBadges && (
                <div className="bg-neutral-900 border border-neutral-800/80 rounded-xl p-2.5 text-left text-[10px] space-y-1 font-mono">
                  <div className="flex justify-between text-emerald-400">
                    <span>Malware Scan:</span>
                    <span>CLEAN</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Target Route:</span>
                    <span>VERIFIED</span>
                  </div>
                </div>
              )}

              {/* Button */}
              {currentConfig.showSkipButton && (
                <button
                  type="button"
                  onClick={onLaunchFullPreview}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition"
                >
                  Skip Wait & Proceed Now
                </button>
              )}

              <div className="text-[9px] text-neutral-500">
                Automatic redirect in {currentConfig.seconds} seconds
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-800 text-center text-xs text-neutral-500">
            Preview reflects real-time visual output for incoming smartlink traffic.
          </div>
        </div>

      </div>

    </div>
  );
};
