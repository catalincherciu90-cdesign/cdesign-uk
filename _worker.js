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
    author: { '@type': 'Organization', name: 'C Design', url: 'https://www.cdesigns.uk' },
    publisher: { '@type': 'Organization', name: 'C Design', url: 'https://www.cdesigns.uk' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.cdesigns.uk/blog/${post.slug}` },
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
<link rel="canonical" href="https://www.cdesigns.uk/blog/${post.slug}">
<link rel="icon" type="image/png" href="/logo-c-design.png">
<meta property="og:type" content="article">
<meta property="og:url" content="https://www.cdesigns.uk/blog/${post.slug}">
<meta property="og:title" content="${escHtml(post.title)}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="https://www.cdesigns.uk/cover.jpg">
<meta property="og:locale" content="en_GB">
<meta property="og:site_name" content="C Design">
<meta property="article:published_time" content="${post.createdAt}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escHtml(post.title)}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="https://www.cdesigns.uk/cover.jpg">
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
      <a href="/" class="logo"><img src="/logo-c-design.webp" alt="C Design" style="height:42px;width:auto;display:block;"></a>
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
          <a href="https://www.cdesigns.uk/programari.html" style="display:inline-block;background:#00c8b4;color:#000;padding:14px 32px;border-radius:8px;font-weight:700;font-size:.95rem;text-decoration:none;">
            Open CRM →
          </a>
        </div>
      </td></tr>
      <tr><td style="background:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #e5e7eb;">
        <p style="color:#9aa5b4;font-size:.8rem;margin:0;">C Design · <a href="https://www.cdesigns.uk" style="color:#00c8b4;text-decoration:none;">www.c-design.ro</a></p>
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
        <a href="https://www.cdesigns.uk/programari.html" style="display:inline-block;background:#00c8b4;color:#060f0f;padding:12px 28px;border-radius:8px;font-weight:700;font-size:.9rem;text-decoration:none;">
          Open Gibilan →
        </a>
      </td></tr>
      <!-- FOOTER -->
      <tr><td style="background:#f9fafb;padding:16px 32px;text-align:center;border-top:1px solid #eee;">
        <p style="color:#9aa5b4;font-size:.75rem;margin:0;">Gibilan · C Design · <a href="https://www.cdesigns.uk" style="color:#00a898;text-decoration:none;">c-design.ro</a></p>
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

const ALLOWED_ORIGINS = ['https://www.cdesigns.uk', 'https://c-design.ro'];

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
          <a href="https://www.cdesigns.uk/programari.html" style="display:inline-block;background:#00c8b4;color:#080b0e;font-weight:700;font-size:.9rem;padding:12px 28px;border-radius:8px;text-decoration:none;">
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
        <div style="font-size:.78rem;color:#9aa5b4;">© ${new Date().getFullYear()} C Design · <a href="https://www.cdesigns.uk" style="color:#00c8b4;text-decoration:none;">c-design.ro</a></div>
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

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(str)));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

// Append an entry to the activity log (kept to the last 200 events).
async function logActivity(env, entry) {
  try {
    const raw = await env.PROGRAMARI.get('__activity__');
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(entry);
    await env.PROGRAMARI.put('__activity__', JSON.stringify(list.slice(0, 200)));
  } catch {}
}

// Returns the authenticated identity for a request, or null.
// Accepts the master token (env secret) or a valid session token (KV).
async function getAuth(url, env) {
  const token = url.searchParams.get('token') || '';
  if (!token) return null;
  if (token === (env.ADMIN_TOKEN || ADMIN_TOKEN) && token) {
    return { username: (env.ADMIN_USER || ADMIN_USER) || 'owner', role: 'owner' };
  }
  try {
    const raw = await env.PROGRAMARI.get('__session__' + token);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (s.expires && s.expires < Date.now()) return null;
    return s;
  } catch { return null; }
}

// Sections a sub-admin can be granted access to.
const ADMIN_SECTIONS = ['bookings', 'gibilan', 'clients', 'crm', 'portfolio', 'blog', 'social', 'pages', 'media', 'theme', 'expenses', 'oferte', 'settings'];

// Authorisation: owner can do anything; sub-admins need the section in their perms.
function can(authed, section) {
  if (!authed) return false;
  if (authed.role === 'owner') return true;
  const perms = Array.isArray(authed.perms) ? authed.perms : [];
  return perms.includes(section);
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

// ── DEMO SITES ──────────────────────────────────────────────
function demoSlugify(s) {
  return String(s || 'demo').toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) || 'demo';
}

// Robustly extract a JSON object/array from a Workers AI result (shape can vary).
function parseAiJson(ai) {
  const respRaw = ai && ai.response !== undefined ? ai.response : ai;
  if (respRaw && typeof respRaw === 'object') return respRaw;
  const text = String(respRaw ?? '').trim();
  const match = text.match(/\{[\s\S]*\}/) || text.match(/\[[\s\S]*\]/);
  if (!match) return null;
  let raw = match[0], sanitized = '', inStr = false, esc = false;
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
  try { return JSON.parse(sanitized); } catch { return null; }
}

function buildDemoSite(d) {
  const e = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const hex = v => /^#[0-9a-fA-F]{3,8}$/.test(String(v || '')) ? v : null;
  const primary = hex(d.colorPrimary) || '#6366f1';
  const accent = hex(d.colorAccent) || '#f59e0b';
  const name = e(d.businessName || 'Demo Business');
  const emoji = e(d.emoji || '🌐');
  const services = (Array.isArray(d.services) ? d.services : []).slice(0, 6);
  const features = (Array.isArray(d.features) ? d.features : []).slice(0, 6);
  const t = d.testimonial && (d.testimonial.quote || d.testimonial.author) ? d.testimonial : null;
  let stats = (Array.isArray(d.stats) ? d.stats : []).filter(s => s && (s.value || s.label)).slice(0, 4);
  if (stats.length < 3) stats = [
    { value: '12+', label: 'Years of experience' },
    { value: '850+', label: 'Happy customers' },
    { value: '4.9★', label: 'Average rating' },
    { value: '100%', label: 'Satisfaction' },
  ];

  const variant = ['modern', 'dark', 'minimal', 'elegant', 'gradient', 'corporate', 'bold'].includes(d.variant) ? d.variant : 'modern';
  const imgKw = String(d.imageKeywords || d.industry || 'business').toLowerCase().replace(/[^a-z0-9, ]/g, '').slice(0, 60) || 'business';
  const img = (kw, w, h, sig) => `https://loremflickr.com/${w}/${h}/${encodeURIComponent(String(kw).trim())}?lock=${sig}`;
  const im = (d.images && typeof d.images === 'object') ? d.images : {};
  const imgTag = src => `<img class="cover" src="${String(src).replace(/"/g, '&quot;')}" alt="" loading="lazy" onerror="this.remove()">`;
  // Uploaded photo wins; otherwise a keyword stock photo over a gradient (gradient shows if it fails).
  const cover = (kw, sig, custom) => custom ? imgTag(custom) : `<img class="cover" src="${img(kw, 800, 600, sig)}" alt="" loading="lazy" onerror="this.remove()">`;

  const servicesHtml = services.map((s, i) => `
        <div class="card reveal" style="transition-delay:${i * 70}ms">
          <div class="card-ic">${e(s.icon || '✦')}</div>
          <h3>${e(s.title || '')}</h3>
          <p>${e(s.desc || '')}</p>
        </div>`).join('');

  const featuresHtml = features.map(f => `<li><span class="tick">✓</span><span>${e(typeof f === 'string' ? f : (f.title || ''))}</span></li>`).join('');

  const statsHtml = stats.map(s => `
        <div class="stat reveal">
          <div class="stat-v">${e(s.value || '')}</div>
          <div class="stat-l">${e(s.label || '')}</div>
        </div>`).join('');

  const galleryHtml = (services.length ? services : [{ title: 'Project' }, { title: 'Project' }, { title: 'Project' }])
    .slice(0, 6).map((s, i) => `
        <div class="tile reveal" style="background:linear-gradient(${135 + i * 30}deg, ${primary}, ${accent});transition-delay:${i * 60}ms">
          ${cover(imgKw + ', ' + (s.title || imgKw), 100 + i, im.gallery && im.gallery[i])}
          <span class="tile-em">${e(s.icon || emoji)}</span>
          <span class="tile-t">${e(s.title || 'Our work')}</span>
        </div>`).join('');

  const heroType = ['split', 'centered', 'image'].includes(d.heroType) ? d.heroType : 'split';
  const hBadge = `<span class="badge"><span class="dot"></span>${e(d.industry || 'Trusted local business')}</span>`;
  const hTitle = `<h1>${e(d.heroTitle || name)} <span class="hl">${e(d.heroHighlight || '')}</span></h1>`;
  const hSub = `<p>${e(d.tagline || '')}</p>`;
  const hCta = `<div class="hero-cta"><a href="#contact" class="btn">${e(d.ctaText || 'Get a free quote')} →</a><a href="#services" class="btn ghost">Explore services</a></div>`;
  const hTrust = `<div class="hero-trust"><span class="stars">★★★★★</span> Rated excellent by our customers</div>`;

  const pricing = (Array.isArray(d.pricing) ? d.pricing : []).filter(p => p && (p.name || p.price)).slice(0, 4);
  const pricingSection = pricing.length ? `
  <section id="pricing"><div class="wrap">
    <div class="sec-head"><span class="eyebrow">Pricing</span><h2>${e(d.pricingTitle || 'Simple, honest pricing')}</h2><p>${e(d.pricingIntro || 'Choose the option that fits you best.')}</p></div>
    <div class="pricing-grid">${pricing.map(pl => `
      <div class="price-card reveal ${pl.featured ? 'feat' : ''}">
        <div class="price-name">${e(pl.name || 'Plan')}</div>
        <div class="price-amt">${e(pl.price || '')} <span>${e(pl.period || '')}</span></div>
        <ul class="price-feats">${(Array.isArray(pl.features) ? pl.features : []).slice(0, 6).map(f => `<li>${e(f)}</li>`).join('')}</ul>
        <a href="#contact" class="btn" style="margin-top:auto;justify-content:center;">${e(d.ctaText || 'Get started')}</a>
      </div>`).join('')}</div>
  </div></section>` : '';

  const team = (Array.isArray(d.team) ? d.team : []).filter(m => m && m.name).slice(0, 6);
  const teamSection = team.length ? `
  <section id="team" class="about"><div class="wrap">
    <div class="sec-head"><span class="eyebrow">Our team</span><h2>${e(d.teamTitle || ('The people behind ' + (d.businessName || 'us')))}</h2></div>
    <div class="team-grid">${team.map(m => `
      <div class="team-card reveal"><div class="team-av">${e((m.emoji && String(m.emoji).trim()) || String(m.name || '?').trim().charAt(0).toUpperCase())}</div>
        <h3>${e(m.name || '')}</h3><p>${e(m.role || '')}</p></div>`).join('')}</div>
  </div></section>` : '';

  const faq = (Array.isArray(d.faq) ? d.faq : []).filter(f => f && (f.q || f.question)).slice(0, 6);
  const faqSection = faq.length ? `
  <section id="faq"><div class="wrap">
    <div class="sec-head"><span class="eyebrow">FAQ</span><h2>${e(d.faqTitle || 'Frequently asked questions')}</h2></div>
    <div class="faq-wrap">${faq.map(f => `<div class="faq-item reveal"><h3>${e(f.q || f.question || '')}</h3><p>${e(f.a || f.answer || '')}</p></div>`).join('')}</div>
  </div></section>` : '';

  const heroSection =
    heroType === 'image' ? `
  <section class="hero hero-image">
    <div class="hero-imgbg">${cover(imgKw, 1, im.hero)}</div>
    <div class="hero-ovl"></div>
    <div class="wrap hero-inner">${hBadge}${hTitle}${hSub}${hCta}${hTrust}</div>
  </section>` :
    heroType === 'centered' ? `
  <section class="hero hero-centered">
    <div class="wrap hero-inner">${hBadge}${hTitle}${hSub}${hCta}${hTrust}</div>
    <div class="wrap"><div class="hero-banner">${cover(imgKw, 1, im.hero)}</div></div>
  </section>` : `
  <section class="hero">
    <div class="wrap hero-grid">
      <div>${hBadge}${hTitle}${hSub}${hCta}${hTrust}</div>
      <div class="hero-visual">
        <div class="hero-card"><div class="hero-blob">${cover(imgKw, 1, im.hero)}${emoji}</div></div>
        <div class="float a"><span class="ic">✓</span> Trusted &amp; reliable</div>
        <div class="float b"><span class="ic">★</span> ${e((stats[2] && stats[2].value) || '4.9')} rating</div>
      </div>
    </div>
  </section>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${name} — Demo</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&family=Playfair+Display:wght@600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
<style>
  :root{--p:${primary};--a:${accent};--ink:#0f172a;--mut:#64748b;--line:#e9edf5;}
  *{margin:0;padding:0;box-sizing:border-box;}
  html{scroll-behavior:smooth;}
  body{font-family:'Inter',system-ui,sans-serif;color:var(--ink);line-height:1.65;background:#fff;-webkit-font-smoothing:antialiased;}
  a{color:inherit;text-decoration:none;}
  h1,h2,h3,.logo,.btn,.stat-v{font-family:'Plus Jakarta Sans',sans-serif;}
  .wrap{max-width:1140px;margin:0 auto;padding:0 24px;}
  .demo-bar{background:#0b1020;color:#fff;font-size:.82rem;text-align:center;padding:9px 14px;letter-spacing:.2px;}
  .demo-bar a{color:var(--a);font-weight:700;}
  header{position:sticky;top:0;z-index:30;background:rgba(255,255,255,.78);backdrop-filter:blur(14px);border-bottom:1px solid var(--line);}
  .nav{display:flex;align-items:center;justify-content:space-between;height:72px;}
  .logo{font-weight:800;font-size:1.28rem;display:flex;align-items:center;gap:10px;letter-spacing:-.3px;}
  .logo .d{width:38px;height:38px;border-radius:11px;background:linear-gradient(135deg,var(--p),var(--a));display:grid;place-items:center;color:#fff;font-size:1.15rem;box-shadow:0 6px 16px ${primary}55;}
  .nav-links{display:flex;gap:30px;font-size:.94rem;font-weight:500;color:#334155;}
  .nav-links a{position:relative;}
  .nav-links a:hover{color:var(--p);}
  .btn{display:inline-flex;align-items:center;gap:8px;background:var(--p);color:#fff;font-weight:700;padding:13px 28px;border-radius:11px;font-size:.95rem;border:none;cursor:pointer;transition:transform .18s,box-shadow .18s,filter .18s;box-shadow:0 8px 22px ${primary}40;}
  .btn:hover{filter:brightness(1.06);transform:translateY(-2px);box-shadow:0 12px 28px ${primary}55;}
  .btn.ghost{background:transparent;color:var(--ink);box-shadow:none;border:1.5px solid var(--line);}
  .btn.ghost:hover{border-color:var(--p);color:var(--p);background:#fff;}
  .btn.light{background:#fff;color:var(--p);box-shadow:0 8px 22px rgba(0,0,0,.12);}
  section{padding:88px 0;position:relative;}
  .eyebrow{display:inline-block;font-family:'Plus Jakarta Sans';font-size:.74rem;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:var(--p);background:${primary}14;padding:7px 15px;border-radius:999px;margin-bottom:18px;}
  .sec-head{text-align:center;max-width:62ch;margin:0 auto 54px;}
  .sec-head h2{font-size:clamp(1.9rem,3.8vw,2.7rem);font-weight:800;letter-spacing:-.6px;line-height:1.12;}
  .sec-head p{color:var(--mut);margin-top:14px;font-size:1.06rem;}
  /* hero */
  .hero{padding:96px 0 100px;overflow:hidden;background:
     radial-gradient(60% 70% at 12% 8%, ${primary}24, transparent 60%),
     radial-gradient(55% 65% at 92% 18%, ${accent}22, transparent 60%),
     linear-gradient(180deg,#fbfcff,#fff);}
  .hero-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:56px;align-items:center;}
  .badge{display:inline-flex;align-items:center;gap:8px;background:#fff;border:1px solid var(--line);box-shadow:0 4px 14px rgba(15,23,42,.05);font-size:.82rem;font-weight:600;color:#334155;padding:7px 15px;border-radius:999px;margin-bottom:22px;}
  .badge .dot{width:8px;height:8px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 4px #22c55e22;}
  .hero h1{font-size:clamp(2.4rem,5.2vw,3.9rem);line-height:1.04;font-weight:800;letter-spacing:-1.2px;}
  .hero h1 .hl{background:linear-gradient(120deg,var(--p),var(--a));-webkit-background-clip:text;background-clip:text;color:transparent;}
  .hero p{margin:22px 0 32px;font-size:1.18rem;color:#475569;max-width:50ch;}
  .hero-cta{display:flex;gap:14px;flex-wrap:wrap;}
  .hero-trust{margin-top:34px;display:flex;align-items:center;gap:16px;color:var(--mut);font-size:.9rem;}
  .stars{color:#f59e0b;letter-spacing:2px;font-size:1.05rem;}
  .hero-visual{position:relative;}
  .hero-card{background:#fff;border:1px solid var(--line);border-radius:26px;padding:30px;box-shadow:0 30px 70px -30px rgba(15,23,42,.4);}
  .hero-blob{aspect-ratio:1/1;border-radius:22px;background:linear-gradient(150deg,var(--p),var(--a));display:grid;place-items:center;font-size:6rem;color:#fff;position:relative;overflow:hidden;}
  .hero-blob::after{content:'';position:absolute;inset:0;background:radial-gradient(circle at 70% 25%,rgba(255,255,255,.35),transparent 45%);}
  .float{position:absolute;background:#fff;border:1px solid var(--line);box-shadow:0 14px 34px rgba(15,23,42,.14);border-radius:14px;padding:12px 16px;font-size:.85rem;font-weight:600;display:flex;align-items:center;gap:9px;}
  .float.a{top:18px;left:-22px;}
  .float.b{bottom:24px;right:-18px;}
  .float .ic{width:30px;height:30px;border-radius:8px;background:${primary}1a;color:var(--p);display:grid;place-items:center;}
  /* hero: centered */
  .hero-centered{text-align:center;}
  .hero-centered .hero-inner{max-width:760px;margin:0 auto;}
  .hero-centered .hero-cta,.hero-centered .hero-trust{justify-content:center;}
  .hero-centered .hero p{margin-left:auto;margin-right:auto;}
  .hero-banner{aspect-ratio:16/9;border-radius:24px;margin-top:46px;background:linear-gradient(150deg,var(--p),var(--a));position:relative;overflow:hidden;box-shadow:0 30px 70px -30px rgba(15,23,42,.4);}
  /* hero: full image */
  .hero-image{color:#fff;padding:118px 0;}
  .hero-image .hero-imgbg{position:absolute;inset:0;z-index:0;background:linear-gradient(150deg,var(--p),var(--a));}
  .hero-image .hero-ovl{position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,rgba(8,11,20,.5),rgba(8,11,20,.8));}
  .hero-image .hero-inner{position:relative;z-index:2;text-align:center;max-width:820px;margin:0 auto;}
  .hero-image h1{color:#fff;}
  .hero-image .hero p,.hero-image p{color:#e2e8f0;margin-left:auto;margin-right:auto;}
  .hero-image .badge{background:rgba(255,255,255,.14);border-color:rgba(255,255,255,.3);color:#fff;}
  .hero-image .hero-cta,.hero-image .hero-trust{justify-content:center;}
  .hero-image .hero-trust{color:#cbd5e1;}
  .hero-image .btn.ghost{color:#fff;border-color:rgba(255,255,255,.5);}
  .hero-image .btn.ghost:hover{background:rgba(255,255,255,.12);border-color:#fff;color:#fff;}
  /* stats */
  .stats-band{background:var(--ink);color:#fff;padding:48px 0;}
  .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;text-align:center;}
  .stat-v{font-size:clamp(1.9rem,4vw,2.7rem);font-weight:800;letter-spacing:-.5px;background:linear-gradient(120deg,#fff,${accent});-webkit-background-clip:text;background-clip:text;color:transparent;}
  .stat-l{color:#94a3b8;font-size:.92rem;margin-top:4px;}
  /* services */
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:24px;}
  .card{background:#fff;border:1px solid var(--line);border-radius:20px;padding:32px;transition:transform .2s,box-shadow .2s,border-color .2s;}
  .card:hover{transform:translateY(-6px);box-shadow:0 24px 48px -22px rgba(15,23,42,.3);border-color:${primary}55;}
  .card-ic{width:56px;height:56px;border-radius:15px;background:linear-gradient(135deg,${primary}1a,${accent}1a);color:var(--p);display:grid;place-items:center;font-size:1.7rem;margin-bottom:18px;}
  .card h3{font-size:1.16rem;margin-bottom:9px;font-weight:700;}
  .card p{color:var(--mut);font-size:.96rem;}
  /* about */
  .about{background:linear-gradient(180deg,#f8faff,#fff);}
  .about-grid{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center;}
  .about h2{font-size:clamp(1.9rem,3.6vw,2.6rem);font-weight:800;letter-spacing:-.6px;line-height:1.12;}
  .about>.about-grid>div>p{color:#475569;margin-top:16px;font-size:1.05rem;}
  .feat{list-style:none;margin-top:26px;display:grid;gap:14px;}
  .feat li{display:flex;align-items:flex-start;gap:12px;font-weight:500;}
  .tick{display:inline-grid;place-items:center;width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,var(--p),var(--a));color:#fff;font-size:.72rem;flex-shrink:0;margin-top:3px;}
  .about-visual{aspect-ratio:4/5;border-radius:26px;background:linear-gradient(150deg,var(--p),var(--a));display:grid;place-items:center;font-size:6.5rem;color:#fff;box-shadow:0 30px 60px -28px ${primary}99;position:relative;overflow:hidden;}
  .about-visual::after{content:'';position:absolute;inset:0;background:radial-gradient(circle at 30% 20%,rgba(255,255,255,.3),transparent 50%);}
  /* gallery */
  .tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px;}
  .tile{aspect-ratio:4/3;border-radius:20px;display:flex;flex-direction:column;justify-content:flex-end;padding:22px;color:#fff;position:relative;overflow:hidden;box-shadow:0 16px 36px -20px rgba(15,23,42,.5);transition:transform .2s;}
  .tile:hover{transform:scale(1.02);}
  .tile::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(0,0,0,.35));}
  .tile-em{position:absolute;top:18px;left:20px;font-size:2rem;z-index:1;}
  .tile-t{position:relative;z-index:1;font-family:'Plus Jakarta Sans';font-weight:700;font-size:1.05rem;}
  /* testimonial */
  .quote-sec{background:linear-gradient(180deg,#fff,#f8faff);}
  .quote{max-width:820px;margin:0 auto;text-align:center;}
  .quote .mk{font-size:3.4rem;line-height:1;color:${primary}55;font-family:Georgia,serif;}
  .quote blockquote{font-family:'Plus Jakarta Sans';font-size:clamp(1.3rem,2.6vw,1.7rem);font-weight:600;line-height:1.45;letter-spacing:-.3px;margin-top:-10px;}
  .quote .who{margin-top:24px;display:flex;align-items:center;justify-content:center;gap:12px;}
  .quote .av{width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,var(--p),var(--a));display:grid;place-items:center;color:#fff;font-weight:700;}
  .quote .who b{display:block;font-weight:700;}
  .quote .who span{color:var(--mut);font-size:.88rem;}
  /* contact */
  .contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:stretch;}
  .info-card{background:linear-gradient(150deg,var(--p),var(--a));color:#fff;border-radius:24px;padding:40px;display:flex;flex-direction:column;gap:18px;}
  .info-card h3{font-size:1.5rem;font-weight:800;}
  .info-card .row{display:flex;align-items:center;gap:13px;font-size:.98rem;}
  .info-card .row .ic{width:42px;height:42px;border-radius:11px;background:rgba(255,255,255,.18);display:grid;place-items:center;font-size:1.1rem;flex-shrink:0;}
  form{background:#fff;border:1px solid var(--line);border-radius:24px;padding:36px;box-shadow:0 20px 50px -30px rgba(15,23,42,.3);}
  .field{margin-bottom:16px;}
  .field label{display:block;font-size:.82rem;font-weight:600;color:#334155;margin-bottom:6px;}
  .field input,.field textarea{width:100%;border:1.5px solid var(--line);border-radius:11px;padding:12px 14px;font:inherit;color:var(--ink);transition:border-color .15s;background:#fcfdff;}
  .field input:focus,.field textarea:focus{outline:none;border-color:var(--p);}
  /* footer */
  footer{background:#0b1020;color:#9aa6bd;padding:56px 0 30px;font-size:.92rem;}
  .foot-top{display:flex;flex-wrap:wrap;justify-content:space-between;gap:24px;padding-bottom:28px;border-bottom:1px solid rgba(255,255,255,.08);}
  .foot .c{color:#fff;font-weight:800;font-family:'Plus Jakarta Sans';font-size:1.2rem;display:flex;align-items:center;gap:9px;}
  .foot-bottom{padding-top:22px;display:flex;flex-wrap:wrap;gap:10px;justify-content:space-between;align-items:center;font-size:.84rem;}
  .foot-bottom a{color:var(--a);font-weight:700;}
  .reveal{opacity:0;transform:translateY(22px);transition:opacity .7s cubic-bezier(.2,.7,.2,1),transform .7s cubic-bezier(.2,.7,.2,1);}
  .reveal.in{opacity:1;transform:none;}
  @media(max-width:880px){
    .hero-grid,.about-grid,.contact-grid{grid-template-columns:1fr;}
    .hero-visual{order:-1;}
    .stats-grid{grid-template-columns:repeat(2,1fr);gap:30px 20px;}
    .nav-links{display:none;}
    section{padding:64px 0;}
  }
  /* real photos layered over the gradient placeholders (gradient shows if a photo fails) */
  .cover{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;border:0;}
  .hero-blob .cover,.about-visual .cover{border-radius:22px;}
  .tile .cover{z-index:0;}
  .tile::after{z-index:1;}
  .tile .tile-em,.tile .tile-t{z-index:2;}

  /* ── VARIANT: DARK ── */
  .v-dark{background:#0a0e1a;--ink:#e8edf7;--mut:#94a3b8;--line:rgba(255,255,255,.1);}
  .v-dark header{background:rgba(10,14,26,.82);border-bottom-color:rgba(255,255,255,.08);}
  .v-dark .nav-links{color:#cbd5e1;}
  .v-dark .hero{background:radial-gradient(60% 70% at 12% 8%,${primary}38,transparent 60%),radial-gradient(55% 65% at 92% 18%,${accent}30,transparent 60%),#0a0e1a;}
  .v-dark .badge{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.12);color:#cbd5e1;}
  .v-dark .hero p{color:#9aa6bd;}
  .v-dark .hero-card{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.1);}
  .v-dark .btn.ghost{color:#e8edf7;border-color:rgba(255,255,255,.18);}
  .v-dark .btn.ghost:hover{background:rgba(255,255,255,.05);}
  .v-dark .card{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.09);}
  .v-dark .card p{color:#9aa6bd;}
  .v-dark .about{background:linear-gradient(180deg,#0a0e1a,#0d1322);}
  .v-dark .about>.about-grid>div>p{color:#9aa6bd;}
  .v-dark #services,.v-dark #work,.v-dark #contact{background:#0a0e1a;}
  .v-dark .stats-band{background:#05080f;}
  .v-dark .quote-sec{background:linear-gradient(180deg,#0d1322,#0a0e1a);}
  .v-dark .float{background:#121829;border-color:rgba(255,255,255,.12);color:#e8edf7;}
  .v-dark form{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.1);}
  .v-dark .field input,.v-dark .field textarea{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.14);color:#e8edf7;}
  .v-dark .field label{color:#cbd5e1;}

  /* ── VARIANT: MINIMAL ── */
  .v-minimal .hero{background:#fff;}
  .v-minimal .badge,.v-minimal .eyebrow{background:transparent;border:1px solid var(--line);color:var(--mut);box-shadow:none;}
  .v-minimal .hero h1 .hl{background:none;color:var(--ink);-webkit-text-fill-color:var(--ink);}
  .v-minimal .btn{box-shadow:none;border-radius:7px;background:var(--ink);}
  .v-minimal .btn:hover{box-shadow:none;filter:none;background:#000;}
  .v-minimal .logo .d{box-shadow:none;background:var(--ink);}
  .v-minimal .card{box-shadow:none;border-radius:10px;}
  .v-minimal .card:hover{box-shadow:none;transform:none;border-color:var(--ink);}
  .v-minimal .card-ic{background:#f4f5f7;border-radius:10px;color:var(--ink);}
  .v-minimal .stats-band{background:#fff;color:var(--ink);border-top:1px solid var(--line);border-bottom:1px solid var(--line);}
  .v-minimal .stat-v{background:none;color:var(--ink);-webkit-text-fill-color:var(--ink);}
  .v-minimal .stat-l{color:var(--mut);}
  .v-minimal .about{background:#fff;}
  .v-minimal .info-card{background:var(--ink);}
  .v-minimal .tile{border-radius:10px;}

  /* ── VARIANT: ELEGANT ── */
  .v-elegant{background:#fbf8f3;--ink:#2a2320;--mut:#6b5d52;--line:#ece3d6;}
  .v-elegant h1,.v-elegant h2,.v-elegant h3,.v-elegant .quote blockquote,.v-elegant .logo,.v-elegant .stat-v{font-family:'Playfair Display',Georgia,serif;letter-spacing:0;}
  .v-elegant header{background:rgba(251,248,243,.84);border-bottom-color:#ece3d6;}
  .v-elegant .hero{background:radial-gradient(60% 70% at 12% 8%,${primary}22,transparent 60%),radial-gradient(55% 65% at 92% 18%,${accent}1e,transparent 60%),#fbf8f3;}
  .v-elegant .badge{background:#fff;border-color:#ece3d6;}
  .v-elegant .eyebrow{background:${primary}16;letter-spacing:2px;}
  .v-elegant .btn{border-radius:3px;}
  .v-elegant .card,.v-elegant form{border-radius:6px;background:#fffdfa;border-color:#ece3d6;}
  .v-elegant .card-ic{border-radius:8px;}
  .v-elegant .about{background:linear-gradient(180deg,#f6efe4,#fbf8f3);}
  .v-elegant .stats-band{background:#2a2320;}
  .v-elegant .quote-sec{background:linear-gradient(180deg,#fbf8f3,#f6efe4);}

  /* ── VARIANT: GRADIENT ── */
  .v-gradient .hero{background:linear-gradient(135deg,${primary}26,${accent}1f 55%,#fff);}
  .v-gradient header{background:rgba(255,255,255,.72);}
  .v-gradient .btn{background:linear-gradient(120deg,var(--p),var(--a));}
  .v-gradient .eyebrow{background:linear-gradient(120deg,${primary}22,${accent}22);}
  .v-gradient .card,.v-gradient form,.v-gradient .price-card{border-radius:20px;}
  .v-gradient .card-ic{background:linear-gradient(135deg,var(--p),var(--a));color:#fff;}
  .v-gradient .stats-band{background:linear-gradient(120deg,var(--p),var(--a));}
  .v-gradient .stat-v{background:#fff;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:#fff;}
  .v-gradient .about{background:linear-gradient(180deg,${primary}0e,#fff);}

  /* ── VARIANT: CORPORATE ── */
  .v-corporate .hero{background:linear-gradient(180deg,#f4f7fb,#fff);}
  .v-corporate .badge,.v-corporate .eyebrow,.v-corporate .btn,.v-corporate .card,.v-corporate .card-ic,.v-corporate form,.v-corporate .price-card{border-radius:5px;}
  .v-corporate .card{border-top:3px solid var(--p);}
  .v-corporate .stats-band{background:#0f1f3d;}
  .v-corporate .about{background:#f4f7fb;}
  .v-corporate .info-card{border-radius:8px;}

  /* ── VARIANT: BOLD ── */
  .v-bold h1{font-weight:800;letter-spacing:-1.6px;}
  .v-bold .hero{background:${accent}14;}
  .v-bold .badge,.v-bold .eyebrow{border-radius:0;}
  .v-bold .btn{border-radius:0;background:var(--ink);box-shadow:none;}
  .v-bold .btn:hover{background:var(--p);transform:translateY(-2px);}
  .v-bold .logo .d{border-radius:0;}
  .v-bold .card,.v-bold form,.v-bold .price-card{border:2px solid var(--ink);border-radius:0;box-shadow:6px 6px 0 ${primary}30;}
  .v-bold .card:hover{box-shadow:10px 10px 0 ${primary}55;transform:translate(-2px,-2px);}
  .v-bold .card-ic{border-radius:0;background:var(--p);color:#fff;}
  .v-bold .stats-band{background:var(--p);}
  .v-bold .stat-v{background:#fff;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:#fff;}

  /* ── EXTRA SECTIONS: pricing / team / faq ── */
  .pricing-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:22px;}
  .price-card{background:#fff;border:1px solid var(--line);border-radius:18px;padding:30px 26px;display:flex;flex-direction:column;text-align:center;position:relative;}
  .price-card.feat{border-color:var(--p);box-shadow:0 22px 48px -26px ${primary}99;}
  .price-card.feat::before{content:'Most popular';position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--p);color:#fff;font-size:.66rem;font-weight:700;letter-spacing:.4px;padding:5px 13px;border-radius:999px;white-space:nowrap;}
  .price-name{font-weight:700;font-size:1.12rem;}
  .price-amt{font-family:'Plus Jakarta Sans';font-size:2.3rem;font-weight:800;margin:10px 0 6px;letter-spacing:-1px;}
  .price-amt span{font-size:.85rem;color:var(--mut);font-weight:500;letter-spacing:0;}
  .price-feats{list-style:none;text-align:left;margin:16px 0 22px;display:grid;gap:10px;}
  .price-feats li{display:flex;gap:9px;font-size:.9rem;color:var(--mut);}
  .price-feats li::before{content:'✓';color:var(--p);font-weight:800;}
  .team-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:24px;}
  .team-card{text-align:center;}
  .team-av{width:96px;height:96px;border-radius:50%;margin:0 auto 14px;background:linear-gradient(135deg,var(--p),var(--a));display:grid;place-items:center;color:#fff;font-size:2.1rem;font-weight:700;box-shadow:0 14px 30px -14px ${primary}99;}
  .team-card h3{font-size:1.05rem;margin-bottom:3px;}
  .team-card p{color:var(--mut);font-size:.85rem;}
  .faq-wrap{max-width:780px;margin:0 auto;display:grid;gap:12px;}
  .faq-item{border:1px solid var(--line);border-radius:14px;padding:18px 22px;background:#fff;}
  .faq-item h3{font-size:1.02rem;margin-bottom:7px;}
  .faq-item p{color:var(--mut);font-size:.92rem;}
</style>
</head>
<body class="v-${variant}">
  <div class="demo-bar">✨ Demo website — built by <a href="https://www.cdesigns.uk" target="_blank" rel="noopener">C Design</a>. Want one like this? <a href="https://www.cdesigns.uk/programari.html" target="_blank" rel="noopener">Get yours →</a></div>

  <header>
    <div class="wrap nav">
      <div class="logo"><span class="d">${emoji}</span>${name}</div>
      <nav class="nav-links">
        <a href="#services">Services</a>
        <a href="#about">About</a>
        <a href="#work">Our work</a>
        <a href="#contact">Contact</a>
      </nav>
      <a href="#contact" class="btn">${e(d.ctaText || 'Get in touch')}</a>
    </div>
  </header>

${heroSection}

  <div class="stats-band">
    <div class="wrap stats-grid">${statsHtml}</div>
  </div>

  ${services.length ? `<section id="services">
    <div class="wrap">
      <div class="sec-head"><span class="eyebrow">What we do</span><h2>Services built around your needs</h2><p>${e(d.servicesIntro || 'Everything you need, delivered with care and quality.')}</p></div>
      <div class="grid">${servicesHtml}</div>
    </div>
  </section>` : ''}

  <section id="about" class="about">
    <div class="wrap about-grid">
      <div>
        <span class="eyebrow">About us</span>
        <h2>Why people choose ${name}</h2>
        <p>${e(d.about || '')}</p>
        ${featuresHtml ? `<ul class="feat">${featuresHtml}</ul>` : ''}
      </div>
      <div class="about-visual">${cover(imgKw + ', workplace', 2, im.about)}${emoji}</div>
    </div>
  </section>

  <section id="work">
    <div class="wrap">
      <div class="sec-head"><span class="eyebrow">Our work</span><h2>A glimpse of what we deliver</h2><p>Quality you can see in every project.</p></div>
      <div class="tiles">${galleryHtml}</div>
    </div>
  </section>
${pricingSection}
${teamSection}
  ${t ? `<section class="quote-sec">
    <div class="wrap quote">
      <div class="mk">&ldquo;</div>
      <blockquote>${e(t.quote || '')}</blockquote>
      <div class="who reveal">
        <span class="av">${e((t.author || 'C')[0])}</span>
        <span style="text-align:left;"><b>${e(t.author || 'Happy client')}</b><span>Verified customer</span></span>
      </div>
    </div>
  </section>` : ''}
${faqSection}
  <section id="contact">
    <div class="wrap">
      <div class="sec-head"><span class="eyebrow">Get in touch</span><h2>${e(d.ctaHeadline || 'Let\'s work together')}</h2><p>${e(d.ctaText || 'Tell us about your project and we\'ll get back to you fast.')}</p></div>
      <div class="contact-grid">
        <div class="info-card reveal">
          <h3>Contact details</h3>
          <p style="opacity:.92;">We'd love to hear from you. Reach out and we'll reply within one business day.</p>
          ${d.phone ? `<div class="row"><span class="ic">📞</span>${e(d.phone)}</div>` : ''}
          ${d.email ? `<div class="row"><span class="ic">✉</span>${e(d.email)}</div>` : ''}
          ${d.address ? `<div class="row"><span class="ic">📍</span>${e(d.address)}</div>` : ''}
          <div class="row"><span class="ic">🕒</span>Mon–Fri · 9:00–18:00</div>
        </div>
        <form class="reveal" onsubmit="event.preventDefault();this.reset();alert('Thank you! This is a demo — on a live site your message would be sent.');">
          <div class="field"><label>Your name</label><input type="text" placeholder="Jane Smith" required></div>
          <div class="field"><label>Email</label><input type="email" placeholder="jane@email.com" required></div>
          <div class="field"><label>Message</label><textarea rows="4" placeholder="How can we help?" required></textarea></div>
          <button class="btn" type="submit" style="width:100%;justify-content:center;">Send message</button>
        </form>
      </div>
    </div>
  </section>

  <footer>
    <div class="wrap">
      <div class="foot-top">
        <div>
          <div class="c"><span>${emoji}</span>${name}</div>
          <p style="margin-top:10px;max-width:42ch;">${e(d.tagline || 'Quality service you can rely on.')}</p>
        </div>
        <div style="display:flex;gap:46px;flex-wrap:wrap;">
          <div><div style="color:#fff;font-weight:700;margin-bottom:10px;">Explore</div><a href="#services" style="display:block;margin-bottom:6px;">Services</a><a href="#about" style="display:block;margin-bottom:6px;">About</a><a href="#contact" style="display:block;">Contact</a></div>
          <div><div style="color:#fff;font-weight:700;margin-bottom:10px;">Contact</div>${d.phone ? `<div style="margin-bottom:6px;">${e(d.phone)}</div>` : ''}${d.email ? `<div style="margin-bottom:6px;">${e(d.email)}</div>` : ''}${d.address ? `<div>${e(d.address)}</div>` : ''}</div>
        </div>
      </div>
      <div class="foot-bottom">
        <span>© ${new Date().getFullYear()} ${name}. All rights reserved.</span>
        <span>Demo site · Built by <a href="https://www.cdesigns.uk">C Design</a></span>
      </div>
    </div>
  </footer>

  <script>
    (function(){
      var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});},{threshold:.12});
      document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});
    })();
  </script>
</body>
</html>`;
}

// ── Online shop / catalogue demo layout (multi-banner storefront) ──
function buildShopSite(d) {
  const e = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const hex = v => /^#[0-9a-fA-F]{3,8}$/.test(String(v || '')) ? v : null;
  const primary = hex(d.colorPrimary) || '#1e3a8a';
  const accent = hex(d.colorAccent) || '#f59e0b';
  const name = e(d.businessName || 'Demo Store');
  const emoji = e(d.emoji || '🛒');
  const kw = String(d.imageKeywords || d.industry || 'cars').toLowerCase().replace(/[^a-z0-9, ]/g, '').slice(0, 60) || 'cars';
  const img = (k, w, h, sig) => `https://loremflickr.com/${w}/${h}/${encodeURIComponent(String(k).trim())}?lock=${sig}`;
  const im = (d.images && typeof d.images === 'object') ? d.images : {};
  const imgTag = src => `<img class="cover" src="${String(src).replace(/"/g, '&quot;')}" alt="" loading="lazy" onerror="this.remove()">`;
  const cover = (k, sig) => `<img class="cover" src="${img(k, 800, 600, sig)}" alt="" loading="lazy" onerror="this.remove()">`;
  const cover2 = (custom, k, sig) => custom ? imgTag(custom) : cover(k, sig);

  let banners = (Array.isArray(d.banners) ? d.banners : []).filter(b => b && (b.title || b.subtitle)).slice(0, 4);
  if (!banners.length) banners = [{ title: d.heroTitle || ('Welcome to ' + (d.businessName || 'our store')), subtitle: d.tagline || '', cta: d.ctaText || 'Browse stock' }];
  let categories = (Array.isArray(d.categories) ? d.categories : []).filter(c => c && c.name).slice(0, 8);
  let products = (Array.isArray(d.products) ? d.products : []).filter(p => p && p.name).slice(0, 12);
  const promo = d.promo && (d.promo.title || d.promo.subtitle) ? d.promo : null;
  const stats = (Array.isArray(d.stats) ? d.stats : []).filter(s => s && (s.value || s.label)).slice(0, 4);

  const slides = banners.map((b, i) => `
        <div class="slide ${i === 0 ? 'on' : ''}">
          ${cover2(im.banners && im.banners[i], kw + ', ' + (b.title || kw), 10 + i)}<div class="ov"></div>
          <div class="bc"><h2>${e(b.title || '')}</h2><p>${e(b.subtitle || '')}</p><a href="#shop" class="btn">${e(b.cta || 'Shop now')} →</a></div>
        </div>`).join('');
  const dots = banners.length > 1 ? `<div class="bdots">${banners.map((b, i) => `<span class="bdot ${i === 0 ? 'on' : ''}" data-i="${i}"></span>`).join('')}</div>` : '';

  const mini = [{ b: banners[1], idx: 1 }, { b: banners[2], idx: 2 }].filter(x => x.b);
  const miniHtml = (mini.length ? mini : categories.slice(0, 2).map((c, i) => ({ b: { title: c.name, cta: 'View' }, idx: i }))).slice(0, 2).map(({ b, idx }) => `
        <div class="mini">${cover2(im.banners && im.banners[idx], kw + ', ' + (b.title || kw), 30 + idx)}<div class="ov"></div><div class="mc"><h3>${e(b.title || '')}</h3><a href="#shop" style="color:#fff;font-weight:700;font-size:.85rem;">${e(b.cta || 'View')} →</a></div></div>`).join('');

  const catsHtml = categories.map((c, i) => `
        <a href="#shop" class="cat"><span class="ce">${e(c.emoji || '🏷️')}</span><div><b>${e(c.name || '')}</b><span>${e(c.count ? c.count + ' listings' : 'Browse')}</span></div></a>`).join('');

  const prodHtml = products.map((p, i) => `
        <div class="prod">
          <div class="prod-img">${cover2(im.products && im.products[i], kw + ', ' + (p.name || p.category || kw), 100 + i)}${p.badge ? `<span class="prod-badge">${e(p.badge)}</span>` : ''}</div>
          <div class="prod-b">
            <div class="prod-cat">${e(p.category || d.industry || '')}</div>
            <div class="prod-name">${e(p.name || '')}</div>
            <div class="prod-price">${e(p.price || '')}${p.oldPrice ? ` <s>${e(p.oldPrice)}</s>` : ''}</div>
            <a href="#contact" class="btn">View details</a>
          </div>
        </div>`).join('');

  const statsHtml = stats.length ? `<div class="stripe"><div class="wrap sgrid">${stats.map(s => `<div><div class="sv">${e(s.value || '')}</div><div class="sl">${e(s.label || '')}</div></div>`).join('')}</div></div>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${name} — Demo store</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  :root{--p:${primary};--a:${accent};--ink:#0f172a;--mut:#64748b;--line:#e7ebf2;}
  *{margin:0;padding:0;box-sizing:border-box;}
  html{scroll-behavior:smooth;}
  body{font-family:'Inter',system-ui,sans-serif;color:var(--ink);background:#f7f9fc;line-height:1.6;-webkit-font-smoothing:antialiased;}
  a{text-decoration:none;color:inherit;}
  img{display:block;}
  .wrap{max-width:1200px;margin:0 auto;padding:0 22px;}
  h1,h2,h3,.logo,.btn,.sv,.prod-price{font-family:'Plus Jakarta Sans',sans-serif;}
  .demo-bar{background:#0b1020;color:#fff;font-size:.82rem;text-align:center;padding:8px 14px;}
  .demo-bar a{color:var(--a);font-weight:700;}
  .topbar{background:var(--ink);color:#cbd5e1;font-size:.78rem;}
  .topbar .wrap{display:flex;justify-content:space-between;gap:12px;padding:7px 22px;flex-wrap:wrap;}
  header{background:#fff;border-bottom:1px solid var(--line);position:sticky;top:0;z-index:30;}
  .nav{display:flex;align-items:center;gap:18px;height:68px;}
  .logo{font-weight:800;font-size:1.3rem;display:flex;align-items:center;gap:9px;}
  .logo .d{width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,var(--p),var(--a));display:grid;place-items:center;color:#fff;}
  .nav-links{display:flex;gap:22px;margin-left:14px;font-size:.92rem;font-weight:500;}
  .nav-links a:hover{color:var(--p);}
  .nav-right{margin-left:auto;display:flex;align-items:center;gap:14px;}
  .btn{display:inline-flex;align-items:center;gap:7px;background:var(--p);color:#fff;font-weight:700;padding:11px 20px;border-radius:10px;font-size:.92rem;border:none;cursor:pointer;transition:.18s;}
  .btn:hover{filter:brightness(1.08);transform:translateY(-1px);}
  .cart{position:relative;font-size:1.3rem;}
  .cart b{position:absolute;top:-6px;right:-8px;background:var(--a);color:#fff;font-size:.6rem;font-weight:800;min-width:16px;height:16px;border-radius:999px;display:grid;place-items:center;padding:0 4px;}
  section{padding:46px 0;}
  .sec-head{display:flex;align-items:flex-end;justify-content:space-between;gap:14px;margin-bottom:22px;flex-wrap:wrap;}
  .sec-head h2{font-size:clamp(1.4rem,2.6vw,2rem);font-weight:800;letter-spacing:-.5px;}
  .sec-head a{color:var(--p);font-weight:700;font-size:.88rem;}
  /* hero banners */
  .shop-hero{display:grid;grid-template-columns:2fr 1fr;gap:18px;padding-top:26px;}
  .banner{position:relative;border-radius:20px;overflow:hidden;min-height:340px;background:linear-gradient(135deg,var(--p),var(--a));}
  .slide{position:absolute;inset:0;display:none;align-items:flex-end;}
  .slide.on{display:flex;animation:fade .6s;}
  @keyframes fade{from{opacity:.3}to{opacity:1}}
  .cover{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;}
  .banner .ov{position:absolute;inset:0;z-index:1;background:linear-gradient(90deg,rgba(8,11,20,.78),rgba(8,11,20,.12));}
  .bc{position:relative;z-index:2;padding:38px;max-width:82%;color:#fff;}
  .bc h2{font-size:clamp(1.7rem,3.2vw,2.7rem);font-weight:800;color:#fff;line-height:1.08;}
  .bc p{color:#e8edf7;margin:10px 0 18px;font-size:1.05rem;}
  .bdots{position:absolute;z-index:3;bottom:18px;right:22px;display:flex;gap:7px;}
  .bdot{width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,.5);cursor:pointer;}
  .bdot.on{background:#fff;}
  .side-banners{display:grid;grid-template-rows:1fr 1fr;gap:18px;}
  .mini{position:relative;border-radius:18px;overflow:hidden;min-height:160px;display:flex;align-items:flex-end;background:linear-gradient(135deg,var(--a),var(--p));}
  .mini .ov{position:absolute;inset:0;z-index:1;background:linear-gradient(0deg,rgba(0,0,0,.55),transparent);}
  .mc{position:relative;z-index:2;padding:18px;color:#fff;}
  .mc h3{color:#fff;font-size:1.1rem;margin-bottom:4px;}
  /* categories */
  .cats{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px;}
  .cat{display:flex;align-items:center;gap:12px;padding:15px;border:1px solid var(--line);border-radius:14px;background:#fff;transition:.2s;}
  .cat:hover{border-color:var(--p);transform:translateY(-3px);box-shadow:0 16px 32px -20px rgba(0,0,0,.35);}
  .cat .ce{font-size:1.7rem;}
  .cat b{font-size:.95rem;}.cat span{font-size:.76rem;color:var(--mut);}
  /* products */
  .prod-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(225px,1fr));gap:20px;}
  .prod{background:#fff;border:1px solid var(--line);border-radius:16px;overflow:hidden;display:flex;flex-direction:column;transition:.2s;}
  .prod:hover{transform:translateY(-5px);box-shadow:0 24px 46px -26px rgba(0,0,0,.35);border-color:var(--p);}
  .prod-img{position:relative;height:165px;background:linear-gradient(135deg,var(--p),var(--a));overflow:hidden;}
  .prod-badge{position:absolute;top:10px;left:10px;z-index:2;background:var(--p);color:#fff;font-size:.64rem;font-weight:800;padding:4px 10px;border-radius:999px;text-transform:uppercase;letter-spacing:.4px;}
  .prod-b{padding:15px;display:flex;flex-direction:column;flex:1;}
  .prod-cat{font-size:.68rem;color:var(--mut);text-transform:uppercase;letter-spacing:.07em;}
  .prod-name{font-weight:700;margin:3px 0 8px;font-family:'Plus Jakarta Sans';}
  .prod-price{font-weight:800;font-size:1.3rem;color:var(--p);}
  .prod-price s{color:var(--mut);font-size:.82rem;font-weight:500;margin-left:6px;}
  .prod .btn{margin-top:12px;justify-content:center;}
  /* stripe stats */
  .stripe{background:var(--ink);color:#fff;}
  .sgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;text-align:center;padding:30px 22px;}
  .sv{font-size:clamp(1.5rem,3vw,2.1rem);font-weight:800;color:var(--a);}
  .sl{color:#94a3b8;font-size:.85rem;}
  /* promo */
  .promo{position:relative;border-radius:22px;overflow:hidden;color:#fff;background:linear-gradient(120deg,var(--p),var(--a));padding:52px 40px;text-align:center;}
  .promo .cover{opacity:.32;}
  .promo .pc{position:relative;z-index:2;}
  .promo h2{color:#fff;font-size:clamp(1.6rem,3vw,2.4rem);font-weight:800;}
  .promo p{opacity:.95;margin:10px 0 20px;}
  .promo .btn{background:#fff;color:var(--p);}
  /* contact + newsletter */
  .news{background:var(--ink);color:#fff;border-radius:20px;padding:40px;text-align:center;}
  .news h2{color:#fff;font-size:1.6rem;font-weight:800;}
  .news form{max-width:440px;margin:16px auto 0;display:flex;gap:8px;}
  .news input{flex:1;border:none;border-radius:10px;padding:13px 16px;font:inherit;}
  .contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
  .info{display:grid;gap:12px;align-content:start;}
  .info .row{display:flex;align-items:center;gap:12px;background:#fff;border:1px solid var(--line);border-radius:12px;padding:14px 16px;}
  .info .ic{width:40px;height:40px;border-radius:10px;background:var(--p);color:#fff;display:grid;place-items:center;}
  footer{background:#0b1020;color:#9aa6bd;padding:40px 0 26px;margin-top:10px;font-size:.9rem;}
  .foot{display:flex;flex-wrap:wrap;justify-content:space-between;gap:20px;padding-bottom:22px;border-bottom:1px solid rgba(255,255,255,.08);}
  .foot .c{color:#fff;font-weight:800;font-size:1.15rem;display:flex;gap:9px;align-items:center;}
  .foot-bottom{padding-top:18px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;font-size:.83rem;}
  .foot-bottom a{color:var(--a);font-weight:700;}
  @media(max-width:820px){.shop-hero{grid-template-columns:1fr;}.side-banners{grid-template-rows:none;grid-template-columns:1fr 1fr;}.sgrid{grid-template-columns:repeat(2,1fr);gap:24px 14px;}.nav-links{display:none;}.contact-grid{grid-template-columns:1fr;}}
</style>
</head>
<body>
  <div class="demo-bar">✨ Demo store — built by <a href="https://www.cdesigns.uk" target="_blank" rel="noopener">C Design</a>. Want one like this? <a href="https://www.cdesigns.uk/programari.html" target="_blank" rel="noopener">Get yours →</a></div>
  <div class="topbar"><div class="wrap"><span>🚚 ${e(d.shipNote || 'Nationwide delivery available')}</span><span>📞 ${e(d.phone || 'Call us today')}</span></div></div>
  <header>
    <div class="wrap nav">
      <div class="logo"><span class="d">${emoji}</span>${name}</div>
      <nav class="nav-links"><a href="#shop">Shop</a><a href="#categories">Categories</a><a href="#about">About</a><a href="#contact">Contact</a></nav>
      <div class="nav-right">
        <span class="cart" title="Cart">🛒<b>0</b></span>
        <a href="#contact" class="btn">Enquire</a>
      </div>
    </div>
  </header>

  <div class="wrap shop-hero">
    <div class="banner"><div class="slides">${slides}</div>${dots}</div>
    <div class="side-banners">${miniHtml}</div>
  </div>

  ${categories.length ? `<section id="categories"><div class="wrap"><div class="sec-head"><h2>Shop by category</h2><a href="#shop">View all →</a></div><div class="cats">${catsHtml}</div></div></section>` : ''}

  ${products.length ? `<section id="shop"><div class="wrap"><div class="sec-head"><h2>${e(d.productsTitle || 'Featured stock')}</h2><a href="#contact">Enquire about any item →</a></div><div class="prod-grid">${prodHtml}</div></div></section>` : ''}

  ${statsHtml}

  ${promo ? `<section><div class="wrap"><div class="promo">${cover(kw, 5)}<div class="pc"><h2>${e(promo.title || '')}</h2><p>${e(promo.subtitle || '')}</p><a href="#contact" class="btn">${e(promo.cta || 'Get in touch')} →</a></div></div></div></section>` : ''}

  ${d.about ? `<section id="about"><div class="wrap" style="max-width:820px;text-align:center;"><h2 style="font-size:clamp(1.5rem,2.6vw,2rem);font-weight:800;margin-bottom:12px;">About ${name}</h2><p style="color:var(--mut);font-size:1.05rem;">${e(d.about)}</p></div></section>` : ''}

  <section id="contact"><div class="wrap">
    <div class="sec-head"><h2>${e(d.ctaHeadline || 'Visit us or get in touch')}</h2></div>
    <div class="contact-grid">
      <div class="info">
        ${d.phone ? `<div class="row"><span class="ic">📞</span><span>${e(d.phone)}</span></div>` : ''}
        ${d.email ? `<div class="row"><span class="ic">✉</span><span>${e(d.email)}</span></div>` : ''}
        ${d.address ? `<div class="row"><span class="ic">📍</span><span>${e(d.address)}</span></div>` : ''}
        <div class="row"><span class="ic">🕒</span><span>Mon–Sat · 9:00–18:00</span></div>
      </div>
      <div class="news">
        <h2>Get our latest offers</h2>
        <p style="opacity:.9;margin-top:8px;">Join our newsletter for new arrivals and deals.</p>
        <form onsubmit="event.preventDefault();this.reset();alert('Thanks! This is a demo — on a live site you would be subscribed.');"><input type="email" placeholder="Your email" required><button class="btn" type="submit">Subscribe</button></form>
      </div>
    </div>
  </div></section>

  <footer><div class="wrap">
    <div class="foot">
      <div><div class="c"><span>${emoji}</span>${name}</div><p style="margin-top:8px;max-width:40ch;">${e(d.tagline || 'Quality you can trust.')}</p></div>
      <div style="display:flex;gap:44px;flex-wrap:wrap;">
        <div><div style="color:#fff;font-weight:700;margin-bottom:8px;">Shop</div><a href="#categories" style="display:block;margin-bottom:5px;">Categories</a><a href="#shop" style="display:block;">Featured</a></div>
        <div><div style="color:#fff;font-weight:700;margin-bottom:8px;">Contact</div>${d.phone ? `<div style="margin-bottom:5px;">${e(d.phone)}</div>` : ''}${d.email ? `<div style="margin-bottom:5px;">${e(d.email)}</div>` : ''}${d.address ? `<div>${e(d.address)}</div>` : ''}</div>
      </div>
    </div>
    <div class="foot-bottom"><span>© ${new Date().getFullYear()} ${name}. All rights reserved.</span><span>Demo store · Built by <a href="https://www.cdesigns.uk">C Design</a></span></div>
  </div></footer>

  <script>
    (function(){
      var slides=document.querySelectorAll('.slide'),dots=document.querySelectorAll('.bdot'),i=0;
      function go(n){slides.forEach(function(s,k){s.classList.toggle('on',k===n);});dots.forEach(function(dt,k){dt.classList.toggle('on',k===n);});i=n;}
      dots.forEach(function(dt){dt.addEventListener('click',function(){go(+dt.dataset.i);});});
      if(slides.length>1)setInterval(function(){go((i+1)%slides.length);},4500);
    })();
  </script>
</body>
</html>`;
}

// JSON structure spec for the demo content generator (shared by /generate and /from-sketch).
function demoJsonSpec(industry, layout) {
  return layout === 'shop' ? `This is an ONLINE SHOP / CATALOGUE website (e.g. a car dealership, auto parts shop, or similar with many items). Return ONLY a valid JSON object, no text before or after, with exactly this structure:
{
  "businessName": "an invented but realistic store name",
  "industry": "${industry}",
  "emoji": "one emoji representing the store",
  "tagline": "short store tagline, 1 sentence",
  "shipNote": "a short delivery/shipping note (e.g. 'Nationwide delivery & finance available')",
  "colorPrimary": "a hex colour fitting the brand",
  "colorAccent": "a complementary hex accent colour",
  "imageKeywords": "2-4 comma-separated English keywords for product photos, e.g. 'used cars, car dealership'",
  "banners": [ { "title": "promo banner headline", "subtitle": "1 short sentence", "cta": "button text" } ],
  "categories": [ { "name": "category name", "emoji": "an emoji", "count": 24 } ],
  "products": [ { "name": "item / model name", "category": "its category", "price": "£12,995", "oldPrice": "£14,500", "badge": "New" } ],
  "promo": { "title": "a special-offer headline", "subtitle": "1 sentence", "cta": "button text" },
  "stats": [ { "value": "500+", "label": "In stock" }, { "value": "15", "label": "Years" }, { "value": "4.9", "label": "Rating" }, { "value": "4.8k", "label": "Customers" } ],
  "about": "2-3 sentences about the store",
  "ctaHeadline": "contact section headline",
  "phone": "a plausible UK phone number",
  "email": "a plausible contact email",
  "address": "a plausible UK city / street"
}

Requirements:
- Language: ENGLISH
- Exactly 3 banners, 4-6 categories, 8-12 products
- Prices must be realistic for the industry (cars: thousands like "£12,995"; parts/accessories: tens/hundreds like "£89.99"). "oldPrice" and "badge" are optional per product.
- Realistic, not generic filler. No text outside the JSON object` : `Return ONLY a valid JSON object, no text before or after, with exactly this structure:
{
  "businessName": "an invented but realistic business name",
  "industry": "${industry}",
  "emoji": "one emoji representing the industry",
  "tagline": "short hero subtitle, 1 sentence",
  "heroTitle": "punchy hero headline, first part (max 45 chars)",
  "heroHighlight": "2-4 word phrase that completes and is highlighted in the headline",
  "servicesIntro": "one short sentence introducing the services",
  "services": [ { "icon": "emoji", "title": "service name", "desc": "1 short sentence" } ],
  "stats": [ { "value": "850+", "label": "Happy customers" }, { "value": "12+", "label": "Years experience" }, { "value": "4.9", "label": "Star rating" }, { "value": "100%", "label": "Satisfaction" } ],
  "about": "2-3 sentences about the business",
  "features": [ "short benefit", "short benefit", "short benefit", "short benefit" ],
  "testimonial": { "quote": "a short client testimonial", "author": "Client name" },
  "ctaHeadline": "call to action headline",
  "ctaText": "short call to action sentence / button text",
  "phone": "a plausible UK phone number",
  "email": "a plausible contact email matching the business name",
  "address": "a plausible UK city / street",
  "colorPrimary": "a hex colour fitting the brand, e.g. #0ea5e9",
  "colorAccent": "a complementary hex accent colour",
  "imageKeywords": "2-4 comma-separated English keywords for stock photos of this business, e.g. 'restaurant, italian food, dining'",
  "pricing": [ { "name": "plan name", "price": "£49", "period": "/mo", "features": ["short feature", "short feature", "short feature"], "featured": false } ],
  "team": [ { "name": "Full Name", "role": "job title", "emoji": "an emoji for them" } ],
  "faq": [ { "q": "a common question", "a": "a short helpful answer" } ]
}

Requirements:
- Language: ENGLISH
- 3 to 6 services in the "services" array
- Exactly 4 items in "stats" with short punchy values and labels
- 2-3 pricing plans (mark one as "featured": true), 3-4 team members, 3-5 FAQ items
- Realistic, professional, not generic filler
- Colours must be valid hex codes that look modern and good together
- No text outside the JSON object`;
}

// ── Custom uploaded demos: content types + minimal ZIP reader ──
function ctypeFor(name) {
  const ext = (String(name).split('.').pop() || '').toLowerCase();
  const m = { html:'text/html;charset=utf-8', htm:'text/html;charset=utf-8', css:'text/css;charset=utf-8', js:'text/javascript;charset=utf-8', mjs:'text/javascript;charset=utf-8', json:'application/json', svg:'image/svg+xml', png:'image/png', jpg:'image/jpeg', jpeg:'image/jpeg', gif:'image/gif', webp:'image/webp', avif:'image/avif', ico:'image/x-icon', woff:'font/woff', woff2:'font/woff2', ttf:'font/ttf', otf:'font/otf', eot:'application/vnd.ms-fontobject', txt:'text/plain;charset=utf-8', xml:'application/xml', mp4:'video/mp4', webm:'video/webm', mp3:'audio/mpeg', pdf:'application/pdf' };
  return m[ext] || 'application/octet-stream';
}

// Parse a ZIP central directory → { name: { method, compSize, localOffset } }
function zipEntries(buf) {
  const dv = new DataView(buf);
  const u8 = new Uint8Array(buf);
  let eocd = -1;
  const minI = Math.max(0, u8.length - 22 - 65536);
  for (let i = u8.length - 22; i >= minI; i--) {
    if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) return null;
  const cdCount = dv.getUint16(eocd + 10, true);
  const cdOffset = dv.getUint32(eocd + 16, true);
  const entries = {};
  let p = cdOffset;
  for (let n = 0; n < cdCount; n++) {
    if (p + 46 > u8.length || dv.getUint32(p, true) !== 0x02014b50) break;
    const method = dv.getUint16(p + 10, true);
    const compSize = dv.getUint32(p + 20, true);
    const nameLen = dv.getUint16(p + 28, true);
    const extraLen = dv.getUint16(p + 30, true);
    const commentLen = dv.getUint16(p + 32, true);
    const localOffset = dv.getUint32(p + 42, true);
    const name = new TextDecoder().decode(u8.subarray(p + 46, p + 46 + nameLen));
    entries[name] = { method, compSize, localOffset };
    p += 46 + nameLen + extraLen + commentLen;
  }
  return entries;
}

async function zipExtract(buf, entry) {
  const dv = new DataView(buf);
  const u8 = new Uint8Array(buf);
  const lo = entry.localOffset;
  if (dv.getUint32(lo, true) !== 0x04034b50) return null;
  const nameLen = dv.getUint16(lo + 26, true);
  const extraLen = dv.getUint16(lo + 28, true);
  const start = lo + 30 + nameLen + extraLen;
  const comp = u8.subarray(start, start + entry.compSize);
  if (entry.method === 0) return comp;
  if (entry.method === 8) {
    const stream = new Response(comp).body.pipeThrough(new DecompressionStream('deflate-raw'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }
  return null;
}

// Pick the best index.html in a zip and the folder prefix it lives in.
function zipFindIndex(entries) {
  const names = Object.keys(entries).filter(n => !n.endsWith('/'));
  const indexes = names.filter(n => n === 'index.html' || n.endsWith('/index.html'));
  if (!indexes.length) return null;
  indexes.sort((a, b) => a.split('/').length - b.split('/').length || a.length - b.length);
  const indexPath = indexes[0];
  const root = indexPath.slice(0, indexPath.length - 'index.html'.length);
  return { indexPath, root };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'OPTIONS') return new Response(null, { headers: getCors(request) });

    // Authenticated identity (master token or session token), or null. Used by all admin routes.
    const authed = await getAuth(url, env);

    // Activity log: record every admin write action (who changed what).
    if (authed && path.startsWith('/api/') && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)
        && path !== '/api/login' && path !== '/api/logout' && path !== '/api/activity') {
      await logActivity(env, { user: authed.username, role: authed.role, method: request.method, path, ip: request.headers.get('CF-Connecting-IP') || '', ts: Date.now() });
    }

    // Redirect non-www → www (301 permanent) pentru canonical corect
    if (url.hostname === 'c-design.ro') {
      url.hostname = 'www.c-design.ro';
      return Response.redirect(url.toString(), 301);
    }

    // ── MAINTENANCE MODE ──────────────────────────────────────
    // Skip maintenance check for: admin API, admin page, static assets, logged-in admins
    const isAdminReq = path === '/programari' || path === '/programari.html' || path.startsWith('/api/') || path.startsWith('/demo/');
    if (!isAdminReq && !authed) {
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
      return Response.redirect('https://www.cdesigns.uk' + REDIRECTS_301[path], 301);
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
        if (!post) return Response.redirect('https://www.cdesigns.uk/blog', 302);
        return new Response(renderArticle(post), {
          headers: { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'public,max-age=300' },
        });
      } catch { return Response.redirect('https://www.cdesigns.uk/blog', 302); }
    }

    // ── DEMO SITES (public) ───────────────────────────────────

    if (/^\/demo\/[^/]+(\/.*)?$/.test(path) && request.method === 'GET') {
      const rest = path.slice(6); // after "/demo/"
      const slashIdx = rest.indexOf('/');
      const slug = decodeURIComponent(slashIdx === -1 ? rest : rest.slice(0, slashIdx));
      const subPath = slashIdx === -1 ? null : rest.slice(slashIdx + 1); // null = no trailing slash
      const notFound = () => new Response('<!DOCTYPE html><meta charset="utf-8"><title>Demo not found</title><body style="font-family:system-ui;text-align:center;padding:80px 20px;color:#334155;"><h1>Demo not found</h1><p>This demo may have been removed. <a href="https://www.cdesigns.uk" style="color:#0ea5e9;">Back to C Design →</a></p></body>', { status: 404, headers: { 'Content-Type': 'text/html;charset=utf-8' } });
      try {
        const raw = await env.PROGRAMARI.get('__demos__');
        const demos = raw ? JSON.parse(raw) : [];
        const demo = demos.find(x => x.slug === slug || x.id === slug);
        if (!demo) return notFound();

        // Custom uploaded single HTML file
        if (demo.kind === 'html') {
          const html = await env.PROGRAMARI.get('__demo_html__' + demo.id);
          if (html == null) return notFound();
          return new Response(html, { headers: { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'public,max-age=120' } });
        }

        // Custom uploaded ZIP site (multi-file)
        if (demo.kind === 'zip') {
          if (subPath === null) return Response.redirect(url.origin + '/demo/' + encodeURIComponent(slug) + '/', 302);
          const zipBuf = await env.PROGRAMARI.get('__demo_zip__' + demo.id, { type: 'arrayBuffer' });
          if (!zipBuf) return notFound();
          const entries = zipEntries(zipBuf);
          if (!entries) return notFound();
          let fileName = subPath === '' ? demo.indexPath : ((demo.root || '') + decodeURIComponent(subPath));
          let entry = entries[fileName];
          if (!entry && (subPath === '' || subPath.endsWith('/'))) entry = entries[fileName + 'index.html'];
          if (!entry) return notFound();
          const bytes = await zipExtract(zipBuf, entry);
          if (!bytes) return notFound();
          return new Response(bytes, { headers: { 'Content-Type': ctypeFor(fileName), 'Cache-Control': 'public,max-age=120' } });
        }

        // AI-generated demo
        if (subPath) return notFound();
        const data = demo.data || demo;
        try {
          const imgRaw = await env.PROGRAMARI.get('__demo_img__' + demo.id);
          if (imgRaw) data.images = JSON.parse(imgRaw);
        } catch {}
        return new Response(data.layout === 'shop' ? buildShopSite(data) : buildDemoSite(data), {
          headers: { ...SEC_HEADERS, 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'public,max-age=120' }
        });
      } catch {
        return new Response('Error loading demo', { status: 500 });
      }
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
        if (s.startupValoareSep !== undefined) html = injectInner(html, 'startup-valoare-sep', `\n      Separate value: ~£${s.startupValoareSep}\n    `);
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
        let role = '';
        let perms = [];
        if (validToken && username === validUser && password === validToken) {
          role = 'owner';
        } else {
          const raw = await env.PROGRAMARI.get('__admins__');
          const admins = raw ? JSON.parse(raw) : [];
          const a = admins.find(x => x.username === username);
          if (a && a.passHash === await sha256(password)) { role = a.role || 'admin'; perms = Array.isArray(a.perms) ? a.perms : []; }
        }
        if (!role) return json({ error: 'Invalid credentials' }, 401, request);
        // Issue a session token (valid 30 days) instead of exposing the master token.
        const token = (crypto.randomUUID() + crypto.randomUUID()).replace(/-/g, '');
        const expires = Date.now() + 1000 * 60 * 60 * 24 * 30;
        await env.PROGRAMARI.put('__session__' + token, JSON.stringify({ username, role, perms, expires }), { expirationTtl: 60 * 60 * 24 * 30 });
        await logActivity(env, { user: username, role, method: 'AUTH', path: 'login', ip: request.headers.get('CF-Connecting-IP') || '', ts: Date.now() });
        return json({ success: true, token, username, role, perms }, 200, request);
      } catch { return json({ error: 'Server error' }, 500, request); }
    }

    if (path === '/api/logout' && request.method === 'POST') {
      try {
        const token = url.searchParams.get('token') || '';
        if (token && token !== (env.ADMIN_TOKEN || ADMIN_TOKEN)) await env.PROGRAMARI.delete('__session__' + token);
      } catch {}
      return json({ success: true }, 200, request);
    }

    // ── CURRENT USER ──────────────────────────────────────────

    if (path === '/api/me' && request.method === 'GET') {
      if (!authed) return json({ error: 'Unauthorised' }, 401);
      return json({
        username: authed.username, role: authed.role,
        perms: authed.role === 'owner' ? ADMIN_SECTIONS : (Array.isArray(authed.perms) ? authed.perms : []),
        sections: ADMIN_SECTIONS,
      });
    }

    if (path === '/api/activity' && request.method === 'GET') {
      if (!authed || authed.role !== 'owner') return json({ error: 'Unauthorised' }, 401);
      try {
        const raw = await env.PROGRAMARI.get('__activity__');
        return json(raw ? JSON.parse(raw) : []);
      } catch { return json([]); }
    }

    // ── ADMIN ACCOUNTS ────────────────────────────────────────

    if (path === '/api/admins' && request.method === 'GET') {
      if (!authed || authed.role !== 'owner') return json({ error: 'Unauthorised' }, 401);
      try {
        const raw = await env.PROGRAMARI.get('__admins__');
        const admins = raw ? JSON.parse(raw) : [];
        const ownerUser = (env.ADMIN_USER || ADMIN_USER) || 'owner';
        return json({
          owner: { username: ownerUser, role: 'owner' },
          you: { username: authed.username, role: authed.role },
          sections: ADMIN_SECTIONS,
          admins: admins.map(a => ({ username: a.username, role: a.role || 'admin', perms: Array.isArray(a.perms) ? a.perms : [], createdAt: a.createdAt })),
        });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path === '/api/admins' && request.method === 'POST') {
      if (!authed || authed.role !== 'owner') return json({ error: 'Unauthorised' }, 401);
      try {
        const { username, password, perms } = await request.json();
        const u = String(username || '').trim();
        const p = String(password || '');
        if (!/^[a-zA-Z0-9._-]{2,40}$/.test(u)) return json({ error: 'Username must be 2–40 chars (letters, numbers, . _ -)' }, 400);
        if (p.length < 8) return json({ error: 'Password must be at least 8 characters' }, 400);
        if (u === ((env.ADMIN_USER || ADMIN_USER) || 'owner')) return json({ error: 'That username is reserved (owner account)' }, 400);
        const cleanPerms = Array.isArray(perms) ? perms.filter(x => ADMIN_SECTIONS.includes(x)) : [];
        if (!cleanPerms.length) return json({ error: 'Select at least one permission' }, 400);
        const raw = await env.PROGRAMARI.get('__admins__');
        const admins = raw ? JSON.parse(raw) : [];
        if (admins.some(a => a.username === u)) return json({ error: 'That username already exists' }, 400);
        admins.push({ username: u, role: 'admin', perms: cleanPerms, passHash: await sha256(p), createdAt: new Date().toISOString() });
        await env.PROGRAMARI.put('__admins__', JSON.stringify(admins));
        return json({ success: true });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path.startsWith('/api/admins/') && path.endsWith('/password') && request.method === 'PUT') {
      if (!authed || authed.role !== 'owner') return json({ error: 'Unauthorised' }, 401);
      try {
        const u = decodeURIComponent(path.replace('/api/admins/', '').replace('/password', ''));
        const { password } = await request.json();
        const p = String(password || '');
        if (p.length < 8) return json({ error: 'Password must be at least 8 characters' }, 400);
        const raw = await env.PROGRAMARI.get('__admins__');
        const admins = raw ? JSON.parse(raw) : [];
        const a = admins.find(x => x.username === u);
        if (!a) return json({ error: 'Not found' }, 404);
        a.passHash = await sha256(p);
        await env.PROGRAMARI.put('__admins__', JSON.stringify(admins));
        return json({ success: true });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path.startsWith('/api/admins/') && path.endsWith('/perms') && request.method === 'PUT') {
      if (!authed || authed.role !== 'owner') return json({ error: 'Unauthorised' }, 401);
      try {
        const u = decodeURIComponent(path.replace('/api/admins/', '').replace('/perms', ''));
        const { perms } = await request.json();
        const cleanPerms = Array.isArray(perms) ? perms.filter(x => ADMIN_SECTIONS.includes(x)) : [];
        const raw = await env.PROGRAMARI.get('__admins__');
        const admins = raw ? JSON.parse(raw) : [];
        const a = admins.find(x => x.username === u);
        if (!a) return json({ error: 'Not found' }, 404);
        a.perms = cleanPerms;
        await env.PROGRAMARI.put('__admins__', JSON.stringify(admins));
        return json({ success: true });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path.startsWith('/api/admins/') && request.method === 'DELETE') {
      if (!authed || authed.role !== 'owner') return json({ error: 'Unauthorised' }, 401);
      try {
        const u = decodeURIComponent(path.replace('/api/admins/', ''));
        if (u === authed.username) return json({ error: 'You cannot delete the account you are logged in with' }, 400);
        const raw = await env.PROGRAMARI.get('__admins__');
        const admins = raw ? JSON.parse(raw) : [];
        await env.PROGRAMARI.put('__admins__', JSON.stringify(admins.filter(a => a.username !== u)));
        return json({ success: true });
      } catch { return json({ error: 'Server error' }, 500); }
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
      if (!can(authed, 'bookings')) return json({ error: 'Unauthorised' }, 401);
      try {
        const raw = await env.PROGRAMARI.get('__index__');
        const index = raw ? JSON.parse(raw) : [];
        const bookings = await Promise.all(index.map(async ({ id }) => { const r = await env.PROGRAMARI.get(id); return r ? JSON.parse(r) : null; }));
        return json(bookings.filter(Boolean));
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path.startsWith('/api/booking/') && request.method === 'PATCH') {
      if (!can(authed, 'bookings')) return json({ error: 'Unauthorised' }, 401);
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

    // ── DEMO SITES API ────────────────────────────────────────

    if (path === '/api/demos' && request.method === 'GET') {
      try {
        const raw = await env.PROGRAMARI.get('__demos__');
        const demos = raw ? JSON.parse(raw) : [];
        // Public summary only — full content is served at /demo/<slug>
        return json(demos.map(x => ({
          id: x.id, slug: x.slug, businessName: x.businessName, industry: x.industry,
          emoji: x.emoji || (x.data && x.data.emoji) || '🌐',
          tagline: x.tagline || (x.data && x.data.tagline) || '',
          variant: (x.data && x.data.variant) || 'modern', createdAt: x.createdAt,
          kind: x.kind || 'ai', layout: (x.data && x.data.layout) || 'landing',
          galleryCount: Math.min((x.data && Array.isArray(x.data.services) ? x.data.services.length : 3) || 3, 6),
          bannerCount: Math.min((x.data && Array.isArray(x.data.banners) ? x.data.banners.length : 0) || 0, 4),
          productCount: Math.min((x.data && Array.isArray(x.data.products) ? x.data.products.length : 0) || 0, 12),
        })));
      } catch { return json([]); }
    }

    if (path === '/api/demo/generate' && request.method === 'POST') {
      if (!can(authed, 'portfolio')) return json({ error: 'Unauthorised' }, 401, request);
      try {
        const body = await request.json().catch(() => ({}));
        const industry = String(body.industry || '').trim().slice(0, 60);
        const tone = String(body.tone || '').trim().slice(0, 80);
        const wantName = String(body.businessName || '').trim().slice(0, 80);
        const details = String(body.details || '').trim().slice(0, 300);
        const wantVariant = ['modern', 'dark', 'minimal', 'elegant', 'gradient', 'corporate', 'bold'].includes(body.variant) ? body.variant : '';
        const heroType = ['split', 'centered', 'image'].includes(body.heroType) ? body.heroType : 'split';
        const userPrompt = String(body.prompt || '').trim().slice(0, 400);
        const versions = Math.min(Math.max(parseInt(body.versions) || 1, 1), 4);
        const wantLayout = body.layout === 'shop' ? 'shop' : 'landing';
        if (!industry) return json({ error: 'Industry is required' }, 400, request);
        if (!env.AI) return json({ error: 'AI binding unavailable — check wrangler.toml' }, 500, request);

        const toneLine = tone ? `\nBrand tone / style: ${tone}.` : '';
        const nameLine = wantName ? `\nThe business is called "${wantName}" — use this exact name.` : '';
        const detailsLine = details ? `\nIncorporate these real details where relevant (e.g. phone, city, services): ${details}.` : '';
        const promptLine = userPrompt ? `\nExtra instructions from the user (follow them): ${userPrompt}.` : '';
        const intro = `You are a web copywriter and brand designer. ${wantName ? `Write the content for "${wantName}", a business in the "${industry}" industry (UK market).` : `Invent a realistic ${wantLayout === 'shop' ? 'shop / dealership' : 'small business'} in the "${industry}" industry (UK market).`}${toneLine}${nameLine}${detailsLine}${promptLine}`;

        const prompt = intro + '\n\n' + demoJsonSpec(industry, wantLayout);

        const ai = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 2048,
        });

        const parsed = parseAiJson(ai);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed) || !parsed.businessName) {
          return json({ error: 'The model did not return a valid site. Please try again.' }, 500, request);
        }
        parsed.industry = parsed.industry || industry;
        if (wantName) parsed.businessName = wantName;
        parsed.heroType = heroType;
        parsed.layout = wantLayout;

        // Visual variant: explicit choice wins, else map from tone, else random.
        const ALL_VARIANTS = ['modern', 'dark', 'minimal', 'elegant', 'gradient', 'corporate', 'bold'];
        const HEROES = ['split', 'centered', 'image'];
        const PALETTES = [
          ['#6366f1', '#f59e0b'], ['#0ea5e9', '#22c55e'], ['#e11d48', '#fb923c'],
          ['#7c3aed', '#ec4899'], ['#0f766e', '#f59e0b'], ['#2563eb', '#06b6d4'],
          ['#c0392b', '#e67e22'], ['#16a34a', '#84cc16'], ['#9333ea', '#06b6d4'],
        ];
        let baseVariant;
        if (wantVariant) {
          baseVariant = wantVariant;
        } else {
          const tl = tone.toLowerCase();
          baseVariant =
            /premium|high-end|luxury|elegant/.test(tl) ? 'elegant' :
            /bold|playful|creative/.test(tl) ? 'bold' :
            /budget|affordable|minimal|clean/.test(tl) ? 'minimal' :
            /corporate|professional|formal/.test(tl) ? 'corporate' :
            ALL_VARIANTS[Math.floor(Math.random() * ALL_VARIANTS.length)];
        }

        const raw = await env.PROGRAMARI.get('__demos__');
        const demos = raw ? JSON.parse(raw) : [];
        const baseSlug = demoSlugify(parsed.businessName);

        // Build one design combo per requested version (first = the chosen design).
        const otherV = ALL_VARIANTS.filter(v => v !== baseVariant);
        const combos = [{ variant: baseVariant, heroType, colorPrimary: parsed.colorPrimary, colorAccent: parsed.colorAccent }];
        for (let i = 1; i < versions; i++) {
          const pal = PALETTES[Math.floor(Math.random() * PALETTES.length)];
          combos.push({ variant: otherV[(i - 1) % otherV.length], heroType: HEROES[i % HEROES.length], colorPrimary: pal[0], colorAccent: pal[1] });
        }

        const created = [];
        for (let i = 0; i < combos.length; i++) {
          const c = combos[i];
          const data = { ...parsed, variant: c.variant, heroType: c.heroType, colorPrimary: c.colorPrimary, colorAccent: c.colorAccent };
          const id = `demo_${Date.now()}_${Math.random().toString(36).slice(2, 6)}_${i}`;
          let slug = i === 0 ? baseSlug : `${baseSlug}-v${i + 1}`;
          while (demos.some(x => x.slug === slug) || created.some(x => x.slug === slug)) slug = `${baseSlug}-${Math.random().toString(36).slice(2, 5)}`;
          created.push({ id, slug, businessName: String(parsed.businessName).slice(0, 80), industry: String(parsed.industry).slice(0, 60), data, createdAt: new Date().toISOString() });
        }
        demos.unshift(...created.slice().reverse());
        await env.PROGRAMARI.put('__demos__', JSON.stringify(demos));
        return json({
          success: true, count: created.length,
          demo: { id: created[0].id, slug: created[0].slug, businessName: created[0].businessName, industry: created[0].industry, url: `/demo/${created[0].slug}` },
          versions: created.map(d => ({ id: d.id, slug: d.slug, variant: d.data.variant, url: `/demo/${d.slug}` })),
        }, 200, request);
      } catch (e) {
        return json({ error: 'Generation error: ' + (e.message || 'unknown') }, 500, request);
      }
    }

    // Generate a demo from an uploaded sketch / wireframe image (vision → content)
    if (path === '/api/demo/from-sketch' && request.method === 'POST') {
      if (!can(authed, 'portfolio')) return json({ error: 'Unauthorised' }, 401, request);
      try {
        if (!env.AI) return json({ error: 'AI binding unavailable — check wrangler.toml' }, 500, request);
        const hintIndustry = String(url.searchParams.get('industry') || '').trim().slice(0, 60);
        let layout = url.searchParams.get('layout') === 'shop' ? 'shop' : (url.searchParams.get('layout') === 'landing' ? 'landing' : '');
        const imgBuf = await request.arrayBuffer();
        if (!imgBuf || imgBuf.byteLength === 0) return json({ error: 'No image received' }, 400, request);
        if (imgBuf.byteLength > 8 * 1024 * 1024) return json({ error: 'Image too large (max 8MB)' }, 413, request);

        // Step 1 — vision model describes the sketch.
        const imgBytes = [...new Uint8Array(imgBuf)];
        const visionPrompt = 'This is a hand-drawn sketch or wireframe of a website. Describe it for a web designer: what kind of business/industry it is for, whether it looks like a one-page landing site or an online shop/catalogue with products, which sections are drawn (hero/banner, services, product grid, gallery, pricing, team, contact, etc.), the overall style and any colours, and any text labels you can read. Be concise and specific.';
        const VISION_MODELS = ['@cf/llava-hf/llava-1.5-7b-hf', '@cf/meta/llama-3.2-11b-vision-instruct', '@cf/unum/uform-gen2-qwen-500m'];
        let description = '', lastErr = '';
        for (const model of VISION_MODELS) {
          try {
            const vis = await env.AI.run(model, { image: imgBytes, prompt: visionPrompt, max_tokens: 512 });
            description = String((vis && (vis.description || vis.response || vis.text)) || '').trim();
            if (description) break;
          } catch (e) { lastErr = (e && e.message) || String(e); }
        }
        if (!description) return json({ error: 'Could not read the image — no Workers AI vision model is enabled on your account. ' + lastErr }, 500, request);

        if (!layout) layout = /shop|store|product|catalog|catalogue|e-?commerce|dealership|listing|cart|price tag/i.test(description) ? 'shop' : 'landing';
        const industry = hintIndustry || 'as shown in the sketch';

        // Step 2 — text model builds the structured content guided by the description.
        const intro = `You are a web copywriter and brand designer. A client provided a sketch/wireframe of the website they want. Here is a description of that sketch:\n"""${description}"""\nBuild realistic demo website content that matches this sketch as closely as possible${hintIndustry ? `, for a business in the "${hintIndustry}" industry` : ''} (UK market). Mirror the sections, layout and style described.`;
        const prompt = intro + '\n\n' + demoJsonSpec(industry, layout);
        const ai = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', { messages: [{ role: 'user', content: prompt }], max_tokens: 2048 });
        const parsed = parseAiJson(ai);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed) || !parsed.businessName) {
          return json({ error: 'The model did not return a valid site. Please try again.' }, 500, request);
        }
        parsed.industry = parsed.industry && parsed.industry !== 'as shown in the sketch' ? parsed.industry : (hintIndustry || 'Custom');
        parsed.layout = layout;
        parsed.heroType = 'split';
        if (layout !== 'shop' && !['modern', 'dark', 'minimal', 'elegant', 'gradient', 'corporate', 'bold'].includes(parsed.variant)) parsed.variant = 'modern';

        const raw = await env.PROGRAMARI.get('__demos__');
        const demos = raw ? JSON.parse(raw) : [];
        const id = `demo_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        let slug = demoSlugify(parsed.businessName);
        if (demos.some(x => x.slug === slug)) slug = `${slug}-${Math.random().toString(36).slice(2, 5)}`;
        demos.unshift({ id, slug, businessName: String(parsed.businessName).slice(0, 80), industry: String(parsed.industry).slice(0, 60), data: parsed, createdAt: new Date().toISOString() });
        await env.PROGRAMARI.put('__demos__', JSON.stringify(demos));
        return json({ success: true, demo: { id, slug, businessName: parsed.businessName, url: `/demo/${slug}` }, layout, description }, 200, request);
      } catch (e) {
        return json({ error: 'Sketch error: ' + (e.message || 'unknown') }, 500, request);
      }
    }

    // Upload a custom single HTML file as a demo
    if (path === '/api/demo/upload-html' && request.method === 'POST') {
      if (!can(authed, 'portfolio')) return json({ error: 'Unauthorised' }, 401);
      try {
        const body = await request.json().catch(() => ({}));
        const name = String(body.businessName || body.name || 'Custom site').trim().slice(0, 80) || 'Custom site';
        const industry = String(body.industry || 'Custom').trim().slice(0, 60) || 'Custom';
        const html = String(body.html || '');
        if (!html.trim()) return json({ error: 'HTML is empty' }, 400);
        if (html.length > 3_000_000) return json({ error: 'HTML too large (max ~3MB). Use a ZIP for bigger sites.' }, 413);
        const raw = await env.PROGRAMARI.get('__demos__');
        const demos = raw ? JSON.parse(raw) : [];
        const id = `demo_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        let slug = demoSlugify(name);
        if (demos.some(x => x.slug === slug)) slug = `${slug}-${Math.random().toString(36).slice(2, 5)}`;
        await env.PROGRAMARI.put('__demo_html__' + id, html);
        demos.unshift({ id, slug, businessName: name, industry, kind: 'html', emoji: '📄', tagline: 'Custom HTML upload', createdAt: new Date().toISOString() });
        await env.PROGRAMARI.put('__demos__', JSON.stringify(demos));
        return json({ success: true, demo: { id, slug, businessName: name, url: `/demo/${slug}` } });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    // Upload a ZIP archive (multi-file site) as a demo
    if (path === '/api/demo/upload-zip' && request.method === 'POST') {
      if (!can(authed, 'portfolio')) return json({ error: 'Unauthorised' }, 401);
      try {
        const name = String(url.searchParams.get('name') || 'Custom site').trim().slice(0, 80) || 'Custom site';
        const industry = String(url.searchParams.get('industry') || 'Custom').trim().slice(0, 60) || 'Custom';
        const zipBuf = await request.arrayBuffer();
        if (!zipBuf || zipBuf.byteLength === 0) return json({ error: 'Empty file' }, 400);
        if (zipBuf.byteLength > 20 * 1024 * 1024) return json({ error: 'ZIP too large (max 20MB)' }, 413);
        const entries = zipEntries(zipBuf);
        if (!entries) return json({ error: 'Not a valid ZIP file' }, 400);
        const idx = zipFindIndex(entries);
        if (!idx) return json({ error: 'No index.html found in the ZIP' }, 400);
        const raw = await env.PROGRAMARI.get('__demos__');
        const demos = raw ? JSON.parse(raw) : [];
        const id = `demo_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        let slug = demoSlugify(name);
        if (demos.some(x => x.slug === slug)) slug = `${slug}-${Math.random().toString(36).slice(2, 5)}`;
        await env.PROGRAMARI.put('__demo_zip__' + id, zipBuf);
        demos.unshift({ id, slug, businessName: name, industry, kind: 'zip', emoji: '🗂', tagline: 'Custom ZIP upload', root: idx.root, indexPath: idx.indexPath, createdAt: new Date().toISOString() });
        await env.PROGRAMARI.put('__demos__', JSON.stringify(demos));
        return json({ success: true, demo: { id, slug, businessName: name, url: `/demo/${slug}/` } });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (/^\/api\/demo\/[^/]+\/restyle$/.test(path) && request.method === 'POST') {
      if (!can(authed, 'portfolio')) return json({ error: 'Unauthorised' }, 401);
      try {
        const id = path.replace('/api/demo/', '').replace('/restyle', '');
        const raw = await env.PROGRAMARI.get('__demos__');
        const demos = raw ? JSON.parse(raw) : [];
        const demo = demos.find(x => x.id === id || x.slug === id);
        if (!demo || !demo.data) return json({ error: 'Not found' }, 404);
        const VARIANTS = ['modern', 'dark', 'minimal', 'elegant', 'gradient', 'corporate', 'bold'];
        const others = VARIANTS.filter(v => v !== demo.data.variant);
        demo.data.variant = others[Math.floor(Math.random() * others.length)];
        const PALETTES = [
          ['#6366f1', '#f59e0b'], ['#0ea5e9', '#22c55e'], ['#e11d48', '#fb923c'],
          ['#7c3aed', '#ec4899'], ['#0f766e', '#f59e0b'], ['#2563eb', '#06b6d4'],
          ['#c0392b', '#e67e22'], ['#16a34a', '#84cc16'], ['#9333ea', '#06b6d4'],
        ];
        const pal = PALETTES[Math.floor(Math.random() * PALETTES.length)];
        demo.data.colorPrimary = pal[0];
        demo.data.colorAccent = pal[1];
        await env.PROGRAMARI.put('__demos__', JSON.stringify(demos));
        return json({ success: true, variant: demo.data.variant, slug: demo.slug });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (/^\/api\/demo\/[^/]+\/images$/.test(path) && request.method === 'GET') {
      if (!can(authed, 'portfolio')) return json({ error: 'Unauthorised' }, 401);
      try {
        const id = path.replace('/api/demo/', '').replace('/images', '');
        const raw = await env.PROGRAMARI.get('__demo_img__' + id);
        return json(raw ? JSON.parse(raw) : { hero: '', about: '', gallery: [] });
      } catch { return json({ hero: '', about: '', gallery: [] }); }
    }

    if (/^\/api\/demo\/[^/]+\/images$/.test(path) && request.method === 'PUT') {
      if (!can(authed, 'portfolio')) return json({ error: 'Unauthorised' }, 401);
      try {
        const id = path.replace('/api/demo/', '').replace('/images', '');
        const body = await request.json().catch(() => ({}));
        const ok = v => typeof v === 'string' && (v.startsWith('data:image/') || v.startsWith('https://') || v === '');
        const images = {
          hero: ok(body.hero) ? body.hero : '',
          about: ok(body.about) ? body.about : '',
          gallery: Array.isArray(body.gallery) ? body.gallery.slice(0, 6).map(v => ok(v) ? v : '') : [],
          banners: Array.isArray(body.banners) ? body.banners.slice(0, 4).map(v => ok(v) ? v : '') : [],
          products: Array.isArray(body.products) ? body.products.slice(0, 12).map(v => ok(v) ? v : '') : [],
        };
        const payload = JSON.stringify(images);
        if (payload.length > 14_000_000) return json({ error: 'Images too large. Please use fewer / smaller photos.' }, 413);
        await env.PROGRAMARI.put('__demo_img__' + id, payload);
        return json({ success: true });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path.startsWith('/api/demo/') && request.method === 'DELETE') {
      if (!can(authed, 'portfolio')) return json({ error: 'Unauthorised' }, 401);
      try {
        const id = path.replace('/api/demo/', '');
        const raw = await env.PROGRAMARI.get('__demos__');
        const demos = raw ? JSON.parse(raw) : [];
        const target = demos.find(x => x.id === id || x.slug === id);
        await env.PROGRAMARI.put('__demos__', JSON.stringify(demos.filter(x => x.id !== id && x.slug !== id)));
        if (target) { await env.PROGRAMARI.delete('__demo_img__' + target.id); await env.PROGRAMARI.delete('__demo_html__' + target.id); await env.PROGRAMARI.delete('__demo_zip__' + target.id); }
        return json({ success: true });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path === '/api/project' && request.method === 'POST') {
      if (!can(authed, 'portfolio')) return json({ error: 'Unauthorised' }, 401);
      try {
        const { emoji, tag, title, description, problema, solutie, rezultat } = await request.json();
        if (!title) return json({ error: 'Title is required' }, 400);
        const raw = await env.PROGRAMARI.get('__projects__');
        const projects = raw ? JSON.parse(raw) : [...DEFAULT_PROJECTS];
        const id = `p_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        const maxOrder = projects.reduce((m, p) => Math.max(m, p.order), -1);
        projects.push({ id, emoji: emoji || '🌐', tag: tag || 'Web', title, description: description || '', problema: problema || '', solutie: solutie || '', rezultat: rezultat || '', order: maxOrder + 1 });
        await env.PROGRAMARI.put('__projects__', JSON.stringify(projects));
        return json({ success: true, id });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path === '/api/project/generate' && request.method === 'POST') {
      if (!can(authed, 'portfolio')) return json({ error: 'Unauthorised' }, 401, request);
      try {
        const body = await request.json().catch(() => ({}));
        const industries = Array.isArray(body.industries) ? body.industries.map(s => String(s).trim()).filter(Boolean).slice(0, 12) : [];
        const count = Math.min(Math.max(parseInt(body.count) || 4, 1), 8);
        const tone = String(body.tone || '').trim().slice(0, 80);
        const extra = String(body.prompt || '').trim().slice(0, 400);
        if (!env.AI) return json({ error: 'AI binding unavailable — check wrangler.toml' }, 500, request);

        const industryLine = industries.length
          ? `Use exactly these industries, one example each: ${industries.join(', ')}.`
          : `Pick ${count} varied industries relevant to small businesses (e.g. restaurant, hair salon, car service, florist, construction, dental clinic, gym, real estate, law firm, e-commerce).`;
        const toneLine = tone ? `\nTone / style for all examples: ${tone}.` : '';
        const extraLine = extra ? `\nExtra instructions from the user (follow them): ${extra}.` : '';

        const prompt = `You are a copywriter for the web design agency "C Design". Generate ${count} realistic portfolio project examples (websites delivered for clients), each for a different industry. ${industryLine}${toneLine}${extraLine}

Return ONLY a valid JSON array, with no text before or after, using exactly this structure:
[
  {
    "emoji": "a single emoji representing the industry",
    "tag": "short category (1-2 words), e.g. Restaurant, Auto, Florist",
    "title": "the project name (max 45 characters)",
    "description": "short description of the website (1 sentence)",
    "problema": "the client's challenge before the website (1 sentence)",
    "solutie": "the solution delivered (1 sentence)",
    "rezultat": "a concrete result with plausible numbers (1 sentence)"
  }
]

Requirements:
- Language: ENGLISH (the site targets the UK market)
- Exactly ${count} objects in the array, each a different industry
- Realistic, credible numbers in "rezultat"
- No text outside the JSON array`;

        const ai = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 2048,
        });

        // Workers AI normally returns { response: "..." }, but the shape can vary by model.
        const respRaw = ai && ai.response !== undefined ? ai.response : ai;
        let arr;
        if (respRaw && typeof respRaw === 'object') {
          // Model already returned structured data — use it directly.
          arr = Array.isArray(respRaw) ? respRaw
              : Array.isArray(respRaw.examples) ? respRaw.examples
              : [respRaw];
        } else {
          const text = String(respRaw ?? '').trim();
          const match = text.match(/\[[\s\S]*\]/) || text.match(/\{[\s\S]*\}/);
          if (!match) return json({ error: 'The model did not return valid JSON. Please try again.' }, 500, request);

          // Sanitize control characters inside JSON string values
          let rawJson = match[0];
          let sanitized = '';
          let inStr = false, esc = false;
          for (let i = 0; i < rawJson.length; i++) {
            const c = rawJson[i];
            if (esc) { sanitized += c; esc = false; continue; }
            if (c === '\\') { sanitized += c; esc = true; continue; }
            if (c === '"') { inStr = !inStr; sanitized += c; continue; }
            if (inStr && c.charCodeAt(0) < 0x20) {
              if (c === '\n') sanitized += '\\n';
              else if (c === '\r') sanitized += '\\r';
              else if (c === '\t') sanitized += '\\t';
            } else { sanitized += c; }
          }

          try { arr = JSON.parse(sanitized); } catch { return json({ error: 'Invalid JSON from model. Please try again.' }, 500, request); }
        }
        if (!Array.isArray(arr)) arr = [arr];
        const examples = arr.filter(p => p && p.title).map(p => ({
          emoji: String(p.emoji || '🌐').slice(0, 4),
          tag: String(p.tag || 'Web').slice(0, 30),
          title: String(p.title || '').slice(0, 80),
          description: String(p.description || ''),
          problema: String(p.problema || ''),
          solutie: String(p.solutie || ''),
          rezultat: String(p.rezultat || ''),
        }));
        if (!examples.length) return json({ error: 'No examples generated. Please try again.' }, 500, request);
        return json({ success: true, examples }, 200, request);
      } catch (e) {
        return json({ error: 'Generation error: ' + (e.message || 'unknown') }, 500, request);
      }
    }

    if (path.startsWith('/api/project/') && request.method === 'PUT') {
      if (!can(authed, 'portfolio')) return json({ error: 'Unauthorised' }, 401);
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
      if (!can(authed, 'portfolio')) return json({ error: 'Unauthorised' }, 401);
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
      if (!can(authed, 'crm')) return json({ error: 'Unauthorised' }, 401);
      try {
        const raw = await env.PROGRAMARI.get('__crm__');
        const entries = raw ? JSON.parse(raw) : [];
        return json(entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path === '/api/crm' && request.method === 'POST') {
      if (!can(authed, 'crm')) return json({ error: 'Unauthorised' }, 401);
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
      if (!can(authed, 'crm')) return json({ error: 'Unauthorised' }, 401);
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
      if (!can(authed, 'crm')) return json({ error: 'Unauthorised' }, 401);
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
      if (!can(authed, 'blog')) return json({ error: 'Unauthorised' }, 401, request);
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
      if (!can(authed, 'blog')) return json({ error: 'Unauthorised' }, 401, request);
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
        const all = url.searchParams.get('all') === '1' && can(authed, 'blog');
        return json(posts.filter(p => all || p.published).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path === '/api/blog' && request.method === 'POST') {
      if (!can(authed, 'blog')) return json({ error: 'Unauthorised' }, 401);
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
      if (!can(authed, 'blog')) return json({ error: 'Unauthorised' }, 401);
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

    if (path === '/api/blog/reset' && request.method === 'DELETE') {
      if (!can(authed, 'blog')) return json({ error: 'Unauthorised' }, 401);
      try {
        await env.PROGRAMARI.put('__blog__', JSON.stringify([]));
        return json({ success: true });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path.startsWith('/api/blog/') && request.method === 'DELETE') {
      if (!can(authed, 'blog')) return json({ error: 'Unauthorised' }, 401);
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
      if (!can(authed, 'expenses')) return json({ error: 'Unauthorised' }, 401);
      try {
        const raw = await env.PROGRAMARI.get('__cheltuieli__');
        return json(raw ? JSON.parse(raw) : []);
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path === '/api/cheltuieli' && request.method === 'POST') {
      if (!can(authed, 'expenses')) return json({ error: 'Unauthorised' }, 401);
      try {
        const { descriere, categorie, suma, moneda, data, metodaPlatii, recurent, note } = await request.json();
        if (!descriere || !suma || !data) return json({ error: 'Required fields missing' }, 400);
        const raw = await env.PROGRAMARI.get('__cheltuieli__');
        const lista = raw ? JSON.parse(raw) : [];
        const id = `chelt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        lista.unshift({ id, descriere, categorie: categorie || 'altele', suma: parseFloat(suma), moneda: moneda || 'GBP', data, metodaPlatii: metodaPlatii || 'card', recurent: !!recurent, note: note || '', createdAt: new Date().toISOString() });
        await env.PROGRAMARI.put('__cheltuieli__', JSON.stringify(lista));
        return json({ success: true, id });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path.startsWith('/api/cheltuieli/') && request.method === 'PUT') {
      if (!can(authed, 'expenses')) return json({ error: 'Unauthorised' }, 401);
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
      if (!can(authed, 'expenses')) return json({ error: 'Unauthorised' }, 401);
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
      if (!can(authed, 'settings')) return json({ error: 'Unauthorised' }, 401, request);
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
      if (!can(authed, 'settings')) return json({ error: 'Unauthorised' }, 401);
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
      if (!can(authed, 'social')) return json({ error: 'Unauthorised' }, 401);
      try {
        const body = await request.json();
        await env.PROGRAMARI.put('__social__', JSON.stringify(body));
        return json({ success: true });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    // ── GIBILAN ───────────────────────────────────────────────

    if (path === '/api/gibilan/agenda' && request.method === 'GET') {
      if (!can(authed, 'gibilan')) return json({ error: 'Unauthorised' }, 401);
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
      if (!can(authed, 'gibilan')) return json({ error: 'Unauthorised' }, 401);
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
      if (!can(authed, 'gibilan')) return json({ error: 'Unauthorised' }, 401);
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
      if (!can(authed, 'gibilan')) return json({ error: 'Unauthorised' }, 401);
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
      if (!can(authed, 'gibilan')) return json({ error: 'Unauthorised' }, 401);
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
      if (!can(authed, 'gibilan')) return json({ error: 'Unauthorised' }, 401);
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
      if (!can(authed, 'gibilan')) return json({ error: 'Unauthorised' }, 401);
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
      if (!can(authed, 'gibilan')) return json({ error: 'Unauthorised' }, 401);
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
      if (!can(authed, 'gibilan')) return json({ error: 'Unauthorised' }, 401);
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
      if (!can(authed, 'gibilan')) return json({ error: 'Unauthorised' }, 401);
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
      if (!can(authed, 'gibilan')) return json({ error: 'Unauthorised' }, 401);
      try {
        const id = path.replace('/api/gibilan/deadline/', '');
        const raw = await env.PROGRAMARI.get('__gibilan__');
        const data = raw ? JSON.parse(raw) : { meetings: [], todos: [], deadlines: [] };
        data.deadlines = (data.deadlines || []).filter(d => d.id !== id);
        await env.PROGRAMARI.put('__gibilan__', JSON.stringify(data));
        return json({ success: true });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path === '/api/gibilan/reset' && request.method === 'DELETE') {
      if (!can(authed, 'gibilan')) return json({ error: 'Unauthorised' }, 401);
      try {
        const which = url.searchParams.get('which'); // 'meetings' | 'todos' | 'deadlines' | null = all
        if (!which) {
          await env.PROGRAMARI.put('__gibilan__', JSON.stringify({ meetings: [], todos: [], deadlines: [] }));
        } else {
          const raw = await env.PROGRAMARI.get('__gibilan__');
          const data = raw ? JSON.parse(raw) : { meetings: [], todos: [], deadlines: [] };
          if (['meetings', 'todos', 'deadlines'].includes(which)) data[which] = [];
          await env.PROGRAMARI.put('__gibilan__', JSON.stringify(data));
        }
        return json({ success: true });
      } catch { return json({ error: 'Server error' }, 500); }
    }

    // ── CLIENȚI ──────────────────────────────────────────────
    if (path === '/api/clients' && request.method === 'GET') {
      if (!can(authed, 'clients')) return json({ error: 'Unauthorised' }, 401);
      try {
        const raw = await env.PROGRAMARI.get('__clients__');
        return json(raw ? JSON.parse(raw) : []);
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path === '/api/client' && request.method === 'POST') {
      if (!can(authed, 'clients')) return json({ error: 'Unauthorised' }, 401);
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
      if (!can(authed, 'clients')) return json({ error: 'Unauthorised' }, 401);
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
      if (!can(authed, 'clients')) return json({ error: 'Unauthorised' }, 401);
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
      if (!can(authed, 'theme')) return json({ error: 'Unauthorised' }, 401);
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
      if (!can(authed, 'pages')) return json({ error: 'Unauthorised' }, 401);
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
      if (!can(authed, 'settings')) return json({ error: 'Unauthorised' }, 401);
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
      if (!can(authed, 'settings')) return json({ error: 'Unauthorised' }, 401);
      try {
        const raw = await env.PROGRAMARI.get('__maintenance__');
        return json(raw ? JSON.parse(raw) : { enabled: false, title: '', message: '', date: '' });
      } catch { return json({ error: 'Error' }, 500); }
    }
    if (path === '/api/maintenance' && request.method === 'PUT') {
      if (!can(authed, 'settings')) return json({ error: 'Unauthorised' }, 401);
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
      if (!can(authed, 'media')) return json({ error: 'Unauthorised' }, 401);
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
      if (!authed) return json({ error: 'Unauthorised' }, 401);
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
      if (!can(authed, 'media')) return json({ error: 'Unauthorised' }, 401);
      const filename = path.replace('/api/media/', '');
      try {
        await env.PROGRAMARI.delete('__media__' + filename);
        return json({ success: true });
      } catch { return json({ error: 'Error' }, 500); }
    }

    // ── SERVICII (catalog pentru oferte) ─────────────────────

    if (path === '/api/servicii' && request.method === 'GET') {
      if (!can(authed, 'oferte')) return json({ error: 'Unauthorised' }, 401);
      try {
        const raw = await env.PROGRAMARI.get('__servicii__');
        // Servicii noi adăugate după seed inițial — migrare automată
        const migrations = [
          { id:'svc_d17', nume:'Google Search Console Integration', descriere:'Property verification, XML sitemap, Google Analytics connection, indexing error report', pret:120, moneda:'GBP', unitate:'proiect', categorie:'seo' },
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
          { id:'svc_d01', nume:'Presentation Website', descriere:'5 pages, responsive design, CMS, Google Analytics, basic SEO', pret:899, moneda:'GBP', unitate:'proiect', categorie:'web-design' },
          { id:'svc_d02', nume:'Premium Presentation Website', descriere:'10+ pages, custom design, blog, multilingual, API integrations', pret:1800, moneda:'GBP', unitate:'proiect', categorie:'web-design' },
          { id:'svc_d03', nume:'Online Shop (eCommerce)', descriere:'WooCommerce / Shopify, product catalogue, online payments, delivery', pret:2500, moneda:'GBP', unitate:'proiect', categorie:'web-design' },
          { id:'svc_d04', nume:'Landing Page', descriere:'Conversion-optimised page, A/B testing, form integration', pret:450, moneda:'GBP', unitate:'proiect', categorie:'web-design' },
          { id:'svc_d05', nume:'Existing Website Redesign', descriere:'Full redesign retaining existing content, data migration, SEO redirects', pret:700, moneda:'GBP', unitate:'proiect', categorie:'web-design' },
          { id:'svc_d06', nume:'Full SEO Audit', descriere:'Technical analysis, keywords, competition, report with recommendations', pret:300, moneda:'GBP', unitate:'proiect', categorie:'seo' },
          { id:'svc_d07', nume:'Monthly SEO (Ongoing)', descriere:'Continuous optimisation, content, link building, monthly report, 15–25 keywords', pret:400, moneda:'GBP', unitate:'lună', categorie:'seo' },
          { id:'svc_d08', nume:'Local SEO (Google Maps)', descriere:'Google Business Profile optimisation, local citations, reviews', pret:250, moneda:'GBP', unitate:'lună', categorie:'seo' },
          { id:'svc_d09', nume:'Google Ads Management', descriere:'Setup + campaign optimisation Search/Display/Shopping, monthly report', pret:350, moneda:'GBP', unitate:'lună', categorie:'marketing' },
          { id:'svc_d10', nume:'Meta Ads Management', descriere:'Facebook & Instagram campaigns, A/B testing, retargeting, monthly report', pret:350, moneda:'GBP', unitate:'lună', categorie:'marketing' },
          { id:'svc_d11', nume:'Social Media Management', descriere:'12 posts/month, copywriting, branded graphics, community monitoring', pret:300, moneda:'GBP', unitate:'lună', categorie:'marketing' },
          { id:'svc_d12', nume:'Email Marketing / Newsletter', descriere:'Template design, list segmentation, campaign delivery, open-rate report', pret:200, moneda:'GBP', unitate:'lună', categorie:'marketing' },
          { id:'svc_d13', nume:'Basic Website Maintenance', descriere:'CMS & plugin updates, monthly backup, uptime monitoring, 1h support', pret:100, moneda:'GBP', unitate:'lună', categorie:'mentenanta' },
          { id:'svc_d14', nume:'Advanced Website Maintenance', descriere:'Updates, weekly backup, security, 4h of changes/month, report', pret:200, moneda:'GBP', unitate:'lună', categorie:'mentenanta' },
          { id:'svc_d15', nume:'Logo Design', descriere:'3 concept variants, final vector files (AI, SVG, PNG, PDF)', pret:350, moneda:'GBP', unitate:'proiect', categorie:'grafic' },
          { id:'svc_d16', nume:'Complete Visual Identity', descriere:'Logo + colour palette + fonts + business card + letterhead + brand guide', pret:800, moneda:'GBP', unitate:'proiect', categorie:'grafic' },
          ...migrations,
        ];
        await env.PROGRAMARI.put('__servicii__', JSON.stringify(defaults));
        return json(defaults);
      } catch { return json([]); }
    }

    if (path === '/api/servicii' && request.method === 'POST') {
      if (!can(authed, 'oferte')) return json({ error: 'Unauthorised' }, 401);
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
          moneda: ['GBP', 'EUR', 'RON'].includes(body.moneda) ? body.moneda : 'GBP',
          unitate: ['proiect', 'lună', 'oră', 'pagină', 'an'].includes(body.unitate) ? body.unitate : 'proiect',
          categorie: ['web-design', 'seo', 'mentenanta', 'grafic', 'marketing', 'altele'].includes(body.categorie) ? body.categorie : 'altele',
        };
        lista.push(svc);
        await env.PROGRAMARI.put('__servicii__', JSON.stringify(lista));
        return json(svc);
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path.startsWith('/api/servicii/') && request.method === 'PUT') {
      if (!can(authed, 'oferte')) return json({ error: 'Unauthorised' }, 401);
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
          ...(body.moneda && ['GBP', 'EUR', 'RON'].includes(body.moneda) && { moneda: body.moneda }),
          ...(body.unitate && ['proiect','lună','oră','pagină','an'].includes(body.unitate) && { unitate: body.unitate }),
          ...(body.categorie && { categorie: body.categorie }),
        };
        await env.PROGRAMARI.put('__servicii__', JSON.stringify(lista));
        return json(lista[idx]);
      } catch { return json({ error: 'Server error' }, 500); }
    }

    if (path.startsWith('/api/servicii/') && request.method === 'DELETE') {
      if (!can(authed, 'oferte')) return json({ error: 'Unauthorised' }, 401);
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
      if (!can(authed, 'oferte')) return json({ error: 'Unauthorised' }, 401);
      try {
        const raw = await env.PROGRAMARI.get('__oferte__');
        return json(raw ? JSON.parse(raw) : []);
      } catch { return json([]); }
    }

    if (path === '/api/oferte' && request.method === 'POST') {
      if (!can(authed, 'oferte')) return json({ error: 'Unauthorised' }, 401);
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
            pret: parseFloat(s.pret) || 0, moneda: s.moneda || 'GBP', unitate: s.unitate || 'proiect',
          })),
          moneda: ['GBP', 'EUR', 'RON'].includes(body.moneda) ? body.moneda : 'GBP',
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
      if (!can(authed, 'oferte')) return new Response('Unauthorised', { status: 401 });
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
      if (!can(authed, 'oferte')) return json({ error: 'Unauthorised' }, 401);
      try {
        const raw = await env.PROGRAMARI.get('__contract_template__');
        return json(raw ? JSON.parse(raw) : {});
      } catch { return json({}); }
    }

    if (path === '/api/contract-template' && request.method === 'PUT') {
      if (!can(authed, 'oferte')) return json({ error: 'Unauthorised' }, 401);
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
      if (!can(authed, 'oferte')) return json({ error: 'Unauthorised' }, 401);
      try {
        const raw = await env.PROGRAMARI.get('__contracte__');
        return json(raw ? JSON.parse(raw) : []);
      } catch { return json([]); }
    }

    if (path === '/api/contracte' && request.method === 'POST') {
      if (!can(authed, 'oferte')) return json({ error: 'Unauthorised' }, 401);
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
          moneda: ['GBP','EUR','RON'].includes(body.moneda) ? body.moneda : 'GBP',
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
      if (!can(authed, 'oferte')) return new Response('Unauthorised', { status: 401 });
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
