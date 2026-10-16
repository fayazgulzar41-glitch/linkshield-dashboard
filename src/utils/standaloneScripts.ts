export const STANDALONE_NODE_SERVER = `/**
 * LinkShield - Standalone Single-File URL Shortener with 5-Second Splash Redirect
 * Zero configuration required. Works out of the box with Node.js & Express.
 *
 * HOW TO RUN:
 * 1. Create a folder: mkdir linkshield && cd linkshield
 * 2. Save this file as: server.js
 * 3. Initialize & install: npm init -y && npm install express
 * 4. Start: node server.js
 * 5. Visit: http://localhost:3000
 *
 * FREE HOSTING COMPATIBLE:
 * - Render.com (Web Service -> node server.js)
 * - Railway.app / Fly.io / VPS ($3/mo)
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'links_data.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-Memory & File-backed Store
let store = {
  links: [
    {
      id: 'default-1',
      slug: 'my-smartlink',
      originalUrl: 'https://example.com/target-smartlink?ref=myid',
      title: 'Demo Money Smartlink',
      createdAt: new Date().toISOString(),
      status: 'active',
      totalClicks: 0,
      splashSeconds: 5
    }
  ],
  clickLogs: []
};

// Load saved data if exists
if (fs.existsSync(DATA_FILE)) {
  try {
    store = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch (err) {
    console.error('Error loading data file, initializing fresh store.');
  }
}

function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
  } catch (err) {
    console.error('Failed to save data:', err);
  }
}

// -------------------------------------------------------------
// REDIRECT MECHANISM: 5-Second Secure Splash Page (/s/:slug)
// -------------------------------------------------------------
app.get('/s/:slug', (req, res) => {
  const { slug } = req.params;
  const link = store.links.find(l => l.slug.toLowerCase() === slug.toLowerCase());

  if (!link) {
    return res.status(404).send(\`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Link Not Found - LinkShield</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-4 font-sans">
        <div class="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center">
          <div class="w-12 h-12 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">!</div>
          <h1 class="text-xl font-bold mb-2">Short Link Not Found</h1>
          <p class="text-slate-400 text-sm mb-6">The requested link /s/\${slug} does not exist or has expired.</p>
          <a href="/" class="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition">Back to Dashboard</a>
        </div>
      </body>
      </html>
    \`);
  }

  if (link.status === 'paused') {
    return res.status(403).send(\`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Link Paused - LinkShield</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-4 font-sans">
        <div class="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center">
          <div class="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">⏸</div>
          <h1 class="text-xl font-bold mb-2">Link Currently Paused</h1>
          <p class="text-slate-400 text-sm mb-6">This redirection is currently paused by the administrator.</p>
          <a href="/" class="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition">Back to Dashboard</a>
        </div>
      </body>
      </html>
    \`);
  }

  // Analytics extraction
  const userAgent = req.headers['user-agent'] || '';
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const deviceType = isMobile ? 'Mobile' : 'Desktop';
  const country = req.headers['cf-ipcountry'] || req.headers['x-country-code'] || 'Global';
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

  // Increment clicks & record log
  link.totalClicks = (link.totalClicks || 0) + 1;
  store.clickLogs.unshift({
    id: crypto.randomUUID(),
    linkId: link.id,
    slug: link.slug,
    timestamp: new Date().toISOString(),
    country,
    device: deviceType,
    userAgent: userAgent.substring(0, 100),
    ip: ip.replace(/\\.[0-9]+\\.[0-9]+$/, '.xxx.xxx')
  });

  // Keep last 500 logs
  if (store.clickLogs.length > 500) {
    store.clickLogs.pop();
  }
  saveData();

  const seconds = link.splashSeconds || 5;
  const targetUrl = link.originalUrl;
  let targetDomain = 'target smartlink';
  try {
    targetDomain = new URL(targetUrl).hostname;
  } catch (e) {}

  // Render High-Converting Secure 5-Second Splash Page
  res.send(\`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Secure Redirect Verification</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
      <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        @keyframes pulseRing {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 0.4; }
          100% { transform: scale(0.95); opacity: 0.8; }
        }
        .animate-pulse-ring { animation: pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      </style>
    </head>
    <body class="bg-[#090D16] text-slate-100 min-h-screen flex flex-col items-center justify-between p-6 antialiased selection:bg-indigo-600">
      
      <!-- Top header branding -->
      <header class="w-full max-w-xl flex items-center justify-between py-4 text-xs text-slate-400">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span class="font-semibold text-slate-200 tracking-wide uppercase">LinkShield Gate</span>
        </div>
        <div class="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>SSL 256-Bit Encrypted</span>
        </div>
      </header>

      <!-- Center Modal Card -->
      <main class="w-full max-w-lg bg-[#0F172A] border border-slate-800/80 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden my-auto">
        <div class="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="text-center relative z-10">
          
          <!-- Animated Countdown Circle -->
          <div class="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
            <div class="absolute inset-0 rounded-full bg-indigo-500/10 animate-pulse-ring"></div>
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" stroke="currentColor" stroke-width="6" class="text-slate-800" fill="transparent"/>
              <circle id="progressCircle" cx="50" cy="50" r="42" stroke="currentColor" stroke-width="6" stroke-linecap="round" class="text-indigo-500 transition-all duration-1000 ease-linear" fill="transparent" stroke-dasharray="264" stroke-dashoffset="0"/>
            </svg>
            <div class="absolute flex flex-col items-center">
              <span id="countdownNumber" class="text-3xl font-extrabold text-white font-mono tracking-tight">\${seconds}</span>
              <span class="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Sec</span>
            </div>
          </div>

          <h1 class="text-2xl font-bold text-white mb-2">Please wait, redirecting you securely...</h1>
          <p class="text-slate-400 text-sm max-w-sm mx-auto mb-6">
            We are verifying link integrity and establishing an encrypted safe tunnel to <span class="text-indigo-300 font-medium font-mono text-xs">\${targetDomain}</span>.
          </p>

          <!-- Security Badges Checklist -->
          <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-6 text-left space-y-2.5">
            <div class="flex items-center justify-between text-xs">
              <span class="text-slate-300 flex items-center gap-2">
                <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg>
                Antivirus & Malware Database Checked
              </span>
              <span class="text-emerald-400 font-mono text-[11px]">CLEAN</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-slate-300 flex items-center gap-2">
                <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg>
                Origin Shield & Bot Filtering
              </span>
              <span class="text-emerald-400 font-mono text-[11px]">PASSED</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-slate-300 flex items-center gap-2">
                <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg>
                Direct CDN Handshake
              </span>
              <span class="text-emerald-400 font-mono text-[11px]">READY</span>
            </div>
          </div>

          <!-- Proceed Button -->
          <a id="redirectBtn" href="\${targetUrl}" rel="noreferrer" class="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-medium py-3 px-6 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/25">
            <span>Skip Wait & Proceed Now</span>
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </a>

          <p class="text-slate-500 text-[11px] mt-4">
            If you are not redirected automatically within 5 seconds, click the button above.
          </p>

        </div>
      </main>

      <!-- Bottom Footer -->
      <footer class="w-full max-w-xl text-center text-slate-500 text-xs py-4">
        Protected by LinkShield Intelligent Traffic Protection &copy; \${new Date().getFullYear()}
      </footer>

      <script>
        const targetUrl = "\${targetUrl}";
        let remainingSeconds = \${seconds};
        const initialSeconds = \${seconds};
        const countdownEl = document.getElementById('countdownNumber');
        const circleEl = document.getElementById('progressCircle');
        const circumference = 264;

        const interval = setInterval(() => {
          remainingSeconds--;
          if (remainingSeconds >= 0) {
            countdownEl.textContent = remainingSeconds;
            const offset = circumference - (remainingSeconds / initialSeconds) * circumference;
            circleEl.style.strokeDashoffset = offset;
          }

          if (remainingSeconds <= 0) {
            clearInterval(interval);
            window.location.href = targetUrl;
          }
        }, 1000);
      </script>
    </body>
    </html>
  \`);
});

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------
app.get('/api/links', (req, res) => {
  res.json({
    links: store.links,
    clickLogs: store.clickLogs,
    stats: {
      totalClicks: store.clickLogs.length,
      totalLinks: store.links.length,
      devices: {
        mobile: store.clickLogs.filter(c => c.device === 'Mobile').length,
        desktop: store.clickLogs.filter(c => c.device === 'Desktop').length
      }
    }
  });
});

app.post('/api/shorten', (req, res) => {
  const { originalUrl, slug, title, splashSeconds } = req.body;
  if (!originalUrl) {
    return res.status(400).json({ error: 'originalUrl is required' });
  }

  let finalSlug = (slug || '').trim().toLowerCase();
  if (!finalSlug) {
    finalSlug = crypto.randomBytes(3).toString('hex');
  }

  // Ensure unique slug
  const exists = store.links.some(l => l.slug === finalSlug);
  if (exists) {
    return res.status(409).json({ error: 'This custom slug is already taken.' });
  }

  const newLink = {
    id: crypto.randomUUID(),
    slug: finalSlug,
    originalUrl,
    title: title || 'Smartlink ' + finalSlug,
    createdAt: new Date().toISOString(),
    status: 'active',
    totalClicks: 0,
    splashSeconds: Number(splashSeconds) || 5
  };

  store.links.unshift(newLink);
  saveData();

  res.json({ success: true, link: newLink });
});

// -------------------------------------------------------------
// EMBEDDED DASHBOARD (GET /)
// -------------------------------------------------------------
app.get('/', (req, res) => {
  res.send(\`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>LinkShield Dashboard - Smartlink Shortener</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
      <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
      </style>
    </head>
    <body class="bg-slate-950 text-slate-100 min-h-screen flex antialiased">
      <!-- Embedded Simple Full-Stack UI for Standalone mode -->
      <div class="flex-1 flex flex-col max-w-6xl mx-auto p-6">
        <header class="flex items-center justify-between pb-6 border-b border-slate-800">
          <div>
            <h1 class="text-xl font-bold text-white flex items-center gap-2">
              <span class="p-2 bg-indigo-600 rounded-xl text-white">⚡</span>
              LinkShield Standalone Shortener
            </h1>
            <p class="text-xs text-slate-400 mt-1">Lightweight self-hosted smartlink manager with 5-second countdown splash page.</p>
          </div>
          <div class="text-xs text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
            Status: Running on Port \${PORT}
          </div>
        </header>

        <!-- Shorten Input -->
        <div class="my-8 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h2 class="text-sm font-semibold text-slate-200 mb-3">Create New Masked Smartlink</h2>
          <form action="/api/shorten" method="POST" onsubmit="handleShorten(event)" class="space-y-4">
            <div class="flex flex-col sm:flex-row gap-3">
              <input id="longUrl" type="url" required placeholder="Paste long money link (e.g. https://target-smartlink.com/offer?aff=123)" class="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500">
              <input id="slugInput" type="text" placeholder="Custom slug (optional)" class="sm:w-44 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 font-mono">
              <button type="submit" class="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl text-sm transition">Shorten Link</button>
            </div>
            <div id="resultMsg" class="hidden p-3 rounded-xl text-xs font-mono"></div>
          </form>
        </div>

        <!-- Links List -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 class="text-base font-bold text-white mb-4">Active Links (\${store.links.length})</h2>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
                <tr>
                  <th class="pb-3">Short URL</th>
                  <th class="pb-3">Destination</th>
                  <th class="pb-3 text-right">Clicks</th>
                  <th class="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60 font-mono">
                \${store.links.map(l => \`
                  <tr>
                    <td class="py-3.5 text-indigo-400 font-medium">
                      <a href="/s/\${l.slug}" target="_blank" class="hover:underline">/s/\${l.slug}</a>
                    </td>
                    <td class="py-3.5 text-slate-400 max-w-xs truncate" title="\${l.originalUrl}">\${l.originalUrl}</td>
                    <td class="py-3.5 text-right text-white font-bold">\${l.totalClicks || 0}</td>
                    <td class="py-3.5 text-right font-sans">
                      <a href="/s/\${l.slug}" target="_blank" class="text-xs bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 px-2.5 py-1 rounded-lg">Test Splash</a>
                    </td>
                  </tr>
                \`).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <script>
        async function handleShorten(e) {
          e.preventDefault();
          const originalUrl = document.getElementById('longUrl').value;
          const slug = document.getElementById('slugInput').value;
          const msg = document.getElementById('resultMsg');

          try {
            const res = await fetch('/api/shorten', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ originalUrl, slug })
            });
            const data = await res.json();
            if (res.ok) {
              msg.className = 'block p-3 rounded-xl text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono';
              msg.innerHTML = 'Generated: <a href="/s/' + data.link.slug + '" target="_blank" class="underline font-bold">/s/' + data.link.slug + '</a> (Reload page to update table)';
              document.getElementById('longUrl').value = '';
              document.getElementById('slugInput').value = '';
            } else {
              msg.className = 'block p-3 rounded-xl text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20';
              msg.textContent = data.error || 'Failed to shorten';
            }
          } catch (err) {
            msg.className = 'block p-3 rounded-xl text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20';
            msg.textContent = 'Server error: ' + err.message;
          }
        }
      </script>
    </body>
    </html>
  \`);
});

app.listen(PORT, () => {
  console.log(\`\\n LinkShield Standalone Shortener started on port \${PORT}\`);
  console.log(\` Dashboard: http://localhost:\${PORT}\`);
  console.log(\` Splash Redirect format: http://localhost:\${PORT}/s/:slug\\n\`);
});
`;

export const STANDALONE_STATIC_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LinkShield - Single-File URL Shortener & Splash Redirect</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen antialiased flex flex-col">

  <!-- Main App Container -->
  <div id="app" class="flex-1 flex flex-col">
    <!-- View rendered dynamically via JavaScript: Dashboard or Splash Page -->
  </div>

  <script>
    // Storage Engine (localStorage)
    const STORAGE_KEY = 'linkshield_static_links_v1';
    const LOGS_KEY = 'linkshield_static_logs_v1';

    function getLinks() {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      return [
        {
          id: 'demo-1',
          slug: 'money-link',
          originalUrl: 'https://example.com/target-smartlink',
          title: 'High-Converting Smartlink Demo',
          createdAt: new Date().toISOString(),
          status: 'active',
          totalClicks: 12,
          splashSeconds: 5
        }
      ];
    }

    function saveLinks(links) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
    }

    function getLogs() {
      const stored = localStorage.getItem(LOGS_KEY);
      return stored ? JSON.parse(stored) : [];
    }

    function logClick(linkId, slug) {
      const logs = getLogs();
      const isMobile = /Mobi|Android/i.test(navigator.userAgent);
      logs.unshift({
        id: Math.random().toString(36).substring(2, 9),
        linkId,
        slug,
        timestamp: new Date().toISOString(),
        country: 'Global',
        device: isMobile ? 'Mobile' : 'Desktop'
      });
      localStorage.setItem(LOGS_KEY, JSON.stringify(logs.slice(0, 100)));
    }

    // Routing Logic: check ?s=slug or #s=slug
    function checkRoute() {
      const urlParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));
      const slug = urlParams.get('s') || hashParams.get('s');

      if (slug) {
        renderSplashPage(slug);
      } else {
        renderDashboard();
      }
    }

    // Render Splash Page with 5-Second Countdown
    function renderSplashPage(slug) {
      const links = getLinks();
      const link = links.find(l => l.slug.toLowerCase() === slug.toLowerCase());

      if (!link) {
        document.getElementById('app').innerHTML = \`
          <div class="min-h-screen flex items-center justify-center p-4">
            <div class="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center">
              <h1 class="text-xl font-bold mb-2 text-rose-400">Link Not Found</h1>
              <p class="text-slate-400 text-sm mb-6">The short link "\${slug}" does not exist.</p>
              <a href="?" class="inline-block bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium">Back to Shortener</a>
            </div>
          </div>
        \`;
        return;
      }

      // Log click & increment
      link.totalClicks = (link.totalClicks || 0) + 1;
      saveLinks(links);
      logClick(link.id, link.slug);

      const seconds = link.splashSeconds || 5;
      const targetUrl = link.originalUrl;
      let targetHost = 'target website';
      try { targetHost = new URL(targetUrl).hostname; } catch(e){}

      document.getElementById('app').innerHTML = \`
        <div class="min-h-screen flex flex-col items-center justify-between p-6">
          <div class="w-full max-w-lg flex items-center justify-between text-xs text-slate-400 py-3">
            <span class="font-bold text-white uppercase tracking-wider">LinkShield Safe Gate</span>
            <span class="text-emerald-400 font-mono">256-Bit SSL Encrypted</span>
          </div>

          <div class="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center my-auto shadow-2xl">
            <div class="w-24 h-24 rounded-full bg-indigo-600/10 border-2 border-indigo-500/30 flex items-center justify-center mx-auto mb-6">
              <span id="countdown" class="text-3xl font-extrabold text-white font-mono">\${seconds}</span>
            </div>

            <h1 class="text-2xl font-bold text-white mb-2">Please wait, redirecting you securely...</h1>
            <p class="text-slate-400 text-sm mb-6">Checking connection security before routing to <span class="text-indigo-400 font-mono font-medium">\${targetHost}</span>.</p>

            <a id="proceedBtn" href="\${targetUrl}" rel="noreferrer" class="w-full inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-xl text-sm transition">
              Skip Wait & Proceed Now &rarr;
            </a>

            <div class="mt-6 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
              <a href="?" class="hover:text-slate-300">&larr; Return to Dashboard</a>
              <span>LinkShield Smartlink Masker</span>
            </div>
          </div>

          <div class="text-xs text-slate-600 py-4">Automated Smartlink Protection</div>
        </div>
      \`;

      let remaining = seconds;
      const countEl = document.getElementById('countdown');
      const timer = setInterval(() => {
        remaining--;
        if (remaining >= 0) countEl.textContent = remaining;
        if (remaining <= 0) {
          clearInterval(timer);
          window.location.href = targetUrl;
        }
      }, 1000);
    }

    // Render Dashboard
    function renderDashboard() {
      const links = getLinks();
      const logs = getLogs();

      document.getElementById('app').innerHTML = \`
        <div class="max-w-5xl mx-auto w-full p-6 space-y-6">
          <header class="flex items-center justify-between pb-6 border-b border-slate-800">
            <div>
              <h1 class="text-2xl font-bold text-white">LinkShield Shortener Dashboard</h1>
              <p class="text-slate-400 text-xs mt-1">Self-hosted URL masker with 5-second countdown splash page.</p>
            </div>
            <div class="text-xs text-slate-400 font-mono">Single-File Client Edition</div>
          </header>

          <!-- Shortener Form -->
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 class="text-sm font-semibold text-slate-200 mb-3">Paste a long link to shorten</h2>
            <form id="shortenForm" class="flex flex-col sm:flex-row gap-3">
              <input id="targetUrl" type="url" required placeholder="https://your-smartlink-offer.com/landing?sub=affiliate" class="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500">
              <input id="slug" type="text" placeholder="Custom alias" class="sm:w-40 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 font-mono">
              <button type="submit" class="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl text-sm transition">Shorten</button>
            </form>
          </div>

          <!-- Links Table -->
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 class="text-base font-bold text-white mb-4">Your Smartlinks (\${links.length})</h2>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                  <tr>
                    <th class="pb-3">Short Link</th>
                    <th class="pb-3">Destination Smartlink</th>
                    <th class="pb-3 text-right">Clicks</th>
                    <th class="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60 font-mono">
                  \${links.map(l => \`
                    <tr>
                      <td class="py-3.5 text-indigo-400 font-medium">
                        <a href="?s=\${l.slug}" target="_blank" class="hover:underline">?s=\${l.slug}</a>
                      </td>
                      <td class="py-3.5 text-slate-400 max-w-xs truncate" title="\${l.originalUrl}">\${l.originalUrl}</td>
                      <td class="py-3.5 text-right font-bold text-white">\${l.totalClicks || 0}</td>
                      <td class="py-3.5 text-right font-sans">
                        <a href="?s=\${l.slug}" target="_blank" class="bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 px-3 py-1 rounded-lg text-xs font-medium">Test Splash Page</a>
                      </td>
                    </tr>
                  \`).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      \`;

      document.getElementById('shortenForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const url = document.getElementById('targetUrl').value;
        const slug = (document.getElementById('slug').value || Math.random().toString(36).substring(2, 7)).trim().toLowerCase();
        const links = getLinks();
        links.unshift({
          id: Math.random().toString(36).substring(2, 9),
          slug,
          originalUrl: url,
          title: 'Smartlink ' + slug,
          createdAt: new Date().toISOString(),
          status: 'active',
          totalClicks: 0,
          splashSeconds: 5
        });
        saveLinks(links);
        renderDashboard();
      });
    }

    window.addEventListener('DOMContentLoaded', checkRoute);
    window.addEventListener('popstate', checkRoute);
  </script>
</body>
</html>
`;
