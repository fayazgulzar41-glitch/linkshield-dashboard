import { ShortLink, ClickLog, CustomDomain, SplashConfig } from '../types';

export const INITIAL_LINKS: ShortLink[] = [
  {
    id: 'link-1',
    slug: 'finance-offer',
    originalUrl: 'https://smarttrk.finleadnetwork.com/click?offer_id=8902&aff_id=4109&sub1=fb_campaign_us&sub2=ad_set_04',
    title: 'High-Yield Finance Smartlink (Tier 1 CPA)',
    createdAt: '2026-10-12T09:14:22Z',
    status: 'active',
    totalClicks: 1482,
    todayClicks: 142,
    domain: 'go.dealsvault.co',
    splashSeconds: 5,
    splashTheme: 'cyber-shield',
    notes: 'Primary money link for Facebook & Native ads',
    tags: ['finance', 'cpa', 'tier1']
  },
  {
    id: 'link-2',
    slug: 'vpn-flash70',
    originalUrl: 'https://partners.privateshieldvpn.com/promo/exclusive-discount?ref=aff_super99&utm_source=direct&bonus=annual',
    title: 'VPN 70% Off Promo Smartlink',
    createdAt: '2026-10-13T14:30:10Z',
    status: 'active',
    totalClicks: 846,
    todayClicks: 89,
    domain: 'secure.trklink.net',
    splashSeconds: 5,
    splashTheme: 'cyber-shield',
    notes: 'High conversion software affiliate deal',
    tags: ['vpn', 'software', 'discount']
  },
  {
    id: 'link-3',
    slug: 'mobile-rpg-loot',
    originalUrl: 'https://cpa.appgrowthmedia.io/install?app_id=mythic_clash_rpg&channel=tiktok_influencer&geo_target=all',
    title: 'Mobile Gaming App Install Smartlink',
    createdAt: '2026-10-14T11:05:40Z',
    status: 'active',
    totalClicks: 2190,
    todayClicks: 310,
    domain: 'go.dealsvault.co',
    splashSeconds: 5,
    splashTheme: 'minimal-clean',
    notes: 'TikTok & Reels swipe-up landing destination',
    tags: ['gaming', 'mobile', 'cpi']
  },
  {
    id: 'link-4',
    slug: 'crypto-bonus',
    originalUrl: 'https://globaltrade.crypto-partners.org/register?ref_code=VIP_BONUS_1000&campaign=telegram_alpha',
    title: 'Crypto Exchange VIP Deposit Bonus',
    createdAt: '2026-10-15T18:22:15Z',
    status: 'active',
    totalClicks: 632,
    todayClicks: 47,
    domain: 'linkshield.io',
    splashSeconds: 5,
    splashTheme: 'cloudflare-verify',
    notes: 'Telegram and community channel redirection',
    tags: ['crypto', 'trading', 'bounty']
  },
  {
    id: 'link-5',
    slug: 'ecommerce-clearance',
    originalUrl: 'https://shop.outletsuperstore.net/collections/clearance-deals?source=newsletter_affiliate&track=oct2026',
    title: 'Fall Clearance Outlet Smartlink',
    createdAt: '2026-10-15T22:10:00Z',
    status: 'paused',
    totalClicks: 320,
    todayClicks: 0,
    domain: 'linkshield.io',
    splashSeconds: 5,
    splashTheme: 'minimal-clean',
    notes: 'Campaign paused due to inventory restock',
    tags: ['ecommerce', 'retail']
  }
];

export const INITIAL_DOMAINS: CustomDomain[] = [
  {
    id: 'dom-1',
    domain: 'go.dealsvault.co',
    status: 'active',
    ssl: true,
    targetHost: 'cname.linkshield.io',
    createdAt: '2026-09-28T10:00:00Z',
    defaultRedirect: 'https://dealsvault.co'
  },
  {
    id: 'dom-2',
    domain: 'secure.trklink.net',
    status: 'active',
    ssl: true,
    targetHost: 'cname.linkshield.io',
    createdAt: '2026-10-02T15:20:00Z',
    defaultRedirect: 'https://trklink.net'
  },
  {
    id: 'dom-3',
    domain: 'link.bonuscloud.io',
    status: 'pending',
    ssl: false,
    targetHost: 'cname.linkshield.io',
    createdAt: '2026-10-16T08:15:00Z',
    defaultRedirect: 'https://bonuscloud.io'
  }
];

export const INITIAL_CLICK_LOGS: ClickLog[] = [
  {
    id: 'clk-101',
    linkId: 'link-1',
    slug: 'finance-offer',
    timestamp: '2026-10-16T17:42:10Z',
    country: 'United States',
    countryCode: 'US',
    city: 'Los Angeles',
    device: 'mobile',
    browser: 'Safari Mobile',
    os: 'iOS 19.1',
    referrer: 'Facebook Ads',
    ip: '172.56.xxx.xxx'
  },
  {
    id: 'clk-102',
    linkId: 'link-3',
    slug: 'mobile-rpg-loot',
    timestamp: '2026-10-16T17:39:55Z',
    country: 'United States',
    countryCode: 'US',
    city: 'Austin',
    device: 'mobile',
    browser: 'Chrome Mobile',
    os: 'Android 16',
    referrer: 'TikTok App',
    ip: '104.28.xxx.xxx'
  },
  {
    id: 'clk-103',
    linkId: 'link-2',
    slug: 'vpn-flash70',
    timestamp: '2026-10-16T17:35:12Z',
    country: 'United Kingdom',
    countryCode: 'GB',
    city: 'London',
    device: 'desktop',
    browser: 'Chrome 130',
    os: 'Windows 11',
    referrer: 'Direct Traffic',
    ip: '82.165.xxx.xxx'
  },
  {
    id: 'clk-104',
    linkId: 'link-1',
    slug: 'finance-offer',
    timestamp: '2026-10-16T17:28:40Z',
    country: 'Canada',
    countryCode: 'CA',
    city: 'Toronto',
    device: 'desktop',
    browser: 'Firefox 132',
    os: 'macOS 15.3',
    referrer: 'Google Search',
    ip: '198.51.xxx.xxx'
  },
  {
    id: 'clk-105',
    linkId: 'link-4',
    slug: 'crypto-bonus',
    timestamp: '2026-10-16T17:15:02Z',
    country: 'Germany',
    countryCode: 'DE',
    city: 'Berlin',
    device: 'mobile',
    browser: 'Chrome Mobile',
    os: 'Android 16',
    referrer: 'Telegram Channel',
    ip: '141.20.xxx.xxx'
  },
  {
    id: 'clk-106',
    linkId: 'link-3',
    slug: 'mobile-rpg-loot',
    timestamp: '2026-10-16T17:02:44Z',
    country: 'Australia',
    countryCode: 'AU',
    city: 'Sydney',
    device: 'mobile',
    browser: 'Safari Mobile',
    os: 'iOS 19.0',
    referrer: 'Instagram Bio',
    ip: '139.130.xxx.xxx'
  },
  {
    id: 'clk-107',
    linkId: 'link-1',
    slug: 'finance-offer',
    timestamp: '2026-10-16T16:51:19Z',
    country: 'United States',
    countryCode: 'US',
    city: 'Chicago',
    device: 'desktop',
    browser: 'Edge 130',
    os: 'Windows 11',
    referrer: 'Native Ads Widget',
    ip: '67.182.xxx.xxx'
  },
  {
    id: 'clk-108',
    linkId: 'link-2',
    slug: 'vpn-flash70',
    timestamp: '2026-10-16T16:44:31Z',
    country: 'France',
    countryCode: 'FR',
    city: 'Paris',
    device: 'desktop',
    browser: 'Chrome 130',
    os: 'macOS 15.2',
    referrer: 'Twitter / X',
    ip: '195.154.xxx.xxx'
  },
  {
    id: 'clk-109',
    linkId: 'link-3',
    slug: 'mobile-rpg-loot',
    timestamp: '2026-10-16T16:30:05Z',
    country: 'United States',
    countryCode: 'US',
    city: 'Miami',
    device: 'tablet',
    browser: 'Safari iPad',
    os: 'iPadOS 19.1',
    referrer: 'YouTube Description',
    ip: '24.105.xxx.xxx'
  },
  {
    id: 'clk-110',
    linkId: 'link-1',
    slug: 'finance-offer',
    timestamp: '2026-10-16T16:12:49Z',
    country: 'Japan',
    countryCode: 'JP',
    city: 'Tokyo',
    device: 'mobile',
    browser: 'Mobile Safari',
    os: 'iOS 19.0',
    referrer: 'Line App',
    ip: '133.242.xxx.xxx'
  }
];

export const DEFAULT_SPLASH_CONFIG: SplashConfig = {
  seconds: 5,
  headline: 'Please wait, redirecting you securely...',
  subtext: 'Verifying destination security & establishing an encrypted safe connection.',
  theme: 'cyber-shield',
  showSkipButton: true,
  showSecurityBadges: true,
  adBannerText: 'Sponsored Safe Link Protection'
};
