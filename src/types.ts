export interface ShortLink {
  id: string;
  slug: string;
  originalUrl: string;
  title: string;
  createdAt: string;
  status: 'active' | 'paused';
  totalClicks: number;
  todayClicks: number;
  domain: string;
  splashSeconds: number;
  splashTheme: 'cyber-shield' | 'minimal-clean' | 'cloudflare-verify' | 'ad-monetize';
  notes?: string;
  tags: string[];
}

export interface ClickLog {
  id: string;
  linkId: string;
  slug: string;
  timestamp: string;
  country: string;
  countryCode: string;
  city: string;
  device: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  referrer: string;
  ip: string;
}

export interface CustomDomain {
  id: string;
  domain: string;
  status: 'active' | 'pending' | 'failed';
  ssl: boolean;
  targetHost: string;
  createdAt: string;
  defaultRedirect: string;
}

export interface SplashConfig {
  seconds: number;
  headline: string;
  subtext: string;
  theme: 'cyber-shield' | 'minimal-clean' | 'cloudflare-verify' | 'ad-monetize';
  showSkipButton: boolean;
  showSecurityBadges: boolean;
  adBannerText?: string;
}

export type ActiveTab = 'dashboard' | 'links' | 'statistics' | 'domains' | 'splash' | 'export';
