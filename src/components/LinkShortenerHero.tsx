import React, { useState } from 'react';
import { ShortLink, CustomDomain } from '../types';
import { 
  Link2, 
  ArrowRight, 
  Copy, 
  Check, 
  ExternalLink, 
  SlidersHorizontal, 
  QrCode, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface LinkShortenerHeroProps {
  onShorten: (newLink: Omit<ShortLink, 'id' | 'createdAt' | 'totalClicks' | 'todayClicks'>) => ShortLink;
  domains: CustomDomain[];
  onTestSplash: (link: ShortLink) => void;
}

export const LinkShortenerHero: React.FC<LinkShortenerHeroProps> = ({
  onShorten,
  domains,
  onTestSplash
}) => {
  const [url, setUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [selectedDomain, setSelectedDomain] = useState(domains[0]?.domain || 'linkshield.io');
  const [splashSeconds, setSplashSeconds] = useState(5);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<ShortLink | null>(null);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError('Please provide a destination link.');
      return;
    }

    // Add https:// if missing
    let finalUrl = trimmedUrl;
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }

    try {
      new URL(finalUrl);
    } catch {
      setError('Please enter a valid URL.');
      return;
    }

    // Generate random slug if empty
    const finalSlug = (slug.trim() || Math.random().toString(36).substring(2, 8)).toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const finalTitle = title.trim() || `Smartlink (${finalSlug})`;

    const created = onShorten({
      slug: finalSlug,
      originalUrl: finalUrl,
      title: finalTitle,
      status: 'active',
      domain: selectedDomain,
      splashSeconds,
      splashTheme: 'cyber-shield',
      tags: ['smartlink', 'masked']
    });

    setGeneratedLink(created);
    setUrl('');
    setSlug('');
    setTitle('');
  };

  const handleCopy = () => {
    if (!generatedLink) return;
    const fullUrl = `https://${generatedLink.domain}/s/${generatedLink.slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
      {/* Decorative subtle ambient lights */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto space-y-6 relative z-10">
        
        {/* Header Title */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>5-Second Secure Splash Protection Active</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Shorten & Mask Your Smartlinks
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-lg mx-auto">
            Generate clean masked links with safe countdown splash pages, GEO tracking, and device detection.
          </p>
        </div>

        {/* Central Prominent Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch gap-2.5 p-2 bg-neutral-950 border border-neutral-800 rounded-2xl focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
            <div className="flex items-center pl-3 text-neutral-500">
              <Link2 className="w-5 h-5" />
            </div>
            
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste a long link (e.g. https://target-smartlink.com/offer?aff=123)"
              className="flex-1 bg-transparent px-2 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none"
              required
            />

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-semibold text-sm rounded-xl transition shadow-xs whitespace-nowrap cursor-pointer"
            >
              <span>Shorten</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {error && (
            <p className="text-xs text-rose-400 px-2 font-medium">{error}</p>
          )}

          {/* Advanced toggle bar */}
          <div className="flex items-center justify-between px-1 text-xs text-neutral-400">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1.5 hover:text-neutral-200 transition text-[11px]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{showAdvanced ? 'Hide Custom Options' : 'Custom Alias, Domain & Timer'}</span>
            </button>

            <span className="text-[11px] text-neutral-500 font-mono">
              Redirect Mode: 5-Second Splash
            </span>
          </div>

          {/* Advanced options accordion */}
          {showAdvanced && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-neutral-950/80 border border-neutral-800/80 rounded-xl text-xs">
              <div>
                <label className="block text-neutral-400 font-medium mb-1">Custom Alias (Slug)</label>
                <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 focus-within:border-indigo-500">
                  <span className="text-neutral-500 font-mono">/s/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="my-offer"
                    className="w-full bg-transparent px-1 text-white placeholder-neutral-600 focus:outline-none font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-medium mb-1">Target Domain</label>
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono text-xs"
                >
                  <option value="linkshield.io">linkshield.io (Default)</option>
                  {domains.map((d) => (
                    <option key={d.id} value={d.domain}>{d.domain}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 font-medium mb-1">Splash Delay</label>
                <select
                  value={splashSeconds}
                  onChange={(e) => setSplashSeconds(Number(e.target.value))}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-indigo-500 text-xs"
                >
                  <option value={3}>3 Seconds (Fast)</option>
                  <option value={5}>5 Seconds (Recommended)</option>
                  <option value={10}>10 Seconds (Verification)</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-neutral-400 font-medium mb-1">Campaign Title (Optional Note)</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Fall 2026 CPA Offer #1"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>
            </div>
          )}
        </form>

        {/* Short Link Result Box */}
        {generatedLink && (
          <div className="bg-neutral-950 border border-indigo-500/30 rounded-xl p-4 sm:p-5 space-y-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Short Link Ready!
              </span>
              <span className="text-[11px] text-neutral-400 font-mono">
                Timer: {generatedLink.splashSeconds}s Countdown
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-neutral-900/90 border border-neutral-800 rounded-xl p-3">
              <div className="min-w-0 flex-1">
                <div className="text-sm sm:text-base font-bold text-indigo-400 font-mono truncate">
                  https://{generatedLink.domain}/s/{generatedLink.slug}
                </div>
                <div className="text-[11px] text-neutral-400 truncate mt-0.5" title={generatedLink.originalUrl}>
                  Destination: <span className="font-mono text-neutral-300">{generatedLink.originalUrl}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-medium transition cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowQR(!showQR)}
                  className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg transition cursor-pointer"
                  title="Toggle QR Code"
                >
                  <QrCode className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onTestSplash(generatedLink)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Test Splash</span>
                </button>
              </div>
            </div>

            {/* QR Code preview block */}
            {showQR && (
              <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-neutral-900 border border-neutral-800 rounded-lg">
                <div className="w-24 h-24 bg-white p-2 rounded-lg flex items-center justify-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`https://${generatedLink.domain}/s/${generatedLink.slug}`)}`}
                    alt="Short Link QR Code"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-xs text-neutral-400 space-y-1">
                  <div className="text-white font-medium">Scannable QR Code</div>
                  <p className="text-[11px] text-neutral-400">
                    Use in mobile promo materials, flyers, or streaming overlays. Mobile visitors will see the 5-second responsive safe splash screen.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
