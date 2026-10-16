import React, { useState } from 'react';
import { STANDALONE_NODE_SERVER, STANDALONE_STATIC_HTML } from '../utils/standaloneScripts';
import { 
  Code2, 
  Copy, 
  Check, 
  Download, 
  Server, 
  FileCode, 
  Terminal, 
  ExternalLink,
  Zap,
  CheckCircle2
} from 'lucide-react';

export const StandaloneExportModal: React.FC = () => {
  const [selectedScript, setSelectedScript] = useState<'node' | 'html'>('node');
  const [copied, setCopied] = useState(false);

  const activeCode = selectedScript === 'node' ? STANDALONE_NODE_SERVER : STANDALONE_STATIC_HTML;
  const fileName = selectedScript === 'node' ? 'server.js' : 'index.html';

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([activeCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-400" />
            <span>Standalone Self-Host Scripts</span>
          </h2>
          <p className="text-xs text-neutral-400">
            Export the complete single-file code ready to run on free hosts with zero external dependencies.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Full Code'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download {fileName}</span>
          </button>
        </div>
      </div>

      {/* Script Selection Segmented Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Node.js Option */}
        <div 
          onClick={() => setSelectedScript('node')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedScript === 'node'
              ? 'bg-indigo-500/10 border-indigo-500/50 shadow-xs'
              : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-neutral-800 rounded-lg text-emerald-400">
                <Server className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-white">Node.js / Express Single-File</span>
            </div>
            <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
              Recommended
            </span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Complete full-stack script (<code className="text-indigo-300 font-mono">server.js</code>) with clean <code className="text-indigo-300 font-mono">/s/:slug</code> routing, automatic IP/GEO extraction, 5-second countdown splash page, and embedded dashboard.
          </p>
        </div>

        {/* HTML Option */}
        <div 
          onClick={() => setSelectedScript('html')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedScript === 'html'
              ? 'bg-indigo-500/10 border-indigo-500/50 shadow-xs'
              : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-neutral-800 rounded-lg text-amber-400">
                <FileCode className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-white">Single-File Static HTML</span>
            </div>
            <span className="text-[10px] font-mono bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full">
              Zero Server
            </span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Pure client-side single file (<code className="text-indigo-300 font-mono">index.html</code>) using localStorage and URL query parameters (<code className="text-indigo-300 font-mono">?s=slug</code>). Host for free on GitHub Pages, Vercel, or Netlify.
          </p>
        </div>

      </div>

      {/* Code Viewer */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-neutral-950/90 px-4 py-3 border-b border-neutral-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-neutral-400 font-mono">
            <Terminal className="w-3.5 h-3.5 text-neutral-500" />
            <span>{fileName}</span>
            <span className="text-neutral-600">·</span>
            <span className="text-neutral-500">{(activeCode.length / 1024).toFixed(1)} KB</span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="p-4 bg-neutral-950 font-mono text-xs text-neutral-300 overflow-x-auto max-h-[420px] leading-relaxed">
          <pre>{activeCode}</pre>
        </div>
      </div>

      {/* 3-Step Free Deployment Guide */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>How to Deploy for Free (Takes 2 Minutes)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          {/* Step 1 */}
          <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">1</span>
              <span>Local or VPS Setup</span>
            </div>
            <p className="text-neutral-400 text-[11px] leading-relaxed">
              Create a folder, save the file as <code className="text-indigo-300 font-mono">server.js</code>, run <code className="text-neutral-200 font-mono">npm install express</code>, then <code className="text-neutral-200 font-mono">node server.js</code>.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">2</span>
              <span>Free Cloud Host (Render)</span>
            </div>
            <p className="text-neutral-400 text-[11px] leading-relaxed">
              Push to a free GitHub repository, link to <strong>Render.com</strong> as a Web Service. Set Build Command to <code className="text-neutral-200 font-mono">npm install express</code> and Start to <code className="text-neutral-200 font-mono">node server.js</code>.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">3</span>
              <span>Connect Custom Domain</span>
            </div>
            <p className="text-neutral-400 text-[11px] leading-relaxed">
              Add a CNAME record in your registrar pointing to your Render/Railway instance URL to immediately enable branded masked links.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
