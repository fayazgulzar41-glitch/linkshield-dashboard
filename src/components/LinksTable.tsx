import React, { useState } from 'react';
import { ShortLink } from '../types';
import { 
  Search, 
  Copy, 
  Check, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  QrCode, 
  Filter, 
  Clock, 
  ShieldAlert,
  ArrowUpRight,
  Sliders,
  CheckCircle2,
  X
} from 'lucide-react';

interface LinksTableProps {
  links: ShortLink[];
  onToggleStatus: (id: string) => void;
  onUpdateLink: (id: string, updates: Partial<ShortLink>) => void;
  onDeleteLink: (id: string) => void;
  onTestSplash: (link: ShortLink) => void;
}

export const LinksTable: React.FC<LinksTableProps> = ({
  links,
  onToggleStatus,
  onUpdateLink,
  onDeleteLink,
  onTestSplash
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Edit Destination Modal State
  const [editingLink, setEditingLink] = useState<ShortLink | null>(null);
  const [editUrl, setEditUrl] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editSeconds, setEditSeconds] = useState(5);

  // QR Code Modal State
  const [qrLink, setQrLink] = useState<ShortLink | null>(null);

  const filteredLinks = links.filter((link) => {
    const matchesSearch = 
      link.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.originalUrl.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || link.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCopy = (link: ShortLink) => {
    const full = `https://${link.domain}/s/${link.slug}`;
    navigator.clipboard.writeText(full);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStartEdit = (link: ShortLink) => {
    setEditingLink(link);
    setEditUrl(link.originalUrl);
    setEditTitle(link.title);
    setEditSeconds(link.splashSeconds || 5);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink) return;
    onUpdateLink(editingLink.id, {
      originalUrl: editUrl.trim(),
      title: editTitle.trim(),
      splashSeconds: editSeconds
    });
    setEditingLink(null);
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search smartlinks by title, slug, or target URL..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Status segmented buttons */}
        <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'all' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            All ({links.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'active' ? 'bg-neutral-800 text-emerald-400 font-semibold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Active ({links.filter(l => l.status === 'active').length})
          </button>
          <button
            onClick={() => setStatusFilter('paused')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'paused' ? 'bg-neutral-800 text-amber-400 font-semibold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Paused ({links.filter(l => l.status === 'paused').length})
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950/80 text-neutral-400 border-b border-neutral-800 text-[11px] font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Smartlink / Masked URL</th>
                <th className="py-3.5 px-6">Destination Target</th>
                <th className="py-3.5 px-4 text-center">Splash</th>
                <th className="py-3.5 px-4 text-right">Total Clicks</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/70">
              {filteredLinks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-500">
                    <p className="text-sm font-medium text-neutral-400">No links found</p>
                    <p className="text-xs text-neutral-500 mt-1">Try adjusting your search query or create a new smartlink above.</p>
                  </td>
                </tr>
              ) : (
                filteredLinks.map((link) => {
                  const isCopied = copiedId === link.id;
                  return (
                    <tr key={link.id} className="hover:bg-neutral-800/30 transition-colors group">
                      
                      {/* Short Link & Title */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                            {link.title}
                          </div>
                          <div className="flex items-center gap-2 font-mono text-indigo-400 text-[11px]">
                            <span>https://{link.domain}/s/{link.slug}</span>
                            <button
                              onClick={() => handleCopy(link)}
                              className="text-neutral-500 hover:text-white transition cursor-pointer"
                              title="Copy short link"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          {link.tags && link.tags.length > 0 && (
                            <div className="flex items-center gap-1.5 text-[10px] text-neutral-500">
                              {link.tags.map((t, idx) => (
                                <React.Fragment key={t}>
                                  <span>#{t}</span>
                                  {idx < link.tags.length - 1 && <span>·</span>}
                                </React.Fragment>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Destination Smartlink */}
                      <td className="py-4 px-6 max-w-xs">
                        <div className="space-y-0.5">
                          <div 
                            className="font-mono text-neutral-300 truncate text-[11px] hover:text-white cursor-pointer" 
                            title={link.originalUrl}
                            onClick={() => handleStartEdit(link)}
                          >
                            {link.originalUrl}
                          </div>
                          <button
                            onClick={() => handleStartEdit(link)}
                            className="text-[10px] text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-2.5 h-2.5" />
                            <span>Change target link</span>
                          </button>
                        </div>
                      </td>

                      {/* Splash Countdown */}
                      <td className="py-4 px-4 text-center">
                        <span className="font-mono text-xs text-neutral-300 bg-neutral-950 border border-neutral-800 px-2 py-1 rounded-md">
                          {link.splashSeconds || 5}s
                        </span>
                      </td>

                      {/* Clicks */}
                      <td className="py-4 px-4 text-right">
                        <div className="space-y-0.5">
                          <span className="text-sm font-bold text-white font-mono tabular-nums">
                            {link.totalClicks.toLocaleString()}
                          </span>
                          <div className="text-[10px] text-neutral-500 font-mono tabular-nums">
                            +{link.todayClicks} today
                          </div>
                        </div>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => onToggleStatus(link.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition cursor-pointer ${
                            link.status === 'active'
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                              : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                          }`}
                          title="Click to toggle status"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${link.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                          <span className="capitalize">{link.status}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Test Splash */}
                          <button
                            onClick={() => onTestSplash(link)}
                            className="px-2.5 py-1.5 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 text-indigo-300 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1 transition cursor-pointer"
                            title="Test 5-Second Splash Page Redirect"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Test</span>
                          </button>

                          {/* QR Code */}
                          <button
                            onClick={() => setQrLink(link)}
                            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition cursor-pointer"
                            title="Show QR Code"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Details */}
                          <button
                            onClick={() => handleStartEdit(link)}
                            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition cursor-pointer"
                            title="Edit Link"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Link */}
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete short link "/s/${link.slug}"?`)) {
                                onDeleteLink(link.id);
                              }
                            }}
                            className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 rounded-lg transition cursor-pointer"
                            title="Delete Link"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Destination Modal */}
      {editingLink && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Edit Smartlink Destination</h3>
              </div>
              <button
                onClick={() => setEditingLink(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-medium mb-1">Link Title / Campaign</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-medium mb-1">
                  Destination URL (Masked Smartlink)
                </label>
                <input
                  type="url"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono text-xs"
                  required
                />
                <p className="text-[11px] text-neutral-500 mt-1">
                  You can change this money link anytime. The short URL (/s/{editingLink.slug}) stays permanently active!
                </p>
              </div>

              <div>
                <label className="block text-neutral-400 font-medium mb-1">
                  Splash Page Countdown Duration
                </label>
                <select
                  value={editSeconds}
                  onChange={(e) => setEditSeconds(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-xs"
                >
                  <option value={3}>3 Seconds</option>
                  <option value={5}>5 Seconds (Default Safe)</option>
                  <option value={10}>10 Seconds (Verification)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingLink(null)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {qrLink && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4 relative">
            <button
              onClick={() => setQrLink(null)}
              className="absolute right-4 top-4 text-neutral-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-white">QR Code for /s/{qrLink.slug}</h3>
            
            <div className="w-48 h-48 bg-white p-3 rounded-2xl mx-auto flex items-center justify-center shadow-md">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`https://${qrLink.domain}/s/${qrLink.slug}`)}`}
                alt="QR Code"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="font-mono text-xs text-indigo-400 break-all">
              https://{qrLink.domain}/s/{qrLink.slug}
            </div>

            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Scan with any mobile phone camera to trigger the safe 5-second countdown redirect.
            </p>

            <button
              onClick={() => setQrLink(null)}
              className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-medium transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
