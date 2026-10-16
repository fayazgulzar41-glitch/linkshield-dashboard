import React, { useState, useEffect } from 'react';
import { ShortLink, SplashConfig } from '../types';
import { 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink,
  ChevronLeft,
  Activity,
  Globe,
  Smartphone
} from 'lucide-react';

interface SplashRedirectPageProps {
  link: ShortLink;
  config?: SplashConfig;
  onBackToDashboard: () => void;
  onRecordClick?: (linkId: string, slug: string) => void;
}

export const SplashRedirectPage: React.FC<SplashRedirectPageProps> = ({
  link,
  config,
  onBackToDashboard,
  onRecordClick
}) => {
  const totalSeconds = link.splashSeconds || config?.seconds || 5;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [recorded, setRecorded] = useState(false);

  // Parse target domain for display
  let targetDomain = 'partner smartlink';
  try {
    targetDomain = new URL(link.originalUrl).hostname;
  } catch {
    targetDomain = link.originalUrl;
  }

  // Record click once on mount
  useEffect(() => {
    if (!recorded) {
      onRecordClick?.(link.id, link.slug);
      setRecorded(true);
    }
  }, [link, recorded, onRecordClick]);

  // Countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) {
      if (!hasRedirected) {
        setHasRedirected(true);
        // Execute redirect
        handleRedirect();
      }
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, hasRedirected]);

  const handleRedirect = () => {
    // In preview iframe, opening target in new tab or top window avoids sandbox blocking
    try {
      window.open(link.originalUrl, '_blank');
    } catch {
      window.location.href = link.originalUrl;
    }
  };

  // SVG circular calculations
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (secondsLeft / totalSeconds) * circumference;

  const getStepText = (sec: number) => {
    if (sec > 3) return 'Verifying link security & safety ratings...';
    if (sec > 1) return 'Scanning malware database & establishing safe tunnel...';
    if (sec === 1) return 'Handshake verified. Launching destination...';
    return 'Redirecting securely now...';
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between p-4 sm:p-8 font-sans relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header */}
      <header className="w-full max-w-xl mx-auto flex items-center justify-between py-2 relative z-10">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Exit to Dashboard</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>SSL 256-Bit Verified</span>
        </div>
      </header>

      {/* Central Splash Card */}
      <main className="w-full max-w-lg mx-auto bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative z-10 my-auto">
        <div className="text-center space-y-6">

          {/* Circular Countdown Progress Ring */}
          <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
            {/* Ambient ring glow */}
            <div className="absolute inset-0 rounded-full bg-indigo-500/10 animate-pulse" />
            
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="currentColor"
                strokeWidth="6"
                className="text-neutral-800"
                fill="transparent"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                className="text-indigo-500 transition-all duration-1000 ease-linear"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>

            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-extrabold text-white font-mono tracking-tight tabular-nums">
                {secondsLeft}
              </span>
              <span className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">
                Seconds
              </span>
            </div>
          </div>

          {/* Headline & Subtitle */}
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {config?.headline || 'Please wait, redirecting you securely...'}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-sm mx-auto leading-relaxed">
              Establishing a safe, encrypted tunnel to{' '}
              <span className="text-indigo-400 font-mono font-medium">{targetDomain}</span>.
            </p>
          </div>

          {/* Security Status checklist */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-left space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Malware & Phishing Safe</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-400">PASSED</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Bot & Threat Origin Filtering</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-400">CLEAN</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Direct Smartlink Forwarding</span>
              </span>
              <span className="text-[11px] font-mono text-indigo-400">CONNECTED</span>
            </div>
          </div>

          {/* Dynamic Stage Text */}
          <div className="text-[11px] text-neutral-400 font-mono flex items-center justify-center gap-1.5 py-1">
            <Activity className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
            <span>{getStepText(secondsLeft)}</span>
          </div>

          {/* Primary Action Button */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleRedirect}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              <span>Skip Wait & Proceed Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-[11px] text-neutral-500">
              Not redirecting automatically? Click the button above.
            </div>
          </div>

          {/* Target link disclosure */}
          <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
            <span>Slug: /s/{link.slug}</span>
            <span className="truncate max-w-[200px]" title={link.originalUrl}>
              {targetDomain}
            </span>
          </div>

        </div>
      </main>

      {/* Footer Branding */}
      <footer className="w-full max-w-xl mx-auto text-center py-4 relative z-10">
        <div className="text-[11px] text-neutral-400 flex items-center justify-center gap-4">
          <span>LinkShield Traffic Gate</span>
          <span>·</span>
          <span>Zero Logging Privacy</span>
          <span>·</span>
          <span>Instant Forwarding</span>
        </div>
      </footer>

    </div>
  );
};
