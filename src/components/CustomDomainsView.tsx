import React, { useState } from 'react';
import { CustomDomain } from '../types';
import { 
  Globe2, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Trash2, 
  RefreshCw, 
  HelpCircle,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';

interface CustomDomainsViewProps {
  domains: CustomDomain[];
  onAddDomain: (domain: string, defaultRedirect: string) => void;
  onVerifyDomain: (id: string) => void;
  onDeleteDomain: (id: string) => void;
}

export const CustomDomainsView: React.FC<CustomDomainsViewProps> = ({
  domains,
  onAddDomain,
  onVerifyDomain,
  onDeleteDomain
}) => {
  const [newDomain, setNewDomain] = useState('');
  const [newRedirect, setNewRedirect] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;
    onAddDomain(newDomain.trim().toLowerCase(), newRedirect.trim() || 'https://google.com');
    setNewDomain('');
    setNewRedirect('');
    setIsAdding(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedValue(text);
    setTimeout(() => setCopiedValue(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Custom Branded Domains</h2>
          <p className="text-xs text-neutral-400">
            Mask smartlinks with your own reputable domains to boost CTR and evade social media link blocks.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Domain</span>
        </button>
      </div>

      {/* Add Domain Drawer */}
      {isAdding && (
        <form onSubmit={handleAdd} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 text-xs animate-in fade-in duration-150">
          <h3 className="text-sm font-bold text-white">Connect a New Custom Domain</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-400 font-medium mb-1">Domain or Subdomain</label>
              <input
                type="text"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="e.g. go.mybusiness.com or deals.link"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-500 font-mono text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-neutral-400 font-medium mb-1">Root Fallback Destination (Optional)</label>
              <input
                type="url"
                value={newRedirect}
                onChange={(e) => setNewRedirect(e.target.value)}
                placeholder="https://mybusiness.com"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-500 text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Add Domain & Get DNS Records
            </button>
          </div>
        </form>
      )}

      {/* Domains List */}
      <div className="grid grid-cols-1 gap-4">
        {domains.map((dom) => (
          <div key={dom.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-neutral-800 rounded-xl text-indigo-400">
                  <Globe2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white font-mono flex items-center gap-2">
                    <span>{dom.domain}</span>
                    {dom.status === 'active' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Active & Routed</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" />
                        <span>Pending DNS Verification</span>
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    Root fallback: <span className="text-neutral-300 font-mono">{dom.defaultRedirect}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {dom.status !== 'active' && (
                  <button
                    onClick={() => onVerifyDomain(dom.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-indigo-300 hover:text-white rounded-lg text-xs font-medium transition cursor-pointer"
                    title="Simulate DNS Verification"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Verify DNS</span>
                  </button>
                )}
                
                <button
                  onClick={() => {
                    if (window.confirm(`Remove custom domain "${dom.domain}"?`)) {
                      onDeleteDomain(dom.id);
                    }
                  }}
                  className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 rounded-lg transition cursor-pointer"
                  title="Remove Domain"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* DNS Instructions Box */}
            <div className="bg-neutral-950 border border-neutral-800/80 rounded-xl p-3.5 text-xs space-y-2">
              <div className="text-neutral-400 font-medium flex items-center justify-between text-[11px]">
                <span>Required DNS CNAME Record</span>
                <span className="font-mono text-neutral-500">TTL: Automatic (3600s)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px]">
                <div className="bg-neutral-900 p-2 rounded-lg border border-neutral-800">
                  <span className="text-neutral-500 block text-[10px]">Record Type</span>
                  <span className="text-indigo-400 font-bold">CNAME</span>
                </div>
                <div className="bg-neutral-900 p-2 rounded-lg border border-neutral-800 flex items-center justify-between">
                  <div>
                    <span className="text-neutral-500 block text-[10px]">Host / Subdomain</span>
                    <span className="text-neutral-200">{dom.domain.split('.')[0]}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(dom.domain.split('.')[0])}
                    className="text-neutral-500 hover:text-white"
                  >
                    {copiedValue === dom.domain.split('.')[0] ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <div className="bg-neutral-900 p-2 rounded-lg border border-neutral-800 flex items-center justify-between">
                  <div>
                    <span className="text-neutral-500 block text-[10px]">Target Destination</span>
                    <span className="text-neutral-200">{dom.targetHost}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(dom.targetHost)}
                    className="text-neutral-500 hover:text-white"
                  >
                    {copiedValue === dom.targetHost ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Cloudflare & SSL Notice */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 flex items-start gap-3.5 text-xs text-neutral-400">
        <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-white">Automatic Free SSL & Cloudflare Edge Protection</div>
          <p className="leading-relaxed text-neutral-400">
            Once your CNAME points to your self-hosted instance or proxy, SSL certificates are issued automatically via Let's Encrypt or Cloudflare Edge. Your visitors will always see a secure green padlock before entering the 5-second countdown redirect.
          </p>
        </div>
      </div>

    </div>
  );
};
