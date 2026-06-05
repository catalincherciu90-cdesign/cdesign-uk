function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function sanitizeHtml(html) {
  if (!html) return '';
  // Allow basic formatting tags only
  const allowed = /<\/?(b|i|em|strong|p|br|ul|ol|li|h2|h3|h4|blockquote|a)[^>]*>/gi;
  return String(html)
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/on\w+\s*=/gi, 'data-blocked=')
    .replace(/javascript:/gi, '');
}

function renderArticle(post) {
  const date = new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const plain = post.content.replace(/<[^>]*>/g, '');
  const desc = escHtml(post.excerpt || (plain.slice(0, 155) + (plain.length > 155 ? '…' : '')));
  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || plain.slice(0, 155),
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    author: { '@type': 'Organization', name: 'C Design', url: 'https://www.c-design.ro' },
    publisher: { '@type': 'Organization', name: 'C Design', url: 'https://www.c-design.ro' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.c-design.ro/blog/${post.slug}` },
  });
  const yr = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escHtml(post.title)} – C Design</title>
<meta name="description" content="${desc}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://www.c-design.ro/blog/${post.slug}">
<link rel="icon" type="image/png" href="/logo-c-design.png">
<meta property="og:type" content="article">
<meta property="og:url" content="https://www.c-design.ro/blog/${post.slug}">
<meta property="og:title" content="${escHtml(post.title)}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="https://www.c-design.ro/cover.jpg">
<meta property="og:locale" content="en_GB">
<meta property="og:site_name" content="C Design">
<meta property="article:published_time" content="${post.createdAt}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escHtml(post.title)}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="https://www.c-design.ro/cover.jpg">
<script type="application/ld+json">${schema}<\/script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&family=Share+Tech+Mono&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--teal:#00c8b4;--teal-dk:#00a898;--teal-lt:#33d4c3;--teal-dim:rgba(0,200,180,.08);--teal-border:rgba(0,200,180,.28);--bg:#080b0e;--bg2:#0d1117;--bg3:#111820;--text:#e8edf2;--soft:#9aa5b4;--muted:#6a7585;--border:rgba(255,255,255,.07);--border-soft:rgba(255,255,255,.11)}
html{scroll-behavior:smooth}body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);line-height:1.7;overflow-x:hidden}
a{color:inherit;text-decoration:none}
.container{max-width:760px;margin:0 auto;padding:0 24px}
.wide{max-width:1180px;margin:0 auto;padding:0 24px}
nav{position:sticky;top:0;z-index:100;background:rgba(8,11,14,.92);backdrop-filter:blur(20px);border-bottom:1px solid var(--border)}
.nav-inner{display:flex;align-items:center;justify-content:space-between;height:68px}
.logo{font-family:'Space Grotesk',sans-serif;font-weight:800;font-size:1.35rem;color:#fff;display:flex;align-items:center;gap:6px}
.logo-c{color:var(--teal);font-size:1.6rem;line-height:1;text-shadow:0 0 12px rgba(0,200,180,.6);animation:logo-pulse 3s ease-in-out infinite}
@keyframes logo-pulse{0%,100%{text-shadow:0 0 12px rgba(0,200,180,.6)}50%{text-shadow:0 0 24px rgba(0,200,180,1),0 0 48px rgba(0,200,180,.4)}}
.nav-links{display:flex;align-items:center;gap:28px;list-style:none}
.nav-links a{font-size:.875rem;color:var(--muted);transition:color .2s}.nav-links a:hover{color:var(--teal)}
.nav-phone{font-family:'Share Tech Mono',monospace;font-size:.875rem;color:var(--teal);border:1px solid var(--teal-border);padding:6px 14px;border-radius:6px;transition:background .2s}
.nav-phone:hover{background:var(--teal-dim)}
.btn-nav{background:var(--teal);color:#080b0e;font-weight:600;font-size:.875rem;padding:9px 20px;border-radius:8px;transition:background .2s,transform .15s}
.btn-nav:hover{background:var(--teal-lt);transform:translateY(-1px)}
.hamburger{display:none;flex-direction:column;gap:5px;cursor:pointer;background:none;border:none;padding:6px}
.hamburger span{display:block;width:22px;height:2px;background:var(--text);border-radius:2px}
.mobile-menu{display:none;flex-direction:column;gap:16px;background:var(--bg2);border-bottom:1px solid var(--border);padding:20px 24px}
.mobile-menu.open{display:flex}.mobile-menu a{font-size:1rem;color:var(--soft)}.mobile-menu a:hover{color:var(--teal)}
article{padding:72px 0 100px}
.art-back{display:inline-flex;align-items:center;gap:6px;color:var(--muted);font-size:.85rem;margin-bottom:40px;transition:color .2s}.art-back:hover{color:var(--teal)}
.art-tag{display:inline-block;background:var(--teal-dim);color:var(--teal);border:1px solid var(--teal-border);padding:4px 12px;border-radius:20px;font-size:.75rem;font-weight:600;letter-spacing:.05em;text-transform:uppercase;margin-bottom:18px}
.art-title{font-family:'Space Grotesk',sans-serif;font-size:clamp(1.8rem,5vw,2.8rem);font-weight:800;line-height:1.2;margin-bottom:20px;color:#fff}
.art-meta{color:var(--muted);font-size:.85rem;padding-bottom:28px;border-bottom:1px solid var(--border);margin-bottom:40px}
.art-content{color:#c8d4e0;font-size:1.05rem;line-height:1.85}
.art-content p{margin-bottom:1.4em}
.art-content h2{font-family:'Space Grotesk',sans-serif;font-size:1.45rem;font-weight:700;color:#fff;margin:2em 0 .8em}
.art-content h3{font-family:'Space Grotesk',sans-serif;font-size:1.15rem;font-weight:700;color:#fff;margin:1.6em 0 .6em}
.art-content ul,.art-content ol{padding-left:1.5em;margin-bottom:1.4em}
.art-content li{margin-bottom:.5em}
.art-content strong{color:#fff;font-weight:600}
.art-content a{color:var(--teal);text-decoration:underline;text-decoration-color:rgba(0,200,180,.3)}
.art-content a:hover{text-decoration-color:var(--teal)}
.art-content blockquote{border-left:3px solid var(--teal);padding:12px 20px;background:rgba(0,200,180,.06);border-radius:0 8px 8px 0;margin:1.5em 0;color:var(--soft);font-style:italic}
.art-content pre{background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:20px;overflow-x:auto;margin:1.5em 0}
.art-content code{background:rgba(0,200,180,.1);color:var(--teal);padding:2px 6px;border-radius:4px;font-size:.9em}
.art-content pre code{background:none;color:var(--soft);padding:0}
.cta-box{margin-top:64px;padding:32px;background:linear-gradient(135deg,rgba(0,200,180,.08),rgba(0,200,180,.04));border:1px solid rgba(0,200,180,.2);border-radius:14px;text-align:center}
.cta-box h3{font-family:'Space Grotesk',sans-serif;font-size:1.3rem;margin-bottom:10px;color:#fff}
.cta-box p{color:var(--soft);margin-bottom:20px;font-size:.95rem}
.btn{display:inline-block;background:var(--teal);color:#000;padding:12px 28px;border-radius:8px;font-weight:700;font-size:.9rem;transition:transform .15s,box-shadow .15s}
.btn:hover{transform:translateY(-1px);box-shadow:0 4px 20px rgba(0,200,180,.35)}
footer{border-top:1px solid var(--border);padding:32px 0;text-align:center;color:var(--muted);font-size:.83rem}
footer a{color:var(--muted);transition:color .2s}footer a:hover{color:var(--teal)}
@media(max-width:640px){article{padding:40px 0 60px}.art-title{font-size:1.7rem}nav .nav-links,.nav-phone,.btn-nav{display:none}.hamburger{display:flex}}
</style>
</head>
<body>
<nav>
  <div class="wide">
    <div class="nav-inner">
      <a href="/" class="logo"><img src="/logo-c-design.png" alt="C Design" style="height:42px;width:auto;display:block;"></a>
      <ul class="nav-links" role="list">
        <li><a href="/#servicii">Services</a></li>
        <li><a href="/#portofoliu">Portfolio</a></li>
        <li><a href="/#contact">Contact</a></li>
        <li><a href="/blog">Blog</a></li>
      </ul>
      <a href="tel:+447312799449" class="nav-phone">+44 7312 799449</a>
      <a href="/#contact" class="btn-nav">Book now →</a>
      <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
    </div>
  </div>
</nav>
<div class="mobile-menu" id="mobileMenu">
  <a href="/#servicii">Services</a><a href="/#portofoliu">Portfolio</a><a href="/#contact">Contact</a><a href="/blog">Blog</a>
  <a href="tel:+447312799449">+44 7312 799449</a><a href="/#contact" class="btn-nav">Book now →</a>
</div>
<main>
<article>
<div class="container">
  <a href="/blog" class="art-back">← Back to blog</a>
  <span class="art-tag">Blog</span>
  <h1 class="art-title">${escHtml(post.title)}</h1>
  <div class="art-meta">${date}</div>
  <div class="art-content">${sanitizeHtml(post.content)}</div>
  <div class="cta-box">
    <h3>Want a professional website for your business?</h3>
    <p>Book a free consultation — no obligation.</p>
    <a href="/#contact" class="btn">Book a free consultation →</a>
  </div>
</div>
</article>
</main>
<footer>
  <p>© ${yr} C Design · <a href="tel:+447312799449">+44 7312 799449</a> · <a href="mailto:office@c-design.ro">office@c-design.ro</a> · <a href="/blog">Blog</a></p>
</footer>
<script>
const ham=document.getElementById('hamburger'),mob=document.getElementById('mobileMenu');
ham.addEventListener('click',()=>{const o=mob.classList.toggle('open');ham.setAttribute('aria-expanded',o)});
<\/script>
</body>
</html>`;
}

async function sendDeadlineNotification(entry, env) {
  const termen = entry.termen || 'N/A';
  const html = `
<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08);">
      <tr><td style="background:#080b0e;padding:28px 32px;text-align:center;">
        <div style="font-family:'Segoe UI',Arial,sans-serif;font-size:1.4rem;font-weight:800;color:#fff;">
          <span style="color:#00c8b4;">C</span> Design
        </div>
        <div style="color:#9aa5b4;font-size:.85rem;margin-top:4px;">Reminder deadline CRM</div>
      </td></tr>
      <tr><td style="padding:32px;">
        <div style="background:#fff8e1;border-left:4px solid #f59e0b;border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:28px;">
          <div style="font-size:.8rem;color:#6a7585;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;">⏰ Deadline in 3 days</div>
          <div style="font-size:1.1rem;font-weight:700;color:#080b0e;">${escHtml(entry.client || 'N/A')}</div>
        </div>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
          <tr>
            <td style="padding:8px 0;color:#6a7585;font-size:.85rem;width:120px;">Project</td>
            <td style="padding:8px 0;font-weight:600;color:#080b0e;">${escHtml(entry.proiect || 'N/A')}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6a7585;font-size:.85rem;">Deadline</td>
            <td style="padding:8px 0;font-weight:600;color:#f59e0b;">${escHtml(termen)}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6a7585;font-size:.85rem;">Value</td>
            <td style="padding:8px 0;font-weight:600;color:#080b0e;">${escHtml(String(entry.valoare || 'N/A'))}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6a7585;font-size:.85rem;">Status</td>
            <td style="padding:8px 0;font-weight:600;color:#080b0e;">${escHtml(entry.status || 'N/A')}</td>
          </tr>
          ${entry.note ? `<tr><td style="padding:8px 0;color:#6a7585;font-size:.85rem;vertical-align:top;">Note</td><td style="padding:8px 0;color:#080b0e;">${escHtml(entry.note)}</td></tr>` : ''}
        </table>
        <div style="text-align:center;">
          <a href="https://www.c-design.ro/programari.html" style="display:inline-block;background:#00c8b4;color:#000;padding:14px 32px;border-radius:8px;font-weight:700;font-size:.95rem;text-decoration:none;">
            Open CRM →
          </a>
        </div>
      </td></tr>
      <tr><td style="background:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #e5e7eb;">
        <p style="color:#9aa5b4;font-size:.8rem;margin:0;">C Design · <a href="https://www.c-design.ro" style="color:#00c8b4;text-decoration:none;">www.c-design.ro</a></p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${env.RESEND_API_KEY || RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'C Design <office@c-design.ro>',
      to: [env.NOTIFY_EMAIL || NOTIFY_EMAIL],
      subject: `⏰ Deadline in 3 days: ${entry.client || 'Client'} – ${entry.proiect || 'Project'}`,
      html,
    }),
  });
}

async function sendGibilanMorningEmail(env) {
  try {
    const raw = await env.PROGRAMARI.get('__gibilan__');
    const data = raw ? JSON.parse(raw) : { meetings: [], todos: [], deadlines: [] };

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const in3Days = new Date(today);
    in3Days.setDate(today.getDate() + 3);
    const in3Str = in3Days.toISOString().split('T')[0];

    const meetingsAzi = (data.meetings || []).filter(m => m.date === todayStr);
    const deadlinesUrgente = (data.deadlines || []).filter(d => d.date >= todayStr && d.date <= in3Str);
    const todosActive = (data.todos || []).filter(t => !t.done);

    const ziuaRo = today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const ziuaCapital = ziuaRo.charAt(0).toUpperCase() + ziuaRo.slice(1);

    const nimicDeRaportat = !meetingsAzi.length && !deadlinesUrgente.length && !todosActive.length;

    let meetingsHtml = '';
    if (meetingsAzi.length) {
      meetingsHtml = meetingsAzi.map(m => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;">
            <span style="font-family:'Segoe UI',monospace;font-size:.85rem;color:#00a898;font-weight:700;margin-right:8px;">${m.time || '--:--'}</span>
            <span style="color:#1a1a1a;font-weight:600;">${escHtml(m.title)}</span>
            ${m.notes ? `<div style="font-size:.78rem;color:#888;margin-top:3px;">${escHtml(m.notes)}</div>` : ''}
          </td>
        </tr>`).join('');
    } else {
      meetingsHtml = '<tr><td style="padding:8px 12px;color:#aaa;font-style:italic;font-size:.88rem;">No meetings today — enjoy the free day!</td></tr>';
    }

    let deadlinesHtml = '';
    if (deadlinesUrgente.length) {
      deadlinesHtml = deadlinesUrgente.map(d => {
        const isAzi = d.date === todayStr;
        return `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;${isAzi ? 'border-left:3px solid #ff5f57;' : ''}">
            <span style="font-size:.78rem;color:${isAzi ? '#ff5f57' : '#f59e0b'};font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-right:8px;">${isAzi ? 'TODAY' : d.date}</span>
            <span style="color:#1a1a1a;font-weight:600;">${escHtml(d.title)}</span>
            ${d.project ? `<span style="font-size:.8rem;color:#888;margin-left:6px;">· ${escHtml(d.project)}</span>` : ''}
          </td>
        </tr>`;
      }).join('');
    } else {
      deadlinesHtml = '<tr><td style="padding:8px 12px;color:#aaa;font-style:italic;font-size:.88rem;">No urgent deadlines — breathe easy!</td></tr>';
    }

    let todosHtml = '';
    if (todosActive.length) {
      todosHtml = todosActive.map(t => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;${t.priority === 'high' ? 'border-left:3px solid #febc2e;background:#fffbf0;' : ''}">
            <span style="display:inline-block;width:14px;height:14px;border:2px solid #ccc;border-radius:3px;margin-right:8px;vertical-align:middle;"></span>
            <span style="color:#1a1a1a;">${escHtml(t.title)}</span>
            ${t.priority === 'high' ? '<span style="font-size:.7rem;color:#f59e0b;font-weight:700;margin-left:6px;text-transform:uppercase;">URGENT</span>' : ''}
          </td>
        </tr>`).join('');
    } else {
      todosHtml = '<tr><td style="padding:8px 12px;color:#aaa;font-style:italic;font-size:.88rem;">All done! You\'re a champion.</td></tr>';
    }

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:32px 0;">
  <tr><td align="center">
    <table width="580" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.08);">
      <!-- HEADER -->
      <tr><td style="background:#060f0f;padding:28px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="vertical-align:middle;">
              <div style="font-family:'Segoe UI',Arial,sans-serif;font-size:1.3rem;font-weight:800;color:#fff;">
                <span style="color:#00c8b4;">C</span> Design
              </div>
              <div style="color:#6a9494;font-size:.78rem;margin-top:2px;font-family:monospace;">// gibilan.morning_brief</div>
            </td>
            <td style="text-align:right;vertical-align:middle;">
              <div style="font-size:2rem;">🤖</div>
            </td>
          </tr>
        </table>
      </td></tr>
      <!-- GREETING -->
      <tr><td style="padding:28px 32px 0;border-bottom:1px solid #f0f0f0;">
        <div style="font-size:1.15rem;font-weight:700;color:#060f0f;margin-bottom:6px;">
          Good morning! ☀️
        </div>
        <div style="font-size:.92rem;color:#555;margin-bottom:20px;line-height:1.6;">
          ${nimicDeRaportat
            ? 'A free day — nothing urgent! Enjoy the quiet while it lasts. 😄'
            : `Here is your agenda for <strong>${ziuaCapital}</strong>. Let\'s make it a productive day!`}
        </div>
        ${!nimicDeRaportat ? `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;background:#f0fffe;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="padding:6px 12px;background:#00c8b4;color:#060f0f;font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em;width:32px;">📊</td>
            <td style="padding:6px 12px;background:#e8faf9;font-size:.82rem;color:#1a4a44;">
              <strong>${meetingsAzi.length}</strong> meetings today &nbsp;·&nbsp;
              <strong>${deadlinesUrgente.length}</strong> urgent deadlines &nbsp;·&nbsp;
              <strong>${todosActive.length}</strong> active tasks
            </td>
          </tr>
        </table>` : ''}
      </td></tr>
      <!-- MEETINGS -->
      <tr><td style="padding:24px 32px 0;">
        <div style="font-size:.78rem;font-weight:800;color:#00a898;text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px;">📅 Today's meetings</div>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border-radius:8px;overflow:hidden;border:1px solid #eee;">
          ${meetingsHtml}
        </table>
      </td></tr>
      <!-- DEADLINES -->
      <tr><td style="padding:20px 32px 0;">
        <div style="font-size:.78rem;font-weight:800;color:#f59e0b;text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px;">⚠️ Deadlines (today + 3 days)</div>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border-radius:8px;overflow:hidden;border:1px solid #eee;">
          ${deadlinesHtml}
        </table>
      </td></tr>
      <!-- TODOS -->
      <tr><td style="padding:20px 32px 24px;">
        <div style="font-size:.78rem;font-weight:800;color:#6a7585;text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px;">✅ Active to-dos</div>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border-radius:8px;overflow:hidden;border:1px solid #eee;">
          ${todosHtml}
        </table>
      </td></tr>
      <!-- CTA -->
      <tr><td style="padding:0 32px 28px;text-align:center;">
        <a href="https://www.c-design.ro/programari.html" style="display:inline-block;background:#00c8b4;color:#060f0f;padding:12px 28px;border-radius:8px;font-weight:700;font-size:.9rem;text-decoration:none;">
          Open Gibilan →
        </a>
      </td></tr>
      <!-- FOOTER -->
      <tr><td style="background:#f9fafb;padding:16px 32px;text-align:center;border-top:1px solid #eee;">
        <p style="color:#9aa5b4;font-size:.75rem;margin:0;">Gibilan · C Design · <a href="https://www.c-design.ro" style="color:#00a898;text-decoration:none;">c-design.ro</a></p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${env.RESEND_API_KEY || RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Gibilan <notificari@c-design.ro>',
        to: [env.NOTIFY_EMAIL || NOTIFY_EMAIL],
        subject: `🤖 Gibilan — Your agenda for ${ziuaCapital}`,
        html,
      }),
    });
  } catch (e) {
    console.error('sendGibilanMorningEmail error:', e);
  }
}

async function checkCrmDeadlines(env) {
  const raw = await env.PROGRAMARI.get('__crm__');
  const entries = raw ? JSON.parse(raw) : [];
  const today = new Date();
  const target = new Date(today);
  target.setDate(today.getDate() + 3);
  const targetDate = target.toISOString().split('T')[0];
  const due = entries.filter(e =>
    e.termen === targetDate &&
    e.status !== 'finalizat' &&
    e.status !== 'anulat'
  );
  for (const e of due) {
    await sendDeadlineNotification(e, env);
  }
}

const ALLOWED_ORIGINS = ['https://www.c-design.ro', 'https://c-design.ro'];

function getCors(request) {
  const origin = request ? request.headers.get('Origin') : null;
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

const SEC_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'X-XSS-Protection': '1; mode=block',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.resend.com https://www.google-analytics.com;",
};

function json(data, status = 200, req) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...getCors(req), 'Content-Type': 'application/json' },
  });
}

async function checkRateLimit(env, key, maxAttempts, windowSeconds) {
  try {
    const raw = await env.PROGRAMARI.get('__rl_' + key);
    const now = Date.now();
    const data = raw ? JSON.parse(raw) : { count: 0, start: now };
    if (now - data.start > windowSeconds * 1000) { data.count = 0; data.start = now; }
    data.count++;
    await env.PROGRAMARI.put('__rl_' + key, JSON.stringify(data), { expirationTtl: windowSeconds });
    return data.count <= maxAttempts;
  } catch { return true; }
}

const ADMIN_TOKEN = '';  // set via: wrangler secret put ADMIN_TOKEN
const ADMIN_USER  = '';  // set via: wrangler secret put ADMIN_USER
const RESEND_API_KEY = '';  // set via: wrangler secret put RESEND_API_KEY
const NOTIFY_EMAIL  = 'office@c-design.ro';

async function sendBookingNotification(booking, env) {
  const html = `
<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08);">
      <tr><td style="background:#080b0e;padding:28px 32px;text-align:center;">
        <div style="font-family:'Segoe UI',Arial,sans-serif;font-size:1.4rem;font-weight:800;color:#fff;">
          <span style="color:#00c8b4;">C</span> Design
        </div>
        <div style="color:#9aa5b4;font-size:.85rem;margin-top:4px;">New booking</div>
      </td></tr>
      <tr><td style="padding:32px;">
        <div style="background:#f0fffe;border-left:4px solid #00c8b4;border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:28px;">
          <div style="font-size:.8rem;color:#6a7585;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;">New booking received</div>
          <div style="font-size:1.1rem;font-weight:700;color:#080b0e;">${booking.name}</div>
        </div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="50%" style="padding:0 8px 16px 0;vertical-align:top;">
              <div style="font-size:.75rem;color:#6a7585;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;">Phone</div>
              <div style="font-size:.95rem;color:#080b0e;font-weight:600;">${booking.phone}</div>
            </td>
            <td width="50%" style="padding:0 0 16px 8px;vertical-align:top;">
              <div style="font-size:.75rem;color:#6a7585;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;">Email</div>
              <div style="font-size:.95rem;color:#080b0e;font-weight:600;">${booking.email}</div>
            </td>
          </tr>
          <tr>
            <td width="50%" style="padding:0 8px 16px 0;vertical-align:top;">
              <div style="font-size:.75rem;color:#6a7585;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;">Date</div>
              <div style="font-size:.95rem;color:#080b0e;font-weight:600;">${booking.date}</div>
            </td>
            <td width="50%" style="padding:0 0 16px 8px;vertical-align:top;">
              <div style="font-size:.75rem;color:#6a7585;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;">Time</div>
              <div style="font-size:.95rem;color:#080b0e;font-weight:600;">${booking.time}</div>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding:0 0 16px 0;">
              <div style="font-size:.75rem;color:#6a7585;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;">Service</div>
              <div style="font-size:.95rem;color:#080b0e;font-weight:600;">${booking.service}</div>
            </td>
          </tr>
          ${booking.message ? `<tr><td colspan="2" style="padding:0 0 16px 0;">
            <div style="font-size:.75rem;color:#6a7585;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;">Message</div>
            <div style="font-size:.95rem;color:#080b0e;line-height:1.5;">${booking.message}</div>
          </td></tr>` : ''}
        </table>
        <div style="text-align:center;margin-top:24px;">
          <a href="https://www.c-design.ro/programari.html" style="display:inline-block;background:#00c8b4;color:#080b0e;font-weight:700;font-size:.9rem;padding:12px 28px;border-radius:8px;text-decoration:none;">
            View in admin panel →
          </a>
        </div>
      </td></tr>
      <tr><td style="background:#f9f9f9;padding:16px 32px;text-align:center;border-top:1px solid #eee;">
        <div style="font-size:.78rem;color:#9aa5b4;">c-design.ro · +44 7312 799449 · office@c-design.ro</div>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${env.RESEND_API_KEY || RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'C Design <notificari@c-design.ro>',
        to: [env.NOTIFY_EMAIL || NOTIFY_EMAIL],
        subject: `📅 New booking — ${booking.name} · ${booking.date} ${booking.time}`,
        html,
      }),
    });
  } catch {}

  // Confirmare catre client
  const confirmHtml = `
<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08);">
      <tr><td style="background:#080b0e;padding:28px 32px;text-align:center;">
        <div style="font-family:'Segoe UI',Arial,sans-serif;font-size:1.4rem;font-weight:800;color:#fff;">
          <span style="color:#00c8b4;">C</span> Design
        </div>
        <div style="color:#9aa5b4;font-size:.85rem;margin-top:4px;">Booking confirmation</div>
      </td></tr>
      <tr><td style="padding:32px;">
        <p style="font-size:1rem;color:#080b0e;margin:0 0 20px;">Hello <strong>${booking.name}</strong>,</p>
        <p style="font-size:.95rem;color:#444;line-height:1.6;margin:0 0 28px;">Your booking has been received successfully. We will contact you within <strong>2 hours</strong> to confirm.</p>

        <div style="background:#f0fffe;border:1px solid #d0f5f2;border-radius:10px;padding:20px 24px;margin-bottom:28px;">
          <div style="font-size:.75rem;color:#6a7585;text-transform:uppercase;letter-spacing:.06em;margin-bottom:16px;">Booking details</div>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="50%" style="padding:0 8px 12px 0;">
                <div style="font-size:.75rem;color:#6a7585;margin-bottom:3px;">Date</div>
                <div style="font-size:.95rem;color:#080b0e;font-weight:700;">${booking.date}</div>
              </td>
              <td width="50%" style="padding:0 0 12px 8px;">
                <div style="font-size:.75rem;color:#6a7585;margin-bottom:3px;">Time</div>
                <div style="font-size:.95rem;color:#080b0e;font-weight:700;">${booking.time}</div>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <div style="font-size:.75rem;color:#6a7585;margin-bottom:3px;">Service</div>
                <div style="font-size:.95rem;color:#080b0e;font-weight:700;">${booking.service}</div>
              </td>
            </tr>
          </table>
        </div>

        <p style="font-size:.9rem;color:#666;line-height:1.6;margin:0 0 24px;">If you have any questions or would like to change your booking, feel free to contact us at any time:</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
          <tr>
            <td style="padding:0 8px 0 0;">
              <a href="tel:+447312799449" style="display:block;text-align:center;background:#080b0e;color:#00c8b4;font-weight:600;font-size:.9rem;padding:12px;border-radius:8px;text-decoration:none;">📞 +44 7312 799449</a>
            </td>
            <td style="padding:0 0 0 8px;">
              <a href="https://wa.me/447312799449" style="display:block;text-align:center;background:#25d366;color:#fff;font-weight:600;font-size:.9rem;padding:12px;border-radius:8px;text-decoration:none;">💬 WhatsApp</a>
            </td>
          </tr>
        </table>
      </td></tr>
      <tr><td style="background:#f9f9f9;padding:16px 32px;text-align:center;border-top:1px solid #eee;">
        <div style="font-size:.78rem;color:#9aa5b4;">© ${new Date().getFullYear()} C Design · <a href="https://www.c-design.ro" style="color:#00c8b4;text-decoration:none;">c-design.ro</a></div>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${env.RESEND_API_KEY || RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'C Design <notificari@c-design.ro>',
        to: [booking.email],
        subject: `✅ Booking confirmed — ${booking.date} at ${booking.time}`,
        html: confirmHtml,
      }),
    });
  } catch {}
}

const DEFAULT_PROJECTS = [
  { id: 'p1', emoji: '🚗', tag: 'Auto', title: 'Vehicle Recovery Teleorman', description: 'Presentation website with coverage areas: Dâmbovița, Ilfov, Bucharest, Argeș, Giurgiu.', problema: 'The client was invisible online — all customers came exclusively through word of mouth.', solutie: 'Fast presentation website with separate pages per county, optimised for local SEO.', rezultat: 'First online order within 3 days of launch. Organic traffic +180% in 2 months.', order: 0 },
  { id: 'p2', emoji: '🏭', tag: 'Authorised Dealer', title: 'Authorised Lindab Dealer', description: 'Professional presentation with product catalogue and integrated contact details.', problema: 'Old website, not optimised for mobile — 70% of visitors left within the first 5 seconds.', solutie: 'Full redesign with digital catalogue and integrated quote-request form.', rezultat: 'Bounce rate reduced by 55%. Quote requests tripled compared to before.', order: 1 },
  { id: 'p3', emoji: '🌸', tag: 'Florist', title: 'Florist Website', description: 'Modern website with products and online ordering capability, optimised for mobile.', problema: 'No online presence — customers did not know whether the shop was open or what offers were available.', solutie: 'Website with product gallery, updatable opening hours, and a WhatsApp order button.', rezultat: 'Online orders went from zero to 15–20 per week in the first month.', order: 2 },
  { id: 'p4', emoji: '🏗️', tag: 'Construction', title: 'Architecture & Construction', description: 'Elegant visual portfolio with completed projects and client testimonials.', problema: 'The company did great work but could not demonstrate it online — no visible portfolio.', solutie: 'Portfolio website with project gallery, testimonials, and a detailed services page.', rezultat: 'Won 2 new contracts directly from the website in the first month. ROI: 10x.', order: 3 },
  { id: 'p5', emoji: '💼', tag: 'Start-Up', title: 'The Small Entrepreneur', description: 'Complete start-up package: website + visual identity + active online presence.', problema: 'New business, zero online presence — limited budget, needed everything at once.', solutie: 'Startup Package: website + logo + domain + hosting + 2 social media accounts, delivered in 14 days.', rezultat: 'Fully online in 2 weeks. First client acquired via Google after 3 weeks.', order: 4 },
  { id: 'p6', emoji: '🔧', tag: 'Services', title: 'Technical Services Company', description: 'Presentation website with a quote-request form and project gallery.', problema: 'They were losing potential clients because they had no easy way to be contacted online.', solutie: 'Website with quick quote-request form, project gallery, and integrated Google reviews.', rezultat: 'Online quote requests: from 0 to 8–12 per month. Time saved on phone calls: 4 hrs/week.', order: 5 },
];

function isAdmin(url, env) {
  return url.searchParams.get('token') === (env.ADMIN_TOKEN || ADMIN_TOKEN);
}

function buildMaintenancePage(m) {
  const title   = m.title   || 'Site under construction';
  const message = m.message || 'We\'ll be back soon with something new!';
  const date    = m.date    ? '<p class="date">🗓 ' + m.date + '</p>' : '';
  return `<!DOCTYPE html><html lang="en-GB"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'DM Sans',sans-serif;background:#060f0f;color:#e8edf2;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px 24px;position:relative;overflow:hidden}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 800px 600px at 70% 40%,rgba(0,168,168,.07),transparent);pointer-events:none}
.wrap{position:relative;z-index:1;max-width:560px}
.gear{font-size:4rem;margin-bottom:24px;display:block;animation:spin 8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
h1{font-family:'Space Grotesk',sans-serif;font-size:clamp(2rem,5vw,3rem);font-weight:800;color:#fff;margin-bottom:16px;line-height:1.1}
h1 span{color:#00a8a8}
p{color:#8bbaba;font-size:1.05rem;line-height:1.75;margin-bottom:12px}
.date{font-size:.9rem;color:rgba(139,186,186,.6);margin-top:8px}
.divider{width:48px;height:3px;background:#00a8a8;margin:28px auto}
.logo{font-family:'Space Grotesk',sans-serif;font-size:1rem;font-weight:700;color:rgba(255,255,255,.2);letter-spacing:4px;margin-top:48px;text-transform:uppercase}
.dots{display:flex;gap:8px;justify-content:center;margin-top:32px}
.dot{width:8px;height:8px;border-radius:50%;background:#00a8a8;animation:pulse 1.4s ease-in-out infinite}
.dot:nth-child(2){animation-delay:.2s}.dot:nth-child(3){animation-delay:.4s}
@keyframes pulse{0%,100%{opacity:.2;transform:scale(.8)}50%{opacity:1;transform:scale(1.2)}}
</style></head><body>
<div class="wrap">
  <span class="gear">⚙️</span>
  <h1>C <span>Design</span></h1>
  <div class="divider"></div>
  <p><strong style="color:#fff">${title}</strong></p>
  <p>${message}</p>
  ${date}
  <div class="dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
  <div class="logo">c-design.ro</div>
</div>
</body></html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'OPTIONS') return new Response(null, { headers: getCors(request) });

    // Redirect non-www → www (301 permanent) pentru canonical corect
    if (url.hostname === 'c-design.ro') {
      url.hostname = 'www.c-design.ro';
      return Response.redirect(url.toString(), 301);
    }

    // ── MAINTENANCE MODE ──────────────────────────────────────
    // Skip maintenance check for: admin API, admin page, static assets, token bypass
    const isAdminReq = path === '/programari' || path === '/programari.html' || path.startsWith('/api/');
    const hasToken = url.searchParams.get('token') === (env.ADMIN_TOKEN || ADMIN_TOKEN);
    if (!isAdminReq && !hasToken) {
      try {
        const mRaw = await env.PROGRAMARI.get('__maintenance__');
        const mData = mRaw ? JSON.parse(mRaw) : { enabled: false };
        if (mData.enabled) {
          return new Response(buildMaintenancePage(mData), {
            status: 503,
            headers: { ...SEC_HEADERS, 'Content-Type': 'text/html;charset=utf-8', 'Retry-After': '3600', 'Cache-Control': 'no-store' }
          });
        }
      } catch {}
    }

    // ── 301 REDIRECTS pentru URL-uri 404 semnalate în GSC ────────
    const REDIRECTS_301 = {
      '/campanie-florarii/tema2': '/',
      '/campanie-florarii/tema3': '/',
    };
    if (REDIRECTS_301[path]) {
      return Response.redirect('https://www.c-design.ro' + REDIRECTS_301[path], 301);
    }

    // ── BLOG PUBLIC PAGES ─────────────────────────────────────

    if (path === '/blog' || path === '/blog/') {
      const assetUrl = new URL(request.url);
      assetUrl.pathname = '/blog.html';
      return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
    }

    if (/^\/blog\/[^/]+$/.test(path) && request.method === 'GET') {
      const slug = path.slice(6);
      try {
        const raw = await env.PROGRAMARI.get('__blog__');
        const posts = raw ? JSON.parse(raw) : [];
        const post = posts.find(p => p.slug === slug && p.published);
        if (!post) return Response.redirect('https://www.c-design.ro/blog', 302);
        return new Response(renderArticle(post), {
          headers: { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'public,max-age=300' },
        });
      } catch { return Response.redirect('https://www.c-design.ro/blog', 302); }
    }

    // ── PACHET STARTUP ────────────────────────────────────────

    if (path === '/pachet-startup') {
      try {
        const assetUrl = new URL(request.url);
        assetUrl.pathname = '/pachet-startup.html';
        const [htmlResp, settingsRaw] = await Promise.all([
          env.ASSETS.fetch(new Request(assetUrl.toString(), request)),
          env.PROGRAMARI.get('__site_settings__')
        ]);
        if (!settingsRaw) return htmlResp;
        const s = JSON.parse(settingsRaw);
        let html = await htmlResp.text();
        function injectInner(h, id, val) {
          if (!val && val !== 0) return h;
          const esc = String(val).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
          return h.replace(new RegExp(`(id="${id}"[^>]*>)[\\s\\S]*?(<\\/span>|<\\/div>)`), `$1${esc}$2`);
        }
        if (s.startupPretMin !== undefined) html = injectInner(html, 'startup-pret-min', s.startupPretMin);
        if (s.startupPretMax !== undefined) html = injectInner(html, 'startup-pret-max', '– ' + s.startupPretMax);
        if (s.startupValoareSep !== undefined) html = injectInner(html, 'startup-valoare-sep', `\n      Separate value: ~${s.startupValoareSep}€\n    `);
        return new Response(html, { headers: { ...SEC_HEADERS, 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'no-cache, no-store, must-revalidate' } });
      } catch {
        const assetUrl = new URL(request.url);
        assetUrl.pathname = '/pachet-startup.html';
        return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
      }
    }

    // ── CITY LANDING PAGES ───────────────────────────────────

    if (path === '/web-design-leeds') {
      const assetUrl = new URL(request.url);
      assetUrl.pathname = '/web-design-leeds.html';
      return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
    }

    if (path === '/web-design-sheffield') {
      const assetUrl = new URL(request.url);
      assetUrl.pathname = '/web-design-sheffield.html';
      return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
    }

    if (path === '/web-design-nottingham') {
      const assetUrl = new URL(request.url);
      assetUrl.pathname = '/web-design-nottingham.html';
      return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
    }

    if (path === '/web-design-derby') {
      const assetUrl = new URL(request.url);
      assetUrl.pathname = '/web-design-derby.html';
      return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
    }

    if (path === '/web-design-blackburn') {
      const assetUrl = new URL(request.url);
      assetUrl.pathname = '/web-design-blackburn.html';
      return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
    }

    if (path === '/web-design-preston') {
      const assetUrl = new URL(request.url);
      assetUrl.pathname = '/web-design-preston.html';
      return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
    }

    if (path === '/web-design-auto') {
      const assetUrl = new URL(request.url);
      assetUrl.pathname = '/web-design-auto.html';
      return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
    }

    if (path === '/web-design-restaurante') {
      const assetUrl = new URL(request.url);
      assetUrl.pathname = '/web-design-restaurante.html';
      return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
    }

    if (path === '/web-design-afaceri-mici') {
      const assetUrl = new URL(request.url);
      assetUrl.pathname = '/web-design-afaceri-mici.html';
      return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
    }


    if (path === '/abonament-lunar') {
      const assetUrl = new URL(request.url);
      assetUrl.pathname = '/abonament-lunar.html';
      return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
    }

    // ── LEGAL ─────────────────────────────────────────────────

    if (path === '/politica-confidentialitate') {
      const assetUrl = new URL(request.url);
      assetUrl.pathname = '/politica-confidentialitate.html';
      return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
    }

    // ── AUTH ──────────────────────────────────────────────────

    if (path === '/api/login' && request.method === 'POST') {
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const allowed = await checkRateLimit(env, 'login_' + ip, 10, 900);
      if (!allowed) return json({ error: 'Too many attempts. Please try again in 15 minutes.' }, 429, request);
      try {
        const { username, password } = await request.json();
        const validUser  = env.ADMIN_USER  || ADMIN_USER;
        const validToken = env.ADMIN_TOKEN || ADMIN_TOKEN;
        if (username === validUser && password === validToken)
          return json({ success: true }, 200, request);
        return json({ error: 'Invalid credentials' }, 401, request);
      } catch { return json({ error: 'Server error' }, 500, request); }
    }

    // ── BOOKINGS ──────────────────────────────────────────────

    if (path === '/api/booking' && request.method === 'POST') {
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const allowed = await checkRateLimit(env, 'booking_' + ip, 5, 3600);
      if (!allowed) return json({ error: 'Too many requests. Please try again later.' }, 429, request);
      try {
        const { name, phone, email, service, date, time, message } = await request.json();
        if (!name || !phone || !email || !date || !time)
          return json({ error: 'Required fields missing' }, 400);
        const id = `booking_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const booking = { id, name, phone, email, service: service || 'Unspecified', date, time, message: message || '', status: 'nou', createdAt: new Date().toISOString() };
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[\d\s\+\-\(\)]{7,20}$/;
        if (!emailRegex.test(booking.email)) return json({error:'Invalid email'}, 400);
        if (!phoneRegex.test(booking.phone)) return json({error:'Invalid phone number'}, 400);
        if (!booking.name || booking.name.length < 2) return json({error:'Invalid name'}, 400);
        await env.PROGRAMARI.put(id, JSON.stringify(booking));
        const raw = await env.PROGRAMARI.get('__index__');
        const index = raw ? JSON.parse(raw) : [];
        index.unshift({ id, date, time, name });
        await env.PROGRAMARI.put('__index__', JSON.stringify(index));
        await sendBookingNotification(booking, env);
        return json({ success: true, id });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path === '/api/bookings' && request.method === 'GET') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const raw = await env.PROGRAMARI.get('__index__');
        const index = raw ? JSON.parse(raw) : [];
        const bookings = await Promise.all(index.map(async ({ id }) => { const r = await env.PROGRAMARI.get(id); return r ? JSON.parse(r) : null; }));
        return json(bookings.filter(Boolean));
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path.startsWith('/api/booking/') && request.method === 'PATCH') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      const id = path.replace('/api/booking/', '');
      const raw = await env.PROGRAMARI.get(id);
      if (!raw) return json({ error: 'Not found' }, 404);
      const { status } = await request.json();
      const booking = JSON.parse(raw);
      booking.status = status;
      await env.PROGRAMARI.put(id, JSON.stringify(booking));
      return json({ success: true });
    }

    // ── PROJECTS ──────────────────────────────────────────────

    if (path === '/api/projects' && request.method === 'GET') {
      try {
        const raw = await env.PROGRAMARI.get('__projects__');
        const projects = raw ? JSON.parse(raw) : DEFAULT_PROJECTS;
        return json(projects.sort((a, b) => a.order - b.order));
      } catch { return json(DEFAULT_PROJECTS); }
    }

    if (path === '/api/project' && request.method === 'POST') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const { emoji, tag, title, description } = await request.json();
        if (!title) return json({ error: 'Title is required' }, 400);
        const raw = await env.PROGRAMARI.get('__projects__');
        const projects = raw ? JSON.parse(raw) : [...DEFAULT_PROJECTS];
        const id = `p_${Date.now()}`;
        const maxOrder = projects.reduce((m, p) => Math.max(m, p.order), -1);
        projects.push({ id, emoji: emoji || '🌐', tag: tag || 'Web', title, description: description || '', order: maxOrder + 1 });
        await env.PROGRAMARI.put('__projects__', JSON.stringify(projects));
        return json({ success: true, id });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path.startsWith('/api/project/') && request.method === 'PUT') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const id = path.replace('/api/project/', '');
        const { emoji, tag, title, description, order } = await request.json();
        const raw = await env.PROGRAMARI.get('__projects__');
        const projects = raw ? JSON.parse(raw) : [...DEFAULT_PROJECTS];
        const idx = projects.findIndex(p => p.id === id);
        if (idx === -1) return json({ error: 'Not found' }, 404);
        projects[idx] = { ...projects[idx], emoji: emoji ?? projects[idx].emoji, tag: tag ?? projects[idx].tag, title: title ?? projects[idx].title, description: description ?? projects[idx].description, order: order ?? projects[idx].order };
        await env.PROGRAMARI.put('__projects__', JSON.stringify(projects));
        return json({ success: true });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path.startsWith('/api/project/') && request.method === 'DELETE') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const id = path.replace('/api/project/', '');
        const raw = await env.PROGRAMARI.get('__projects__');
        const projects = raw ? JSON.parse(raw) : [...DEFAULT_PROJECTS];
        const filtered = projects.filter(p => p.id !== id);
        await env.PROGRAMARI.put('__projects__', JSON.stringify(filtered));
        return json({ success: true });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    // ── CRM ───────────────────────────────────────────────────

    if (path === '/api/crm' && request.method === 'GET') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const raw = await env.PROGRAMARI.get('__crm__');
        const entries = raw ? JSON.parse(raw) : [];
        return json(entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path === '/api/crm' && request.method === 'POST') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const { client, proiect, valoare, termen, status, note } = await request.json();
        if (!client) return json({ error: 'Client is required' }, 400);
        const raw = await env.PROGRAMARI.get('__crm__');
        const entries = raw ? JSON.parse(raw) : [];
        const id = `crm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        entries.unshift({ id, client, proiect: proiect || '', valoare: valoare || '', termen: termen || '', status: status || 'oferta', note: note || '', createdAt: new Date().toISOString() });
        await env.PROGRAMARI.put('__crm__', JSON.stringify(entries));
        return json({ success: true, id });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path.startsWith('/api/crm/') && request.method === 'PUT') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const id = path.replace('/api/crm/', '');
        const body = await request.json();
        const raw = await env.PROGRAMARI.get('__crm__');
        const entries = raw ? JSON.parse(raw) : [];
        const idx = entries.findIndex(e => e.id === id);
        if (idx === -1) return json({ error: 'Not found' }, 404);
        entries[idx] = { ...entries[idx], ...body };
        await env.PROGRAMARI.put('__crm__', JSON.stringify(entries));
        return json({ success: true });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path.startsWith('/api/crm/') && request.method === 'DELETE') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const id = path.replace('/api/crm/', '');
        const raw = await env.PROGRAMARI.get('__crm__');
        const entries = raw ? JSON.parse(raw) : [];
        await env.PROGRAMARI.put('__crm__', JSON.stringify(entries.filter(e => e.id !== id)));
        return json({ success: true });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    // ── BLOG ──────────────────────────────────────────────────

    if (path === '/api/blog/generate' && request.method === 'POST') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401, request);
      try {
        const { subject } = await request.json();
        if (!subject) return json({ error: 'Subject is required' }, 400, request);
        if (!env.AI) return json({ error: 'AI binding unavailable — check wrangler.toml' }, 500, request);

        const prompt = `Ești un copywriter expert în web design și marketing digital pentru afaceri mici din România. Scrie un articol de blog complet pentru agenția "C Design" pe subiectul: "${subject}".

Returnează EXCLUSIV un obiect JSON valid, fără text înainte sau după, cu această structură:
{
  "title": "titlu articol max 70 caractere",
  "excerpt": "rezumat 2-3 propoziții pentru lista de articole",
  "content": "conținut HTML complet cu <h2>, <p>, <ul>, <li>, <strong>",
  "metaDescription": "meta description SEO max 160 caractere"
}

Cerințe articol:
- Limbă: română
- Lungime: 600-900 cuvinte
- Public țintă: antreprenori și proprietari de afaceri mici din România
- Ton: profesional dar accesibil, fără jargon tehnic
- Include sfaturi practice și exemple concrete`;

        const ai = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 2048,
        });

        const text = (ai.response || '').trim();
        const match = text.match(/\{[\s\S]*\}/);
        if (!match) return json({ error: 'The model did not return valid JSON. Please try again.' }, 500, request);

        // Sanitize control characters inside JSON string values
        let raw = match[0];
        let sanitized = '';
        let inStr = false, esc = false;
        for (let i = 0; i < raw.length; i++) {
          const c = raw[i];
          if (esc) { sanitized += c; esc = false; continue; }
          if (c === '\\') { sanitized += c; esc = true; continue; }
          if (c === '"') { inStr = !inStr; sanitized += c; continue; }
          if (inStr && c.charCodeAt(0) < 0x20) {
            if (c === '\n') sanitized += '\\n';
            else if (c === '\r') sanitized += '\\r';
            else if (c === '\t') sanitized += '\\t';
          } else { sanitized += c; }
        }

        const article = JSON.parse(sanitized);
        if (!article.title || !article.content) return json({ error: 'Article generated incompletely. Please try again.' }, 500, request);
        return json({ success: true, article }, 200, request);
      } catch (e) {
        return json({ error: 'Generation error: ' + (e.message || 'unknown') }, 500, request);
      }
    }

    if (path === '/api/blog/research-titles' && request.method === 'POST') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401, request);
      try {
        const { focus, audience, existing } = await request.json();
        if (!env.AI) return json({ error: 'AI binding unavailable — check wrangler.toml' }, 500, request);

        const existingList = Array.isArray(existing) && existing.length
          ? `\nEvită titluri similare cu cele deja publicate:\n${existing.slice(0, 10).map(t => `- ${t}`).join('\n')}`
          : '';

        const focusCtx = focus ? `Focalizare: ${focus}` : 'Servicii generale de web design pentru afaceri mici';
        const audienceCtx = audience ? `Public țintă: ${audience}` : 'Antreprenori și proprietari de afaceri mici din România';

        const prompt = `Ești un expert SEO și content strategist pentru piața din România. Analizezi ce articole de blog ar trebui să scrie agenția "C Design" (web design din Ilfov/București, servicii pentru afaceri mici) pentru a-și îmbunătăți poziționarea pe Google și a atrage clienți potențiali.

${focusCtx}
${audienceCtx}${existingList}

Generează exact 8 idei de titluri de blog SEO-optimizate. Returnează EXCLUSIV un array JSON valid, fără text înainte sau după:

[
  {
    "title": "Titlul articolului (max 65 caractere, include cuvinte cheie)",
    "keywords": ["cuvant cheie 1", "cuvant cheie 2", "cuvant cheie 3"],
    "intent": "informational|commercial|navigational",
    "hook": "De ce funcționează acest titlu SEO (1-2 propoziții)",
    "difficulty": "ușor|mediu|dificil",
    "angle": "Unghiul editorial: tutorial|lista|ghid|comparatie|studiu-de-caz|sfaturi"
  }
]

Cerințe titluri:
- Limbă română, naturală, fără traduceri rigide
- Mixează intenții: 4 informational (sfaturi, ghiduri), 2 commercial (comparații, prețuri), 2 orientate spre conversie
- Dificultate variată: 3 ușor, 3 mediu, 2 dificil
- Relevante pentru afaceri mici din România care caută servicii web design
- Include termeni de căutare reali pe care proprietarii de afaceri îi folosesc`;

        const ai = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 2048,
        });

        const rawAi = ai.response ?? ai.text ?? ai ?? '';
        const text = (typeof rawAi === 'string' ? rawAi : JSON.stringify(rawAi)).trim();
        const match = text.match(/\[[\s\S]*\]/);
        if (!match) return json({ error: 'The model did not return valid JSON. Please try again.' }, 500, request);

        let raw = match[0];
        let sanitized = '';
        let inStr = false, esc2 = false;
        for (let i = 0; i < raw.length; i++) {
          const c = raw[i];
          if (esc2) { sanitized += c; esc2 = false; continue; }
          if (c === '\\') { sanitized += c; esc2 = true; continue; }
          if (c === '"') { inStr = !inStr; sanitized += c; continue; }
          if (inStr && c.charCodeAt(0) < 0x20) {
            if (c === '\n') sanitized += '\\n';
            else if (c === '\r') sanitized += '\\r';
            else if (c === '\t') sanitized += '\\t';
          } else { sanitized += c; }
        }

        const titles = JSON.parse(sanitized);
        if (!Array.isArray(titles) || !titles.length) return json({ error: 'No results generated. Please try again.' }, 500, request);
        return json({ success: true, titles }, 200, request);
      } catch (e) {
        return json({ error: 'Research error: ' + (e.message || 'unknown') }, 500, request);
      }
    }

    if (path === '/api/blog' && request.method === 'GET') {
      try {
        const raw = await env.PROGRAMARI.get('__blog__');
        const posts = raw ? JSON.parse(raw) : [];
        const all = url.searchParams.get('all') === '1' && isAdmin(url, env);
        return json(posts.filter(p => all || p.published).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path === '/api/blog' && request.method === 'POST') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const { title, slug, content, excerpt, published } = await request.json();
        if (!title) return json({ error: 'Title is required' }, 400);
        const raw = await env.PROGRAMARI.get('__blog__');
        const posts = raw ? JSON.parse(raw) : [];
        const id = `blog_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const autoSlug = (slug || title).toLowerCase().replace(/ă/g,'a').replace(/â/g,'a').replace(/î/g,'i').replace(/ș/g,'s').replace(/ț/g,'t').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
        posts.unshift({ id, title, slug: autoSlug, content: content || '', excerpt: excerpt || '', published: !!published, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
        await env.PROGRAMARI.put('__blog__', JSON.stringify(posts));
        return json({ success: true, id });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path.startsWith('/api/blog/') && request.method === 'PUT') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const id = path.replace('/api/blog/', '');
        const body = await request.json();
        const raw = await env.PROGRAMARI.get('__blog__');
        const posts = raw ? JSON.parse(raw) : [];
        const idx = posts.findIndex(p => p.id === id);
        if (idx === -1) return json({ error: 'Not found' }, 404);
        posts[idx] = { ...posts[idx], ...body, updatedAt: new Date().toISOString() };
        await env.PROGRAMARI.put('__blog__', JSON.stringify(posts));
        return json({ success: true });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path.startsWith('/api/blog/') && request.method === 'DELETE') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const id = path.replace('/api/blog/', '');
        const raw = await env.PROGRAMARI.get('__blog__');
        const posts = raw ? JSON.parse(raw) : [];
        await env.PROGRAMARI.put('__blog__', JSON.stringify(posts.filter(p => p.id !== id)));
        return json({ success: true });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    // ── CHELTUIELI ───────────────────────────────────────────
    if (path === '/api/cheltuieli' && request.method === 'GET') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const raw = await env.PROGRAMARI.get('__cheltuieli__');
        return json(raw ? JSON.parse(raw) : []);
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path === '/api/cheltuieli' && request.method === 'POST') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const { descriere, categorie, suma, moneda, data, metodaPlatii, recurent, note } = await request.json();
        if (!descriere || !suma || !data) return json({ error: 'Required fields missing' }, 400);
        const raw = await env.PROGRAMARI.get('__cheltuieli__');
        const lista = raw ? JSON.parse(raw) : [];
        const id = `chelt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        lista.unshift({ id, descriere, categorie: categorie || 'altele', suma: parseFloat(suma), moneda: moneda || 'RON', data, metodaPlatii: metodaPlatii || 'card', recurent: !!recurent, note: note || '', createdAt: new Date().toISOString() });
        await env.PROGRAMARI.put('__cheltuieli__', JSON.stringify(lista));
        return json({ success: true, id });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path.startsWith('/api/cheltuieli/') && request.method === 'PUT') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const id = path.replace('/api/cheltuieli/', '');
        const updates = await request.json();
        const raw = await env.PROGRAMARI.get('__cheltuieli__');
        const lista = raw ? JSON.parse(raw) : [];
        const idx = lista.findIndex(c => c.id === id);
        if (idx === -1) return json({ error: 'Expense not found' }, 404);
        lista[idx] = { ...lista[idx], ...updates, suma: parseFloat(updates.suma || lista[idx].suma), updatedAt: new Date().toISOString() };
        await env.PROGRAMARI.put('__cheltuieli__', JSON.stringify(lista));
        return json({ success: true });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path.startsWith('/api/cheltuieli/') && request.method === 'DELETE') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const id = path.replace('/api/cheltuieli/', '');
        const raw = await env.PROGRAMARI.get('__cheltuieli__');
        const lista = raw ? JSON.parse(raw) : [];
        await env.PROGRAMARI.put('__cheltuieli__', JSON.stringify(lista.filter(c => c.id !== id)));
        return json({ success: true });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    // ── SETTINGS ─────────────────────────────────────────────

    const DEFAULT_SETTINGS = { workingDays:[1,2,3,4,5], startTime:'09:00', endTime:'18:00', slotInterval:60, blockedDates:[] };

    if (path === '/api/test-email' && request.method === 'POST') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401, request);
      const apiKey = env.RESEND_API_KEY || RESEND_API_KEY;
      if (!apiKey) return json({ error: 'RESEND_API_KEY is not configured in Cloudflare Secrets.' }, 400, request);
      const toEmail = env.NOTIFY_EMAIL || NOTIFY_EMAIL;
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'C Design <office@c-design.ro>',
            to: [toEmail],
            subject: '✅ Test notification C Design',
            html: `<div style="font-family:Arial,sans-serif;padding:32px;max-width:480px;">
              <h2 style="color:#00a8a8;">✅ Notifications are working!</h2>
              <p>This email was sent from the <strong>C Design</strong> admin panel to verify that the Resend integration is configured correctly.</p>
              <p style="color:#777;font-size:.85rem;">Sent at: ${new Date().toLocaleString('en-GB')}</p>
            </div>`
          })
        });
        const data = await res.json();
        if (!res.ok) return json({ error: data.message || data.name || 'Resend error', detail: data }, 500, request);
        return json({ success: true, id: data.id, to: toEmail }, 200, request);
      } catch (e) {
        return json({ error: 'Network error: ' + e.message }, 500, request);
      }
    }

    if (path === '/api/settings' && request.method === 'GET') {
      try {
        const raw = await env.PROGRAMARI.get('__settings__');
        return json(raw ? JSON.parse(raw) : DEFAULT_SETTINGS);
      } catch { return json(DEFAULT_SETTINGS); }
    }

    if (path === '/api/settings' && request.method === 'PUT') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const body = await request.json();
        await env.PROGRAMARI.put('__settings__', JSON.stringify(body));
        return json({ success: true });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    // ── SOCIAL MEDIA ──────────────────────────────────────────

    const DEFAULT_SOCIAL = [
      { platform: 'Facebook', url: '', enabled: false },
      { platform: 'Instagram', url: '', enabled: false },
      { platform: 'LinkedIn', url: '', enabled: false },
      { platform: 'TikTok', url: '', enabled: false },
      { platform: 'Google Business', url: '', enabled: false },
      { platform: 'WhatsApp', url: '', enabled: false },
    ];

    if (path === '/api/social' && request.method === 'GET') {
      try {
        const raw = await env.PROGRAMARI.get('__social__');
        return json(raw ? JSON.parse(raw) : DEFAULT_SOCIAL);
      } catch { return json(DEFAULT_SOCIAL); }
    }

    if (path === '/api/social' && request.method === 'PUT') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const body = await request.json();
        await env.PROGRAMARI.put('__social__', JSON.stringify(body));
        return json({ success: true });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    // ── GIBILAN ───────────────────────────────────────────────

    if (path === '/api/gibilan/agenda' && request.method === 'GET') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const raw = await env.PROGRAMARI.get('__gibilan__');
        const data = raw ? JSON.parse(raw) : { meetings: [], todos: [], deadlines: [] };
        const today = new Date().toISOString().split('T')[0];
        const meetings = (data.meetings || []).filter(m => m.date >= today);
        const todos = (data.todos || []).filter(t => !t.done);
        const deadlines = (data.deadlines || []).filter(d => d.date >= today);
        return json({ meetings, todos, deadlines });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path === '/api/gibilan/meeting' && request.method === 'POST') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const { title, date, time, notes, clientId } = await request.json();
        if (!title || !date) return json({ error: 'Title and date are required' }, 400);
        const raw = await env.PROGRAMARI.get('__gibilan__');
        const data = raw ? JSON.parse(raw) : { meetings: [], todos: [], deadlines: [] };
        const id = `m_${Date.now()}`;
        data.meetings = data.meetings || [];
        data.meetings.push({ id, title, date, time: time || '', notes: notes || '', clientId: clientId || '' });
        await env.PROGRAMARI.put('__gibilan__', JSON.stringify(data));
        return json({ success: true, id });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path.startsWith('/api/gibilan/meeting/') && request.method === 'PATCH') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const id = path.replace('/api/gibilan/meeting/', '');
        const body = await request.json();
        const raw = await env.PROGRAMARI.get('__gibilan__');
        const data = raw ? JSON.parse(raw) : { meetings: [], todos: [], deadlines: [] };
        const item = (data.meetings || []).find(m => m.id === id);
        if (!item) return json({ error: 'Not found' }, 404);
        Object.assign(item, body);
        await env.PROGRAMARI.put('__gibilan__', JSON.stringify(data));
        return json({ success: true });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path.startsWith('/api/gibilan/meeting/') && request.method === 'DELETE') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const id = path.replace('/api/gibilan/meeting/', '');
        const raw = await env.PROGRAMARI.get('__gibilan__');
        const data = raw ? JSON.parse(raw) : { meetings: [], todos: [], deadlines: [] };
        data.meetings = (data.meetings || []).filter(m => m.id !== id);
        await env.PROGRAMARI.put('__gibilan__', JSON.stringify(data));
        return json({ success: true });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path === '/api/gibilan/todo' && request.method === 'POST') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const { title, dueDate, priority, clientId } = await request.json();
        if (!title) return json({ error: 'Title is required' }, 400);
        const raw = await env.PROGRAMARI.get('__gibilan__');
        const data = raw ? JSON.parse(raw) : { meetings: [], todos: [], deadlines: [] };
        const id = `t_${Date.now()}`;
        data.todos = data.todos || [];
        data.todos.push({ id, title, dueDate: dueDate || '', priority: priority || 'normal', done: false, clientId: clientId || '' });
        await env.PROGRAMARI.put('__gibilan__', JSON.stringify(data));
        return json({ success: true, id });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path.match(/^\/api\/gibilan\/todo\/[^/]+\/done$/) && request.method === 'PATCH') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const id = path.replace('/api/gibilan/todo/', '').replace('/done', '');
        const raw = await env.PROGRAMARI.get('__gibilan__');
        const data = raw ? JSON.parse(raw) : { meetings: [], todos: [], deadlines: [] };
        const todo = (data.todos || []).find(t => t.id === id);
        if (!todo) return json({ error: 'Not found' }, 404);
        todo.done = !todo.done;
        await env.PROGRAMARI.put('__gibilan__', JSON.stringify(data));
        return json({ success: true, done: todo.done });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path.startsWith('/api/gibilan/todo/') && !path.endsWith('/done') && request.method === 'PATCH') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const id = path.replace('/api/gibilan/todo/', '');
        const body = await request.json();
        const raw = await env.PROGRAMARI.get('__gibilan__');
        const data = raw ? JSON.parse(raw) : { meetings: [], todos: [], deadlines: [] };
        const item = (data.todos || []).find(t => t.id === id);
        if (!item) return json({ error: 'Not found' }, 404);
        Object.assign(item, body);
        await env.PROGRAMARI.put('__gibilan__', JSON.stringify(data));
        return json({ success: true });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path.startsWith('/api/gibilan/todo/') && !path.endsWith('/done') && request.method === 'DELETE') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const id = path.replace('/api/gibilan/todo/', '');
        const raw = await env.PROGRAMARI.get('__gibilan__');
        const data = raw ? JSON.parse(raw) : { meetings: [], todos: [], deadlines: [] };
        data.todos = (data.todos || []).filter(t => t.id !== id);
        await env.PROGRAMARI.put('__gibilan__', JSON.stringify(data));
        return json({ success: true });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path === '/api/gibilan/deadline' && request.method === 'POST') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const { title, date, project, notes, clientId } = await request.json();
        if (!title || !date) return json({ error: 'Title and date are required' }, 400);
        const raw = await env.PROGRAMARI.get('__gibilan__');
        const data = raw ? JSON.parse(raw) : { meetings: [], todos: [], deadlines: [] };
        const id = `d_${Date.now()}`;
        data.deadlines = data.deadlines || [];
        data.deadlines.push({ id, title, date, project: project || '', notes: notes || '', clientId: clientId || '' });
        await env.PROGRAMARI.put('__gibilan__', JSON.stringify(data));
        return json({ success: true, id });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path.startsWith('/api/gibilan/deadline/') && request.method === 'PATCH') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const id = path.replace('/api/gibilan/deadline/', '');
        const body = await request.json();
        const raw = await env.PROGRAMARI.get('__gibilan__');
        const data = raw ? JSON.parse(raw) : { meetings: [], todos: [], deadlines: [] };
        const item = (data.deadlines || []).find(d => d.id === id);
        if (!item) return json({ error: 'Not found' }, 404);
        Object.assign(item, body);
        await env.PROGRAMARI.put('__gibilan__', JSON.stringify(data));
        return json({ success: true });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path.startsWith('/api/gibilan/deadline/') && request.method === 'DELETE') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const id = path.replace('/api/gibilan/deadline/', '');
        const raw = await env.PROGRAMARI.get('__gibilan__');
        const data = raw ? JSON.parse(raw) : { meetings: [], todos: [], deadlines: [] };
        data.deadlines = (data.deadlines || []).filter(d => d.id !== id);
        await env.PROGRAMARI.put('__gibilan__', JSON.stringify(data));
        return json({ success: true });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    // ── CLIENȚI ──────────────────────────────────────────────
    if (path === '/api/clients' && request.method === 'GET') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const raw = await env.PROGRAMARI.get('__clients__');
        return json(raw ? JSON.parse(raw) : []);
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path === '/api/client' && request.method === 'POST') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const { name, contact, phone, email, notes } = await request.json();
        if (!name) return json({ error: 'Name is required' }, 400);
        const raw = await env.PROGRAMARI.get('__clients__');
        const clients = raw ? JSON.parse(raw) : [];
        const client = {
          id: 'c_' + Date.now(), name,
          contact: contact || '', phone: phone || '',
          email: email || '', notes: notes || '',
          createdAt: new Date().toISOString().split('T')[0]
        };
        clients.push(client);
        await env.PROGRAMARI.put('__clients__', JSON.stringify(clients));
        return json(client);
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path.match(/^\/api\/client\/[^/]+$/) && request.method === 'PATCH') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const id = path.replace('/api/client/', '');
        const body = await request.json();
        const raw = await env.PROGRAMARI.get('__clients__');
        const clients = raw ? JSON.parse(raw) : [];
        const idx = clients.findIndex(c => c.id === id);
        if (idx === -1) return json({ error: 'Client not found' }, 404);
        clients[idx] = { ...clients[idx], ...body };
        await env.PROGRAMARI.put('__clients__', JSON.stringify(clients));
        return json(clients[idx]);
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path.match(/^\/api\/client\/[^/]+$/) && request.method === 'DELETE') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const id = path.replace('/api/client/', '');
        const raw = await env.PROGRAMARI.get('__clients__');
        const clients = raw ? JSON.parse(raw) : [];
        await env.PROGRAMARI.put('__clients__', JSON.stringify(clients.filter(c => c.id !== id)));
        return json({ ok: true });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    // ── THEME ─────────────────────────────────────────────────

    const THEME_DEFAULT = {
      teal:        '#c9a96e',
      bg:          '#ffffff',
      bg2:         '#f7f7f7',
      bg3:         '#eeeeee',
      bg4:         '#e5e5e5',
      text:        '#111111',
      soft:        '#444444',
      heading:     '#111111',
      fontHeading: 'Space Grotesk',
      fontBody:    'DM Sans'
    };

    function hexToRgba(hex, alpha) {
      const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
      return `rgba(${r},${g},${b},${alpha})`;
    }

    function lightenHex(hex, amount) {
      let r = Math.min(255, parseInt(hex.slice(1,3),16) + amount);
      let g = Math.min(255, parseInt(hex.slice(3,5),16) + amount);
      let b = Math.min(255, parseInt(hex.slice(5,7),16) + amount);
      return '#' + [r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');
    }

    function darkenHex(hex, amount) {
      let r = Math.max(0, parseInt(hex.slice(1,3),16) - amount);
      let g = Math.max(0, parseInt(hex.slice(3,5),16) - amount);
      let b = Math.max(0, parseInt(hex.slice(5,7),16) - amount);
      return '#' + [r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');
    }

    const FONT_GOOGLE_MAP = {
      'Syne':          'Syne:wght@700;800',
      'Raleway':       'Raleway:wght@700;800',
      'Oswald':        'Oswald:wght@500;700',
      'Space Grotesk': 'Space+Grotesk:wght@600;700',
      'Bebas Neue':    'Bebas+Neue',
      'DM Sans':       'DM+Sans:ital,wght@0,300;0,400;0,500;1,400',
      'Inter':         'Inter:wght@300;400;500',
      'Nunito':        'Nunito:wght@300;400;600',
      'Roboto':        'Roboto:wght@300;400;500',
      'Open Sans':     'Open+Sans:wght@300;400;600',
      'Lato':          'Lato:wght@300;400;700',
    };

    function buildThemeCss(t) {
      const teal = t.teal || THEME_DEFAULT.teal;
      const bg   = t.bg   || THEME_DEFAULT.bg;
      const bg2  = t.bg2  || THEME_DEFAULT.bg2;
      const bg3  = t.bg3  || THEME_DEFAULT.bg3;
      const text = t.text || THEME_DEFAULT.text;
      const soft = t.soft || THEME_DEFAULT.soft;
      const fh   = t.fontHeading || THEME_DEFAULT.fontHeading;
      const fb   = t.fontBody    || THEME_DEFAULT.fontBody;
      const tealDk  = darkenHex(teal, 30);
      const tealLt  = lightenHex(teal, 30);
      const bg4     = lightenHex(bg3, 8);
      const muted   = darkenHex(soft, 40);
      // Adaptive vars based on bg luminance
      const bgR = parseInt(bg.slice(1,3),16);
      const bgG = parseInt(bg.slice(3,5),16);
      const bgB = parseInt(bg.slice(5,7),16);
      const lum = 0.2126*bgR/255 + 0.7152*bgG/255 + 0.0722*bgB/255;
      const isLight = lum > 0.5;
      const heading = t.heading || (isLight ? '#111111' : '#f0f4f8');
      const border     = isLight ? 'rgba(0,0,0,.10)'  : 'rgba(255,255,255,.07)';
      const borderSoft = isLight ? 'rgba(0,0,0,.16)'  : 'rgba(255,255,255,.11)';
      const navColor = t.navColor || bg;
      const navR = parseInt(navColor.slice(1,3),16);
      const navG = parseInt(navColor.slice(3,5),16);
      const navB = parseInt(navColor.slice(5,7),16);
      const navLum = 0.2126*navR/255 + 0.7152*navG/255 + 0.0722*navB/255;
      const navIsLight = navLum > 0.5;
      const navText  = t.navText  || (navIsLight ? '#111111' : '#ffffff');
      const navPhone = t.navPhone || (navIsLight ? '#111111' : '#ffffff');
      const navBurger = t.navBurger || (navIsLight ? '#111111' : '#ffffff');
      const navBg      = `rgba(${navR},${navG},${navB},.92)`;
      const navBgSolid = `rgba(${navR},${navG},${navB},.97)`;
      const hG = (a) => `rgba(${bgR},${bgG},${bgB},${a})`;
      const heroGrad    = `linear-gradient(105deg,${hG(.97)} 0%,${hG(.90)} 35%,${hG(.72)} 60%,${hG(.45)} 100%)`;
      const heroGradMob = `linear-gradient(180deg,${hG(.82)} 0%,${hG(.75)} 50%,${hG(.92)} 100%)`;
      const heroGradXs  = `linear-gradient(180deg,${hG(.88)} 0%,${hG(.72)} 55%,${hG(.95)} 100%)`;
      const fonts = [...new Set([FONT_GOOGLE_MAP[fh], FONT_GOOGLE_MAP[fb]].filter(Boolean))];
      const importUrl = fonts.length ? `@import url('https://fonts.googleapis.com/css2?family=${fonts.join('&family=')}&display=swap');\n` : '';
      return `${importUrl}:root{` +
        `--teal:${teal};--teal-dk:${tealDk};--teal-lt:${tealLt};` +
        `--teal-dim:${hexToRgba(teal,.08)};--teal-glow:${hexToRgba(teal,.18)};--teal-border:${hexToRgba(teal,.30)};` +
        `--bg:${bg};--bg2:${bg2};--bg3:${bg3};--bg4:${bg4};` +
        `--text:${text};--soft:${soft};--muted:${muted};--heading:${heading};` +
        `--border:${border};--border-soft:${borderSoft};` +
        `--nav-bg:${navBg};--nav-bg-solid:${navBgSolid};--nav-text:${navText};--nav-phone:${navPhone};--nav-burger:${navBurger};` +
        `--hero-grad:${heroGrad};--hero-grad-mob:${heroGradMob};--hero-grad-xs:${heroGradXs};` +
        `--font-heading:'${fh}',sans-serif;--font-body:'${fb}',sans-serif}` +
        `body{font-family:'${fb}',sans-serif!important}` +
        `h1,h2,h3,h4,h5,h6,.logo,.hero h1,.section-title,.card-title{font-family:'${fh}',sans-serif!important}` +
        `.nav-phone{color:${navPhone}!important}.hamburger span{background:${navBurger}!important}`;
    }

    if (path === '/theme.css') {
      try {
        const raw = await env.PROGRAMARI.get('__theme__');
        let t = raw ? JSON.parse(raw) : THEME_DEFAULT;
        // Ensure missing keys get defaults
        if (!t.text)    t.text    = THEME_DEFAULT.text;
        if (!t.soft)    t.soft    = THEME_DEFAULT.soft;
        if (!t.heading) t.heading = THEME_DEFAULT.heading;
        if (!raw) await env.PROGRAMARI.put('__theme__', JSON.stringify(t));
        const css = buildThemeCss(t);
        return new Response(css, { headers: { 'Content-Type': 'text/css;charset=utf-8', 'Cache-Control': 'no-cache, no-store, must-revalidate' } });
      } catch { return new Response('', { headers: { 'Content-Type': 'text/css' } }); }
    }

    if (path === '/api/theme' && request.method === 'GET') {
      try {
        const raw = await env.PROGRAMARI.get('__theme__');
        return json(raw ? JSON.parse(raw) : THEME_DEFAULT);
      } catch { return json(THEME_DEFAULT); }
    }

    if (path === '/api/theme' && request.method === 'PUT') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const body = await request.json();
        await env.PROGRAMARI.put('__theme__', JSON.stringify(body));
        return json({ success: true });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    // ── LAYOUT (section order per page) ──────────────────────

    const LAYOUT_DEFAULTS = {
      index: ['hero','carousel','showcase','services','startup','industries','process','portfolio','testimonials','contact'],
      'web-design-leeds': ['hero','trust','services','portfolio','process','contact'],
      'web-design-sheffield': ['hero','trust','services','portfolio','process','contact'],
      'web-design-nottingham': ['hero','trust','services','portfolio','process','contact'],
      'web-design-derby': ['hero','trust','services','portfolio','process','contact'],
      'web-design-blackburn': ['hero','trust','services','portfolio','process','contact'],
      'web-design-preston': ['hero','trust','services','portfolio','process','contact'],
      'web-design-auto':      ['hero','trust','services','portfolio','process','contact'],
      'web-design-restaurante':['hero','trust','services','portfolio','process','contact'],
      'web-design-afaceri-mici':['hero','trust','services','portfolio','process','contact'],
    };

    const LAYOUT_LABELS = {
      hero:'Hero principal', carousel:'Banner carousel', showcase:'Device showcase',
      services:'Servicii', startup:'Strip pachet startup', industries:'Industrii',
      process:'Procesul nostru', portfolio:'Portofoliu', testimonials:'Testimoniale',
      contact:'Contact', trust:'Trust / statistici',
    };

    if (path.startsWith('/api/layout/') && request.method === 'GET') {
      const page = path.replace('/api/layout/','');
      if (!LAYOUT_DEFAULTS[page]) return json({ error: 'Unknown page' }, 404);
      try {
        const raw = await env.PROGRAMARI.get('__layout__' + page);
        const stored = raw ? JSON.parse(raw) : {};
        const normalized = Array.isArray(stored) ? { order: stored } : stored;
        return json({
          order:  normalized.order  || LAYOUT_DEFAULTS[page],
          hidden: normalized.hidden || [],
          blocks: normalized.blocks || {},
          labels: LAYOUT_LABELS,
          default: LAYOUT_DEFAULTS[page]
        });
      } catch { return json({ order: LAYOUT_DEFAULTS[page], hidden: [], blocks: {}, labels: LAYOUT_LABELS, default: LAYOUT_DEFAULTS[page] }); }
    }

    if (path.startsWith('/api/layout/') && request.method === 'PUT') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      const page = path.replace('/api/layout/','');
      if (!LAYOUT_DEFAULTS[page]) return json({ error: 'Unknown page' }, 404);
      try {
        const body = await request.json();
        await env.PROGRAMARI.put('__layout__' + page, JSON.stringify({
          order:  body.order  || [],
          hidden: body.hidden || [],
          blocks: body.blocks || {}
        }));
        return json({ success: true });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    // ── SITE SETTINGS (hero image etc.) ──────────────────────
    if (path === '/api/site-settings' && request.method === 'GET') {
      try {
        const raw = await env.PROGRAMARI.get('__site_settings__');
        return json(raw ? JSON.parse(raw) : {});
      } catch { return json({}); }
    }
    if (path === '/api/site-settings' && request.method === 'PUT') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const raw = await env.PROGRAMARI.get('__site_settings__');
        const existing = raw ? JSON.parse(raw) : {};
        const body = await request.json();
        const updated = Object.assign({}, existing, body);
        await env.PROGRAMARI.put('__site_settings__', JSON.stringify(updated));
        return json({ success: true });
      } catch { return json({ error: 'Error' }, 500); }
    }

    // ── MAINTENANCE API ───────────────────────────────────────
    if (path === '/api/maintenance' && request.method === 'GET') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const raw = await env.PROGRAMARI.get('__maintenance__');
        return json(raw ? JSON.parse(raw) : { enabled: false, title: '', message: '', date: '' });
      } catch { return json({ error: 'Error' }, 500); }
    }
    if (path === '/api/maintenance' && request.method === 'PUT') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const body = await request.json();
        await env.PROGRAMARI.put('__maintenance__', JSON.stringify({
          enabled: !!body.enabled,
          title:   String(body.title   || 'Site under construction').slice(0, 120),
          message: String(body.message || 'We\'ll be back soon with something new!').slice(0, 400),
          date:    String(body.date    || '').slice(0, 60),
        }));
        return json({ success: true });
      } catch { return json({ error: 'Error' }, 500); }
    }

    // Media upload
    if (path === '/api/media' && request.method === 'POST') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const ct = request.headers.get('Content-Type') || '';
        if (!ct.startsWith('image/')) return json({ error: 'Only images are accepted' }, 400);
        const buf = await request.arrayBuffer();
        if (buf.byteLength > 5 * 1024 * 1024) return json({ error: 'File too large (max 5MB)' }, 400);
        const ext = ct.includes('png') ? 'png' : ct.includes('gif') ? 'gif' : ct.includes('webp') ? 'webp' : 'jpg';
        const filename = 'media_' + Date.now() + '.' + ext;
        await env.PROGRAMARI.put('__media__' + filename, buf, { metadata: { ct } });
        return json({ url: '/media/' + filename, filename });
      } catch { return json({ error: 'Upload error' }, 500); }
    }

    if (path.startsWith('/media/') && request.method === 'GET') {
      const filename = path.replace('/media/', '');
      if (!filename || filename.includes('..')) return new Response('Not found', { status: 404 });
      try {
        const obj = await env.PROGRAMARI.getWithMetadata('__media__' + filename, { type: 'arrayBuffer' });
        if (!obj.value) return new Response('Not found', { status: 404 });
        const ct = (obj.metadata && obj.metadata.ct) || 'image/jpeg';
        return new Response(obj.value, {
          headers: { 'Content-Type': ct, 'Cache-Control': 'public, max-age=31536000', ...getCors(request) }
        });
      } catch { return new Response('Error', { status: 500 }); }
    }

    if (path.startsWith('/api/media') && request.method === 'GET') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const list = await env.PROGRAMARI.list({ prefix: '__media__' });
        const files = list.keys.map(k => ({
          filename: k.name.replace('__media__', ''),
          url: '/media/' + k.name.replace('__media__', ''),
          ct: k.metadata?.ct || 'image/*',
          ts: parseInt((k.name.match(/(\d+)\./) || [])[1] || '0')
        }));
        files.sort((a, b) => b.ts - a.ts);
        return json({ files });
      } catch { return json({ error: 'Error' }, 500); }
    }

    if (path.startsWith('/api/media/') && request.method === 'DELETE') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      const filename = path.replace('/api/media/', '');
      try {
        await env.PROGRAMARI.delete('__media__' + filename);
        return json({ success: true });
      } catch { return json({ error: 'Error' }, 500); }
    }

    // ── SERVICII (catalog pentru oferte) ─────────────────────

    if (path === '/api/servicii' && request.method === 'GET') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const raw = await env.PROGRAMARI.get('__servicii__');
        // Servicii noi adăugate după seed inițial — migrare automată
        const migrations = [
          { id:'svc_d17', nume:'Google Search Console Integration', descriere:'Property verification, XML sitemap, Google Analytics connection, indexing error report', pret:120, moneda:'EUR', unitate:'proiect', categorie:'seo' },
        ];
        if (raw !== null) {
          const lista = JSON.parse(raw);
          const ids = new Set(lista.map(s => s.id));
          const toAdd = migrations.filter(m => !ids.has(m.id));
          if (toAdd.length) {
            const updated = [...lista, ...toAdd];
            await env.PROGRAMARI.put('__servicii__', JSON.stringify(updated));
            return json(updated);
          }
          return json(lista);
        }
        // Prima accesare — seed cu servicii tipice agenție web design România
        const defaults = [
          { id:'svc_d01', nume:'Presentation Website', descriere:'5 pages, responsive design, CMS, Google Analytics, basic SEO', pret:899, moneda:'EUR', unitate:'proiect', categorie:'web-design' },
          { id:'svc_d02', nume:'Premium Presentation Website', descriere:'10+ pages, custom design, blog, multilingual, API integrations', pret:1800, moneda:'EUR', unitate:'proiect', categorie:'web-design' },
          { id:'svc_d03', nume:'Online Shop (eCommerce)', descriere:'WooCommerce / Shopify, product catalogue, online payments, delivery', pret:2500, moneda:'EUR', unitate:'proiect', categorie:'web-design' },
          { id:'svc_d04', nume:'Landing Page', descriere:'Conversion-optimised page, A/B testing, form integration', pret:450, moneda:'EUR', unitate:'proiect', categorie:'web-design' },
          { id:'svc_d05', nume:'Existing Website Redesign', descriere:'Full redesign retaining existing content, data migration, SEO redirects', pret:700, moneda:'EUR', unitate:'proiect', categorie:'web-design' },
          { id:'svc_d06', nume:'Full SEO Audit', descriere:'Technical analysis, keywords, competition, report with recommendations', pret:300, moneda:'EUR', unitate:'proiect', categorie:'seo' },
          { id:'svc_d07', nume:'Monthly SEO (Ongoing)', descriere:'Continuous optimisation, content, link building, monthly report, 15–25 keywords', pret:400, moneda:'EUR', unitate:'lună', categorie:'seo' },
          { id:'svc_d08', nume:'Local SEO (Google Maps)', descriere:'Google Business Profile optimisation, local citations, reviews', pret:250, moneda:'EUR', unitate:'lună', categorie:'seo' },
          { id:'svc_d09', nume:'Google Ads Management', descriere:'Setup + campaign optimisation Search/Display/Shopping, monthly report', pret:350, moneda:'EUR', unitate:'lună', categorie:'marketing' },
          { id:'svc_d10', nume:'Meta Ads Management', descriere:'Facebook & Instagram campaigns, A/B testing, retargeting, monthly report', pret:350, moneda:'EUR', unitate:'lună', categorie:'marketing' },
          { id:'svc_d11', nume:'Social Media Management', descriere:'12 posts/month, copywriting, branded graphics, community monitoring', pret:300, moneda:'EUR', unitate:'lună', categorie:'marketing' },
          { id:'svc_d12', nume:'Email Marketing / Newsletter', descriere:'Template design, list segmentation, campaign delivery, open-rate report', pret:200, moneda:'EUR', unitate:'lună', categorie:'marketing' },
          { id:'svc_d13', nume:'Basic Website Maintenance', descriere:'CMS & plugin updates, monthly backup, uptime monitoring, 1h support', pret:100, moneda:'EUR', unitate:'lună', categorie:'mentenanta' },
          { id:'svc_d14', nume:'Advanced Website Maintenance', descriere:'Updates, weekly backup, security, 4h of changes/month, report', pret:200, moneda:'EUR', unitate:'lună', categorie:'mentenanta' },
          { id:'svc_d15', nume:'Logo Design', descriere:'3 concept variants, final vector files (AI, SVG, PNG, PDF)', pret:350, moneda:'EUR', unitate:'proiect', categorie:'grafic' },
          { id:'svc_d16', nume:'Complete Visual Identity', descriere:'Logo + colour palette + fonts + business card + letterhead + brand guide', pret:800, moneda:'EUR', unitate:'proiect', categorie:'grafic' },
          ...migrations,
        ];
        await env.PROGRAMARI.put('__servicii__', JSON.stringify(defaults));
        return json(defaults);
      } catch { return json([]); }
    }

    if (path === '/api/servicii' && request.method === 'POST') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const body = await request.json();
        if (!body.nume || body.pret === undefined) return json({ error: 'Required fields missing' }, 400);
        const raw = await env.PROGRAMARI.get('__servicii__');
        const lista = raw ? JSON.parse(raw) : [];
        const svc = {
          id: 'svc_' + Date.now(),
          nume: String(body.nume).slice(0, 120),
          descriere: String(body.descriere || '').slice(0, 300),
          pret: parseFloat(body.pret) || 0,
          moneda: ['EUR', 'RON'].includes(body.moneda) ? body.moneda : 'EUR',
          unitate: ['proiect', 'lună', 'oră', 'pagină', 'an'].includes(body.unitate) ? body.unitate : 'proiect',
          categorie: ['web-design', 'seo', 'mentenanta', 'grafic', 'marketing', 'altele'].includes(body.categorie) ? body.categorie : 'altele',
        };
        lista.push(svc);
        await env.PROGRAMARI.put('__servicii__', JSON.stringify(lista));
        return json(svc);
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path.startsWith('/api/servicii/') && request.method === 'PUT') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      const id = path.replace('/api/servicii/', '');
      try {
        const body = await request.json();
        const raw = await env.PROGRAMARI.get('__servicii__');
        const lista = raw ? JSON.parse(raw) : [];
        const idx = lista.findIndex(s => s.id === id);
        if (idx === -1) return json({ error: 'Service not found' }, 404);
        lista[idx] = {
          ...lista[idx],
          ...(body.nume !== undefined && { nume: String(body.nume).slice(0, 120) }),
          ...(body.descriere !== undefined && { descriere: String(body.descriere).slice(0, 300) }),
          ...(body.pret !== undefined && { pret: parseFloat(body.pret) || 0 }),
          ...(body.moneda && ['EUR', 'RON'].includes(body.moneda) && { moneda: body.moneda }),
          ...(body.unitate && ['proiect','lună','oră','pagină','an'].includes(body.unitate) && { unitate: body.unitate }),
          ...(body.categorie && { categorie: body.categorie }),
        };
        await env.PROGRAMARI.put('__servicii__', JSON.stringify(lista));
        return json(lista[idx]);
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path.startsWith('/api/servicii/') && request.method === 'DELETE') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      const id = path.replace('/api/servicii/', '');
      try {
        const raw = await env.PROGRAMARI.get('__servicii__');
        const lista = raw ? JSON.parse(raw) : [];
        const filtered = lista.filter(s => s.id !== id);
        await env.PROGRAMARI.put('__servicii__', JSON.stringify(filtered));
        return json({ success: true });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    // ── OFERTE ───────────────────────────────────────────────

    if (path === '/api/oferte' && request.method === 'GET') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const raw = await env.PROGRAMARI.get('__oferte__');
        return json(raw ? JSON.parse(raw) : []);
      } catch { return json([]); }
    }

    if (path === '/api/oferte' && request.method === 'POST') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const body = await request.json();
        if (!body.client?.name || !body.servicii?.length) return json({ error: 'Incomplete data' }, 400);
        const raw = await env.PROGRAMARI.get('__oferte__');
        const lista = raw ? JSON.parse(raw) : [];
        const yr = new Date().getFullYear();
        const nrSeq = String(lista.filter(o => (o.createdAt || '').startsWith(String(yr))).length + 1).padStart(3, '0');
        const oferta = {
          id: 'off_' + Date.now(),
          numar: `OFF-${yr}-${nrSeq}`,
          createdAt: new Date().toISOString(),
          client: {
            id: body.client.id || null,
            name: String(body.client.name).slice(0, 120),
            email: String(body.client.email || '').slice(0, 120),
            phone: String(body.client.phone || '').slice(0, 40),
          },
          servicii: (body.servicii || []).map(s => ({
            id: s.id, nume: String(s.nume || '').slice(0, 120),
            descriere: String(s.descriere || '').slice(0, 300),
            pret: parseFloat(s.pret) || 0, moneda: s.moneda || 'EUR', unitate: s.unitate || 'proiect',
          })),
          moneda: ['EUR', 'RON'].includes(body.moneda) ? body.moneda : 'EUR',
          valabilitate: String(body.valabilitate || '30 days').slice(0, 30),
          note: String(body.note || '').slice(0, 500),
          status: 'trimisă',
        };
        lista.push(oferta);
        await env.PROGRAMARI.put('__oferte__', JSON.stringify(lista));
        return json(oferta);
      } catch { return json({ error: 'Server error' }, 500); }
    }

    // ── OFERTĂ PREVIEW (print as PDF) ────────────────────────

    if (path.startsWith('/oferta-preview/') && request.method === 'GET') {
      if (!isAdmin(url, env)) return new Response('Unauthorised', { status: 401 });
      const id = path.replace('/oferta-preview/', '');
      try {
        const [raw, tmplRaw] = await Promise.all([
          env.PROGRAMARI.get('__oferte__'),
          env.PROGRAMARI.get('__contract_template__'),
        ]);
        const lista = raw ? JSON.parse(raw) : [];
        const o = lista.find(x => x.id === id);
        if (!o) return new Response('Quotation not found', { status: 404 });
        const t = tmplRaw ? JSON.parse(tmplRaw) : {};
        const prest = {
          nume:  t.prestNume  || 'C Design',
          email: t.prestEmail || 'office@c-design.ro',
          tel:   t.prestTel   || '',
          web:   t.prestWeb   || 'www.c-design.ro',
          cui:   t.prestCui   || '',
          adresa:t.prestAdresa|| '',
        };

        const total = (o.servicii || []).reduce((s, sv) => s + parseFloat(sv.pret || 0), 0);
        const dataDoc = new Date(o.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        const dataExpira = (() => {
          const d = new Date(o.createdAt);
          const zile = parseInt(o.valabilitate) || 30;
          d.setDate(d.getDate() + zile);
          return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        })();
        function e(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

        const html = `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Quotation ${e(o.numar)} – ${e(prest.nume)}</title>
<style>
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',system-ui,Arial,sans-serif;background:#f0f4f8;color:#1e293b;font-size:14px;line-height:1.6;min-height:100vh;padding:32px 16px 80px;}

  /* A4 sheet */
  .page{
    background:#fff;
    max-width:794px;
    margin:0 auto;
    border-radius:4px;
    box-shadow:0 4px 32px rgba(0,0,0,.13);
    overflow:hidden;
  }

  /* Accent bar top */
  .accent-bar{height:6px;background:linear-gradient(90deg,#00a8a8 0%,#00d4d4 100%);}

  .inner{padding:48px 52px 52px;}

  /* HEADER */
  .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:44px;}
  .brand-name{font-size:1.9rem;font-weight:800;color:#0f172a;letter-spacing:-.03em;line-height:1;}
  .brand-name span{color:#00a8a8;}
  .brand-details{margin-top:6px;}
  .brand-details div{font-size:.75rem;color:#64748b;line-height:1.7;}
  .doc-block{text-align:right;}
  .doc-label{font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;margin-bottom:4px;}
  .doc-nr{font-size:1.5rem;font-weight:800;color:#00a8a8;letter-spacing:-.02em;}
  .doc-date{font-size:.78rem;color:#64748b;margin-top:4px;line-height:1.7;}

  /* DIVIDER */
  .divider{height:1px;background:#e2e8f0;margin:0 0 36px;}

  /* TOWARDS */
  .towards{display:flex;gap:40px;margin-bottom:36px;}
  .towards-block{flex:1;}
  .block-label{font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;margin-bottom:10px;}
  .client-name{font-size:1.1rem;font-weight:700;color:#0f172a;}
  .client-detail{font-size:.82rem;color:#475569;margin-top:3px;}
  .validity-badge{display:inline-flex;align-items:center;gap:6px;background:#f0fdf9;border:1px solid #99f6e4;border-radius:6px;padding:6px 12px;font-size:.78rem;color:#0f766e;font-weight:600;margin-top:8px;}

  /* TABLE */
  .tbl-wrap{margin-bottom:28px;}
  .tbl-label{font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;margin-bottom:10px;}
  table{width:100%;border-collapse:collapse;}
  thead tr{border-bottom:2px solid #e2e8f0;}
  th{font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8;padding:0 14px 10px;text-align:left;}
  th.right{text-align:right;}
  tbody tr{border-bottom:1px solid #f1f5f9;transition:background .1s;}
  tbody tr:last-child{border-bottom:none;}
  td{padding:13px 14px;vertical-align:top;}
  .svc-name{font-weight:600;color:#0f172a;font-size:.92rem;}
  .svc-desc{font-size:.77rem;color:#64748b;margin-top:3px;line-height:1.5;}
  .svc-unit{font-size:.78rem;color:#94a3b8;white-space:nowrap;}
  .svc-pret{font-size:.95rem;font-weight:700;color:#0f172a;text-align:right;white-space:nowrap;}

  /* TOTAL */
  .total-section{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;}
  .total-left{font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#64748b;}
  .total-right{font-size:1.6rem;font-weight:800;color:#00a8a8;letter-spacing:-.02em;}
  .total-moneda{font-size:.9rem;font-weight:600;color:#94a3b8;margin-left:4px;}

  /* NOTES */
  .note-box{background:#fffbeb;border-left:3px solid #f59e0b;border-radius:0 8px 8px 0;padding:14px 18px;margin-bottom:28px;}
  .note-box strong{font-size:.72rem;text-transform:uppercase;letter-spacing:.08em;color:#92400e;display:block;margin-bottom:4px;}
  .note-box p{font-size:.85rem;color:#78350f;line-height:1.6;white-space:pre-wrap;}

  /* FOOTER */
  .footer{display:flex;justify-content:space-between;align-items:flex-end;padding-top:28px;border-top:1px solid #e2e8f0;margin-top:4px;}
  .footer-left{font-size:.78rem;color:#94a3b8;line-height:1.7;}
  .sig-block{text-align:center;}
  .sig-label{font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#94a3b8;margin-bottom:28px;}
  .sig-line{border-top:1.5px solid #cbd5e1;padding-top:8px;font-size:.8rem;font-weight:600;color:#475569;min-width:180px;}

  /* PRINT BUTTON */
  .print-btn{position:fixed;bottom:28px;right:28px;background:#00a8a8;color:#fff;font-weight:700;font-size:.88rem;padding:11px 22px;border-radius:8px;border:none;cursor:pointer;box-shadow:0 4px 20px rgba(0,168,168,.45);display:flex;align-items:center;gap:8px;font-family:inherit;}
  .print-btn:hover{background:#009090;transform:translateY(-1px);}

  @media print{
    body{background:#fff;padding:0;}
    .page{box-shadow:none;border-radius:0;}
    .print-btn{display:none;}
    .inner{padding:30px 36px 36px;}
    @page{margin:1.2cm;size:A4;}
  }
  @media(max-width:600px){
    body{padding:12px 8px 72px;}
    .inner{padding:28px 22px 32px;}
    .towards{flex-direction:column;gap:20px;}
    .footer{flex-direction:column;gap:24px;align-items:flex-start;}
  }
</style>
</head>
<body>
<div class="page">
  <div class="accent-bar"></div>
  <div class="inner">

    <!-- HEADER -->
    <div class="header">
      <div>
        <div class="brand-name">${e(prest.nume.split(' ')[0])}<span>${prest.nume.includes(' ') ? e(prest.nume.slice(prest.nume.indexOf(' '))) : ''}</span></div>
        <div class="brand-details">
          ${prest.web ? `<div>${e(prest.web)}</div>` : ''}
          ${prest.email ? `<div>${e(prest.email)}</div>` : ''}
          ${prest.tel ? `<div>${e(prest.tel)}</div>` : ''}
          ${prest.cui ? `<div>CUI: ${e(prest.cui)}</div>` : ''}
        </div>
      </div>
      <div class="doc-block">
        <div class="doc-label">Commercial quotation</div>
        <div class="doc-nr">${e(o.numar)}</div>
        <div class="doc-date">
          Issued: ${dataDoc}<br>
          ${o.valabilitate !== 'la cerere' ? `Valid until: <strong>${dataExpira}</strong>` : 'Validity: on request'}
        </div>
      </div>
    </div>

    <div class="divider"></div>

    <!-- TOWARDS -->
    <div class="towards">
      <div class="towards-block">
        <div class="block-label">To</div>
        <div class="client-name">${e(o.client?.name || '—')}</div>
        ${o.client?.email ? `<div class="client-detail">✉ ${e(o.client.email)}</div>` : ''}
        ${o.client?.phone ? `<div class="client-detail">✆ ${e(o.client.phone)}</div>` : ''}
      </div>
      <div class="towards-block">
        <div class="block-label">Details</div>
        <div class="validity-badge">⏱ Validity: ${e(o.valabilitate)}</div>
        ${prest.adresa ? `<div class="client-detail" style="margin-top:8px;">📍 ${e(prest.adresa)}</div>` : ''}
      </div>
    </div>

    <!-- SERVICII -->
    <div class="tbl-wrap">
      <div class="tbl-label">Services included</div>
      <table>
        <thead>
          <tr>
            <th style="width:52%">Service / Description</th>
            <th>Unit</th>
            <th class="right">Price</th>
          </tr>
        </thead>
        <tbody>
          ${(o.servicii || []).map((s, i) => `
          <tr style="${i % 2 === 1 ? 'background:#fafbfc;' : ''}">
            <td>
              <div class="svc-name">${e(s.nume)}</div>
              ${s.descriere ? `<div class="svc-desc">${e(s.descriere)}</div>` : ''}
            </td>
            <td class="svc-unit">/ ${e(s.unitate || 'proiect')}</td>
            <td class="svc-pret">${parseFloat(s.pret||0).toLocaleString('en-GB')} <span style="font-size:.75rem;font-weight:400;color:#94a3b8;">${e(s.moneda||o.moneda)}</span></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>

    <!-- TOTAL -->
    <div class="total-section">
      <div class="total-left">Estimated total</div>
      <div class="total-right">${total.toLocaleString('en-GB')}<span class="total-moneda">${e(o.moneda)}</span></div>
    </div>

    ${o.note ? `
    <div class="note-box">
      <strong>Notes &amp; conditions</strong>
      <p>${e(o.note)}</p>
    </div>` : ''}

    <!-- FOOTER -->
    <div class="footer">
      <div class="footer-left">
        <div style="font-weight:600;color:#475569;margin-bottom:4px;">${e(prest.nume)}</div>
        ${prest.email ? `<div>${e(prest.email)}</div>` : ''}
        ${prest.tel ? `<div>${e(prest.tel)}</div>` : ''}
        ${prest.web ? `<div>${e(prest.web)}</div>` : ''}
      </div>
      <div class="sig-block">
        <div class="sig-label">Authorised representative</div>
        <div class="sig-line">${e(prest.nume)}</div>
      </div>
    </div>

  </div>
</div>
<button class="print-btn" onclick="window.print()">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
  Print / Save as PDF
</button>
</body>
</html>`;
        return new Response(html, {
          headers: { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'no-store' }
        });
      } catch { return new Response('Error generating document', { status: 500 }); }
    }

    // ── CONTRACT TEMPLATE ────────────────────────────────────

    if (path === '/api/contract-template' && request.method === 'GET') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const raw = await env.PROGRAMARI.get('__contract_template__');
        return json(raw ? JSON.parse(raw) : {});
      } catch { return json({}); }
    }

    if (path === '/api/contract-template' && request.method === 'PUT') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const raw = await env.PROGRAMARI.get('__contract_template__');
        const existing = raw ? JSON.parse(raw) : {};
        const body = await request.json();
        const allowed = ['prestNume','prestCui','prestRegcom','prestAdresa','prestEmail','prestTel',
          'prestWeb','prestIban','prestBanca','prestRepr','garantie','preaviz','ndaAni',
          'avansPct','termen','penalitatiPct'];
        allowed.forEach(k => { if (body[k] !== undefined) existing[k] = String(body[k]).slice(0,200); });
        await env.PROGRAMARI.put('__contract_template__', JSON.stringify(existing));
        return json({ success: true });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    // ── CONTRACTE ────────────────────────────────────────────

    if (path === '/api/contracte' && request.method === 'GET') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const raw = await env.PROGRAMARI.get('__contracte__');
        return json(raw ? JSON.parse(raw) : []);
      } catch { return json([]); }
    }

    if (path === '/api/contracte' && request.method === 'POST') {
      if (!isAdmin(url, env)) return json({ error: 'Unauthorised' }, 401);
      try {
        const body = await request.json();
        if (!body.client?.name || !body.obiect) return json({ error: 'Incomplete data' }, 400);
        const raw = await env.PROGRAMARI.get('__contracte__');
        const lista = raw ? JSON.parse(raw) : [];
        const yr = new Date().getFullYear();
        const nrSeq = String(lista.filter(c => (c.createdAt||'').startsWith(String(yr))).length + 1).padStart(3, '0');
        const contract = {
          id: 'cnt_' + Date.now(),
          numar: `CNT-${yr}-${nrSeq}`,
          createdAt: new Date().toISOString(),
          dataSemnare: String(body.dataSemnare || new Date().toISOString().slice(0,10)),
          client: {
            name: String(body.client.name||'').slice(0,120),
            cui: String(body.client.cui||'').slice(0,40),
            adresa: String(body.client.adresa||'').slice(0,200),
            email: String(body.client.email||'').slice(0,120),
          },
          obiect: String(body.obiect||'').slice(0,500),
          serviciiText: String(body.serviciiText||'').slice(0,2000),
          total: parseFloat(body.total)||0,
          moneda: ['EUR','RON'].includes(body.moneda) ? body.moneda : 'EUR',
          avansPct: Math.min(100, Math.max(0, parseFloat(body.avansPct)||50)),
          termen: String(body.termen||'30'),
          termenUnit: String(body.termenUnit||'working days').slice(0,40),
          clauze: {
            confidentialitate: !!body.clauze?.confidentialitate,
            penalitati: !!body.clauze?.penalitati,
            ip: !!body.clauze?.ip,
          },
          ofertaId: body.ofertaId || null,
        };
        lista.push(contract);
        await env.PROGRAMARI.put('__contracte__', JSON.stringify(lista));
        return json(contract);
      } catch { return json({ error: 'Server error' }, 500); }
    }

    // ── CONTRACT PREVIEW (print as PDF) ──────────────────────

    if (path.startsWith('/contract-preview/') && request.method === 'GET') {
      if (!isAdmin(url, env)) return new Response('Unauthorised', { status: 401 });
      const id = path.replace('/contract-preview/', '');
      try {
        const [raw, tmplRaw] = await Promise.all([
          env.PROGRAMARI.get('__contracte__'),
          env.PROGRAMARI.get('__contract_template__'),
        ]);
        const lista = raw ? JSON.parse(raw) : [];
        const c = lista.find(x => x.id === id);
        if (!c) return new Response('Contract not found', { status: 404 });
        const t = tmplRaw ? JSON.parse(tmplRaw) : {};

        // Merge template defaults with per-contract values
        const prest = {
          nume:    t.prestNume   || 'C Design',
          cui:     t.prestCui    || '',
          regcom:  t.prestRegcom || '',
          adresa:  t.prestAdresa || '',
          email:   t.prestEmail  || 'office@c-design.ro',
          tel:     t.prestTel    || '',
          web:     t.prestWeb    || 'www.c-design.ro',
          iban:    t.prestIban   || '',
          banca:   t.prestBanca  || '',
          repr:    t.prestRepr   || '',
        };
        const garantie      = parseInt(t.garantie)      || 30;
        const preaviz       = parseInt(t.preaviz)       || 15;
        const ndaAni        = parseInt(t.ndaAni)        || 2;
        const penalitatiPct = parseFloat(t.penalitatiPct) || 0.1;

        function e(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
        function fmtDate(d) {
          if (!d) return '___________';
          const dt = new Date(d);
          return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        }
        const avansVal = (c.total * c.avansPct / 100).toFixed(2);
        const restVal = (c.total - parseFloat(avansVal)).toFixed(2);
        const nrArt = (() => { let n = 0; return () => ++n; })();

        const serviciiRows = c.serviciiText
          ? c.serviciiText.split('\n').filter(Boolean).map(l => `<div style="padding:4px 0;border-bottom:1px solid #f0f0f0;font-size:.9rem;">${e(l)}</div>`).join('')
          : `<div style="padding:4px 0;">${e(c.obiect)}</div>`;

        const html = `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Contract ${e(c.numar)} – C Design</title>
<style>
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Times New Roman',Times,serif;background:#fff;color:#111;font-size:13px;line-height:1.6;}
  .page{max-width:800px;margin:0 auto;padding:50px 48px;}
  .header{text-align:center;margin-bottom:36px;padding-bottom:20px;border-bottom:2px solid #111;}
  .logo{font-family:Arial,sans-serif;font-size:1.3rem;font-weight:800;letter-spacing:.05em;}
  .logo span{color:#007070;}
  .logo-sub{font-size:.75rem;color:#555;margin-top:2px;}
  .contract-title{font-size:1.3rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin:20px 0 6px;}
  .contract-nr{font-size:.95rem;color:#333;}
  .art{margin-bottom:20px;}
  .art-title{font-weight:700;font-size:.95rem;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;padding:6px 0;border-bottom:1px solid #ddd;}
  .art-body{font-size:.9rem;color:#222;line-height:1.7;}
  .art-body p{margin-bottom:6px;}
  .art-body ul{margin:6px 0 6px 20px;}
  .art-body li{margin-bottom:4px;}
  .parties-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin:12px 0;}
  .party-box{background:#f8f8f8;border:1px solid #ddd;border-radius:4px;padding:14px 16px;}
  .party-label{font-weight:700;font-size:.75rem;text-transform:uppercase;letter-spacing:.08em;color:#555;margin-bottom:8px;}
  .party-name{font-weight:700;font-size:1rem;color:#111;}
  .party-detail{font-size:.85rem;color:#444;margin-top:3px;}
  .highlight{background:#f0fafa;border-left:3px solid #007070;padding:10px 14px;margin:10px 0;border-radius:0 4px 4px 0;}
  .svc-box{background:#f8f8f8;border:1px solid #e0e0e0;border-radius:4px;padding:12px 16px;margin:10px 0;}
  .total-box{background:#e8f5f5;border:1px solid #007070;border-radius:4px;padding:12px 16px;margin:10px 0;display:flex;justify-content:space-between;align-items:center;}
  .total-label{font-weight:700;}
  .total-val{font-size:1.1rem;font-weight:700;color:#007070;}
  .signatures{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:48px;}
  .sig-block{text-align:center;}
  .sig-label{font-weight:700;font-size:.8rem;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;}
  .sig-name{font-size:.85rem;color:#333;margin-bottom:40px;}
  .sig-line{border-top:1px solid #333;padding-top:6px;font-size:.75rem;color:#888;}
  .print-btn{position:fixed;bottom:28px;right:28px;background:#007070;color:#fff;font-weight:700;font-size:.9rem;padding:11px 22px;border-radius:8px;border:none;cursor:pointer;font-family:Arial,sans-serif;box-shadow:0 4px 14px rgba(0,112,112,.4);}
  @media print{
    .print-btn{display:none;}
    body{font-size:11px;}
    .page{padding:0;}
    @page{margin:2cm;}
  }
</style>
</head>
<body>
<div class="page">

  <!-- HEADER -->
  <div class="header">
    <div class="logo">${e(prest.nume)}</div>
    <div class="logo-sub">${prest.web ? e(prest.web) + ' | ' : ''}${prest.email ? e(prest.email) : ''}${prest.tel ? ' | ' + e(prest.tel) : ''}</div>
    <div class="contract-title">Services Agreement</div>
    <div class="contract-nr">No. <strong>${e(c.numar)}</strong> / Date: <strong>${fmtDate(c.dataSemnare)}</strong></div>
  </div>

  <!-- ART. 1 — PARTIES -->
  <div class="art">
    <div class="art-title">Art. ${nrArt()} — Contracting parties</div>
    <div class="art-body">
      <div class="parties-grid">
        <div class="party-box">
          <div class="party-label">Service provider</div>
          <div class="party-name">${e(prest.nume)}</div>
          ${prest.cui ? `<div class="party-detail">CUI: ${e(prest.cui)}</div>` : ''}
          ${prest.regcom ? `<div class="party-detail">Reg.Com.: ${e(prest.regcom)}</div>` : ''}
          ${prest.adresa ? `<div class="party-detail">${e(prest.adresa)}</div>` : ''}
          ${prest.email ? `<div class="party-detail">${e(prest.email)}</div>` : ''}
          ${prest.tel ? `<div class="party-detail">${e(prest.tel)}</div>` : ''}
          ${prest.web ? `<div class="party-detail">${e(prest.web)}</div>` : ''}
          ${prest.iban ? `<div class="party-detail">IBAN: ${e(prest.iban)}${prest.banca ? ' · ' + e(prest.banca) : ''}</div>` : ''}
          ${prest.repr ? `<div class="party-detail">Representative: ${e(prest.repr)}</div>` : ''}
        </div>
        <div class="party-box">
          <div class="party-label">Client</div>
          <div class="party-name">${e(c.client.name)}</div>
          ${c.client.cui ? `<div class="party-detail">CUI/CNP: ${e(c.client.cui)}</div>` : ''}
          ${c.client.adresa ? `<div class="party-detail">${e(c.client.adresa)}</div>` : ''}
          ${c.client.email ? `<div class="party-detail">${e(c.client.email)}</div>` : ''}
        </div>
      </div>
      <p>The parties have agreed to enter into this services agreement under the following terms and conditions:</p>
    </div>
  </div>

  <!-- ART. 2 — SUBJECT MATTER -->
  <div class="art">
    <div class="art-title">Art. ${nrArt()} — Subject matter of the contract</div>
    <div class="art-body">
      <p>The service provider undertakes to perform the following services for the client:</p>
      <div class="highlight"><strong>${e(c.obiect)}</strong></div>
      ${c.serviciiText ? `<div class="svc-box">${serviciiRows}</div>` : ''}
    </div>
  </div>

  <!-- ART. 3 — DURATION -->
  <div class="art">
    <div class="art-title">Art. ${nrArt()} — Duration and delivery schedule</div>
    <div class="art-body">
      <p>This agreement enters into force on the date of signature by both parties and remains valid until the completion and acceptance of all services specified in Art. 2.</p>
      <p>The delivery timeline for the services is <strong>${e(c.termen)} ${e(c.termenUnit)}</strong>, calculated from the date the deposit specified in Art. 4 is received.</p>
      <p>The timeline may be extended by written agreement of both parties or in cases of force majeure.</p>
    </div>
  </div>

  <!-- ART. 4 — PRICE -->
  <div class="art">
    <div class="art-title">Art. ${nrArt()} — Price and payment terms</div>
    <div class="art-body">
      <div class="total-box">
        <span class="total-label">Total contract value:</span>
        <span class="total-val">${c.total.toLocaleString('en-GB')} ${e(c.moneda)}</span>
      </div>
      <ul>
        <li>Deposit (<strong>${c.avansPct}%</strong>): <strong>${parseFloat(avansVal).toLocaleString('en-GB')} ${e(c.moneda)}</strong> — payable upon signing the contract, as a condition for commencing work.</li>
        <li>Balance (<strong>${(100 - c.avansPct)}%</strong>): <strong>${parseFloat(restVal).toLocaleString('en-GB')} ${e(c.moneda)}</strong> — payable upon final delivery and acceptance of the work.</li>
      </ul>
      <p style="margin-top:8px;">Payment shall be made by bank transfer or by any other method agreed in writing by both parties. Prices are exclusive of VAT unless otherwise stated.</p>
      ${c.clauze.penalitati ? `<p>In the event of late payment, the client shall owe late-payment penalties of <strong>${penalitatiPct}% per day</strong> on the outstanding amount, calculated from the due date.</p>` : ''}
    </div>
  </div>

  <!-- ART. 5 — PROVIDER OBLIGATIONS -->
  <div class="art">
    <div class="art-title">Art. ${nrArt()} — Obligations of the service provider</div>
    <div class="art-body">
      <ul>
        <li>To perform the services specified in Art. 2 professionally and within the agreed timeframe;</li>
        <li>To keep the client informed of progress upon request;</li>
        <li>To request from the client all necessary materials and information (copy, images, access credentials) in good time;</li>
        <li>To remedy any deficiencies identified during the warranty period of <strong>${garantie} days</strong> from final acceptance, provided they are not attributable to the client;</li>
        <li>To maintain the confidentiality of information provided by the client during the term of the contract.</li>
      </ul>
    </div>
  </div>

  <!-- ART. 6 — CLIENT OBLIGATIONS -->
  <div class="art">
    <div class="art-title">Art. ${nrArt()} — Obligations of the client</div>
    <div class="art-body">
      <ul>
        <li>To pay the deposit upon signing the contract and the balance upon final acceptance;</li>
        <li>To provide the service provider with all necessary materials (copy, images, logo, access credentials) within <strong>5 working days</strong> of request;</li>
        <li>To review and approve deliverables within <strong>5 working days</strong> of receipt; absence of a response shall be deemed tacit acceptance;</li>
        <li>Not to use the delivered work prior to full payment of the contract price.</li>
      </ul>
    </div>
  </div>

  ${c.clauze.ip ? `
  <!-- ART. IP -->
  <div class="art">
    <div class="art-title">Art. ${nrArt()} — Intellectual property rights</div>
    <div class="art-body">
      <p>All intellectual property rights in the delivered work (design, source code, graphics) transfer in full to the client upon receipt of full payment of the contract price.</p>
      <p>Until full payment is received, the service provider may use the work for portfolio and promotional purposes, unless the client expressly requests confidentiality.</p>
      <p>The service provider reserves the right to reference completed projects in its portfolio, unless there is an express confidentiality agreement.</p>
    </div>
  </div>` : ''}

  ${c.clauze.confidentialitate ? `
  <!-- ART. CONFIDENTIALITY -->
  <div class="art">
    <div class="art-title">Art. ${nrArt()} — Confidentiality</div>
    <div class="art-body">
      <p>Both parties undertake to keep confidential any information obtained in the performance of this contract that is not in the public domain and has been designated as confidential by the other party.</p>
      <p>This obligation remains in force for the duration of the contract and for <strong>${ndaAni} ${ndaAni === 1 ? 'year' : 'years'}</strong> after its termination.</p>
      <p>Information that is or becomes publicly available without fault of the disclosing party is excluded from the confidentiality obligation.</p>
    </div>
  </div>` : ''}

  <!-- ART. TERMINATION -->
  <div class="art">
    <div class="art-title">Art. ${nrArt()} — Termination</div>
    <div class="art-body">
      <p>Either party may terminate this contract with <strong>${preaviz} days</strong> notice if the other party fails to fulfil its contractual obligations and does not remedy the situation within the notice period.</p>
      <p>In the event of termination due to the client's fault, the deposit paid shall not be refunded; in the event of termination due to the service provider's fault, the provider shall refund the deposit and deliver all work completed up to the date of termination.</p>
    </div>
  </div>

  <!-- ART. FORCE MAJEURE -->
  <div class="art">
    <div class="art-title">Art. ${nrArt()} — Force majeure</div>
    <div class="art-body">
      <p>Neither party shall be liable for failure to perform its contractual obligations caused by force majeure events (natural disasters, acts of public authority, pandemics, etc.).</p>
      <p>The affected party must notify the other party within <strong>5 days</strong> of the event occurring. If force majeure continues for more than <strong>30 days</strong>, either party may terminate the contract without liability for damages.</p>
    </div>
  </div>

  <!-- ART. FINAL PROVISIONS -->
  <div class="art">
    <div class="art-title">Art. ${nrArt()} — Final provisions</div>
    <div class="art-body">
      <p>This contract is governed by Romanian law. Any dispute shall first be resolved amicably; failing that, jurisdiction lies with the courts at the service provider's registered address.</p>
      <p>Any amendment to this contract shall be made by a written addendum signed by both parties.</p>
      <p>This contract has been executed in <strong>2 (two) original copies</strong>, one for each party.</p>
    </div>
  </div>

  <!-- SIGNATURES -->
  <div class="signatures">
    <div class="sig-block">
      <div class="sig-label">Service provider</div>
      <div class="sig-name">${e(prest.nume)}${prest.repr ? '<div style="font-size:.8rem;color:#555;margin-top:2px;">' + e(prest.repr) + '</div>' : ''}</div>
      <div class="sig-line">Signature and stamp</div>
    </div>
    <div class="sig-block">
      <div class="sig-label">Client</div>
      <div class="sig-name">${e(c.client.name)}</div>
      <div class="sig-line">Signature and stamp</div>
    </div>
  </div>

</div>
<button class="print-btn" onclick="window.print()">&#x1F5A8; Print / Save as PDF</button>
</body>
</html>`;
        return new Response(html, {
          headers: { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'no-store' }
        });
      } catch { return new Response('Error generating contract', { status: 500 }); }
    }

    // SSR: injectează setările salvate în index.html pentru a evita flash-ul de conținut hardcodat
    if (path === '/' || path === '/index.html') {
      try {
        const [htmlResp, settingsRaw] = await Promise.all([
          env.ASSETS.fetch(new Request(new URL('/index.html', request.url).toString())),
          env.PROGRAMARI.get('__site_settings__')
        ]);
        if (!settingsRaw) return htmlResp;
        const settings = JSON.parse(settingsRaw);
        let html = await htmlResp.text();
        function injectText(h, id, tag, value) {
          if (!value) return h;
          const esc = value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
          return h.replace(new RegExp(`(id="${id}"[^>]*>)[\\s\\S]*?(<\\/${tag}>)`), `$1${esc}$2`);
        }
        html = injectText(html, 'hero-h1-el',        'h1', settings.heroTitle);
        html = injectText(html, 'hero-desc-el',       'p',  settings.heroDesc);
        html = injectText(html, 'servicii-heading',   'h2', settings.servicesTitle);
        html = injectText(html, 'servicii-sub-el',    'p',  settings.servicesSub);
        html = injectText(html, 'ind-heading',        'h2', settings.indTitle);
        html = injectText(html, 'ind-sub-el',         'p',  settings.indSub);
        html = injectText(html, 'proces-heading',     'h2', settings.procesTitle);
        html = injectText(html, 'proces-sub-el',      'p',  settings.procesSub);
        html = injectText(html, 'portofoliu-heading', 'h2', settings.portTitle);
        html = injectText(html, 'portofoliu-sub-el',  'p',  settings.portSub);
        html = injectText(html, 'testi-heading',      'h2', settings.testiTitle);
        html = injectText(html, 'contact-heading',    'h2', settings.contactTitle);
        return new Response(html, { headers: { ...SEC_HEADERS, 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'no-cache, no-store, must-revalidate' } });
      } catch { return env.ASSETS.fetch(request); }
    }

    // Fallthrough — servește fișierele statice cu security headers
    const assetResp = await env.ASSETS.fetch(request);
    const ct = assetResp.headers.get('Content-Type') || '';
    if (ct.includes('text/html')) {
      const newHeaders = new Headers(assetResp.headers);
      Object.entries(SEC_HEADERS).forEach(([k, v]) => newHeaders.set(k, v));
      return new Response(assetResp.body, { status: assetResp.status, headers: newHeaders });
    }
    return assetResp;
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(Promise.all([
      checkCrmDeadlines(env),
      sendGibilanMorningEmail(env),
    ]));
  },
};
