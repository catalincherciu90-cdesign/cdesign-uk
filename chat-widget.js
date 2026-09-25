/* C Design — floating AI chat widget (self-contained) */
(function () {
  if (window.__cdChatLoaded) return;
  window.__cdChatLoaded = true;

  var ACCENT = '#00AAAC';
  var ACCENT_DK = '#008587';
  // Pick up the site accent colour if the page defines one.
  try {
    var v = getComputedStyle(document.documentElement).getPropertyValue('--blue').trim()
         || getComputedStyle(document.documentElement).getPropertyValue('--teal').trim();
    if (v) { ACCENT = v; }
  } catch (e) {}

  var SUGGESTIONS = [
    "Tell me about the £200 offer",
    'What services do you offer?',
    'How much does a website cost?',
    'How long does a project take?',
    'Can you help with SEO?'
  ];

  var busy = false;

  // Live (human) chat state.
  var live = false;          // true once the visitor is talking to a person
  var liveSince = 0;         // server message index we've already rendered
  var pollTimer = null;      // polling interval for owner replies
  var visitorName = '';
  var visitorContact = '';
  try {
    visitorName = localStorage.getItem('cd_chat_name') || '';
    visitorContact = localStorage.getItem('cd_chat_contact') || '';
  } catch (e) {}

  // Stable conversation id so all messages group into one thread in admin.
  var cid = '';
  try {
    cid = localStorage.getItem('cd_chat_cid') || '';
    if (!cid) {
      cid = 'c_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      localStorage.setItem('cd_chat_cid', cid);
    }
  } catch (e) {
    cid = 'c_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  var css = [
    '.cdchat-btn{position:fixed;right:20px;bottom:20px;z-index:99998;width:60px;height:60px;border-radius:50%;',
    'background:' + ACCENT + ';color:#fff;border:none;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.22);',
    'display:flex;align-items:center;justify-content:center;transition:transform .18s ease,box-shadow .18s ease;}',
    '.cdchat-btn:hover{transform:translateY(-2px);box-shadow:0 12px 30px rgba(0,0,0,.28);}',
    '.cdchat-btn svg{width:28px;height:28px;}',
    '.cdchat-badge{position:fixed;right:14px;bottom:70px;z-index:99998;background:#2E3436;color:#fff;',
    'font:600 12px/1.2 Inter,system-ui,sans-serif;padding:8px 12px;border-radius:12px;box-shadow:0 6px 18px rgba(0,0,0,.18);',
    'max-width:180px;opacity:0;transform:translateY(6px);transition:opacity .25s,transform .25s;pointer-events:none;}',
    '.cdchat-badge.show{opacity:1;transform:translateY(0);}',
    '.cdchat-panel{position:fixed;right:20px;bottom:20px;z-index:99999;width:370px;max-width:calc(100vw - 24px);',
    'height:560px;max-height:calc(100vh - 40px);background:#fff;border-radius:18px;overflow:hidden;',
    'box-shadow:0 24px 60px rgba(0,0,0,.28);display:none;flex-direction:column;font-family:Inter,system-ui,sans-serif;}',
    '.cdchat-panel.open{display:flex;animation:cdchatIn .22s ease;}',
    '@keyframes cdchatIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}',
    '.cdchat-head{background:' + ACCENT + ';color:#fff;padding:16px 18px;display:flex;align-items:center;gap:12px;}',
    '.cdchat-head .dot{width:10px;height:10px;border-radius:50%;background:#7CFFB2;box-shadow:0 0 0 3px rgba(124,255,178,.3);flex:0 0 auto;}',
    '.cdchat-head h4{margin:0;font:700 15px/1.2 Poppins,Inter,sans-serif;}',
    '.cdchat-head p{margin:2px 0 0;font-size:12px;opacity:.9;}',
    '.cdchat-head .x{margin-left:auto;background:transparent;border:none;color:#fff;cursor:pointer;font-size:22px;line-height:1;padding:4px;opacity:.85;}',
    '.cdchat-head .x:hover{opacity:1;}',
    '.cdchat-body{flex:1;overflow-y:auto;padding:16px;background:#F6F9F9;display:flex;flex-direction:column;gap:10px;}',
    '.cdchat-msg{max-width:82%;padding:10px 13px;border-radius:14px;font-size:14px;line-height:1.5;white-space:pre-wrap;word-wrap:break-word;}',
    '.cdchat-msg.bot{background:#fff;color:#2E3436;border:1px solid #E3EAEA;border-bottom-left-radius:4px;align-self:flex-start;}',
    '.cdchat-msg.user{background:' + ACCENT + ';color:#fff;border-bottom-right-radius:4px;align-self:flex-end;}',
    '.cdchat-typing{align-self:flex-start;display:flex;gap:4px;padding:12px 14px;background:#fff;border:1px solid #E3EAEA;border-radius:14px;border-bottom-left-radius:4px;}',
    '.cdchat-typing span{width:7px;height:7px;border-radius:50%;background:#9BB0B0;animation:cdchatBlink 1.2s infinite;}',
    '.cdchat-typing span:nth-child(2){animation-delay:.2s;}.cdchat-typing span:nth-child(3){animation-delay:.4s;}',
    '@keyframes cdchatBlink{0%,60%,100%{opacity:.3}30%{opacity:1}}',
    '.cdchat-sugg{display:flex;flex-wrap:wrap;gap:8px;padding:0 16px 12px;background:#F6F9F9;}',
    '.cdchat-sugg button{background:#fff;border:1px solid ' + ACCENT + ';color:' + ACCENT_DK + ';font:600 12px Inter,sans-serif;',
    'padding:7px 11px;border-radius:20px;cursor:pointer;transition:background .15s;}',
    '.cdchat-sugg button:hover{background:' + ACCENT + ';color:#fff;}',
    '.cdchat-foot{border-top:1px solid #E3EAEA;padding:10px;display:flex;gap:8px;background:#fff;}',
    '.cdchat-foot input{flex:1;border:1px solid #D6E0E0;border-radius:22px;padding:11px 15px;font-size:14px;outline:none;font-family:inherit;}',
    '.cdchat-foot input:focus{border-color:' + ACCENT + ';}',
    '.cdchat-foot button{background:' + ACCENT + ';border:none;color:#fff;width:42px;height:42px;border-radius:50%;cursor:pointer;flex:0 0 auto;display:flex;align-items:center;justify-content:center;}',
    '.cdchat-foot button:disabled{opacity:.5;cursor:default;}',
    '.cdchat-foot button svg{width:18px;height:18px;}',
    '.cdchat-legal{text-align:center;font-size:11px;color:#8AA0A0;padding:0 0 8px;background:#fff;}',
    '.cdchat-legal a{color:' + ACCENT_DK + ';text-decoration:none;font-weight:600;}',
    // human / live chat additions
    '.cdchat-msg.agent{background:#EAF7F7;color:#22303a;border:1px solid #BFE7E7;border-bottom-left-radius:4px;align-self:flex-start;}',
    '.cdchat-name{align-self:flex-start;font:600 11px Inter,sans-serif;color:' + ACCENT_DK + ';margin:2px 0 -4px 2px;}',
    '.cdchat-sys{align-self:center;background:#eef2f2;color:#5b6472;font:500 12px Inter,sans-serif;padding:6px 12px;border-radius:12px;text-align:center;max-width:92%;}',
    '.cdchat-human{width:100%;padding:0 16px 12px;background:#F6F9F9;}',
    '.cdchat-human button.ask{width:100%;background:#fff;border:1px dashed ' + ACCENT + ';color:' + ACCENT_DK + ';font:600 13px Inter,sans-serif;padding:10px;border-radius:12px;cursor:pointer;}',
    '.cdchat-human button.ask:hover{background:' + ACCENT + ';color:#fff;}',
    '.cdchat-cform{background:#fff;border:1px solid #E3EAEA;border-radius:14px;padding:14px;display:flex;flex-direction:column;gap:9px;}',
    '.cdchat-cform p{margin:0 0 2px;font:600 13px Inter,sans-serif;color:#2E3436;}',
    '.cdchat-cform input{border:1px solid #D6E0E0;border-radius:10px;padding:10px 12px;font-size:14px;outline:none;font-family:inherit;}',
    '.cdchat-cform input:focus{border-color:' + ACCENT + ';}',
    '.cdchat-cform .go{background:' + ACCENT + ';color:#fff;border:none;border-radius:10px;padding:11px;font:600 14px Inter,sans-serif;cursor:pointer;}',
    '.cdchat-cform .go:hover{background:' + ACCENT_DK + ';}',
    '.cdchat-cform .cancel{background:none;border:none;color:#8AA0A0;font:500 12px Inter,sans-serif;cursor:pointer;padding:2px;}',
    '@media(max-width:480px){.cdchat-panel{right:0;bottom:0;width:100vw;height:100vh;max-height:100vh;border-radius:0;}}'
  ].join('');

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var wrap = document.createElement('div');
  wrap.innerHTML =
    '<button class="cdchat-btn" aria-label="Chat with us">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>' +
    '</button>' +
    '<div class="cdchat-badge">Hi! Got a question about your website project? 👋</div>' +
    '<div class="cdchat-panel" role="dialog" aria-label="C Design chat">' +
      '<div class="cdchat-head">' +
        '<span class="dot"></span>' +
        '<div><h4>Chat with C Design</h4><p>A real person replies here</p></div>' +
        '<button class="x" aria-label="Close">&times;</button>' +
      '</div>' +
      '<div class="cdchat-body"></div>' +
      '<div class="cdchat-sugg"></div>' +
      '<div class="cdchat-human"></div>' +
      '<div class="cdchat-foot">' +
        '<input type="text" placeholder="Type your message…" maxlength="1000" aria-label="Your message">' +
        '<button class="send" aria-label="Send">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>' +
        '</button>' +
      '</div>' +
      '<div class="cdchat-legal">We reply here &amp; by email · <a href="/pricing">Get a free quote</a></div>' +
    '</div>';
  document.body.appendChild(wrap);

  var btn    = wrap.querySelector('.cdchat-btn');
  var badge  = wrap.querySelector('.cdchat-badge');
  var panel  = wrap.querySelector('.cdchat-panel');
  var body   = wrap.querySelector('.cdchat-body');
  var sugg   = wrap.querySelector('.cdchat-sugg');
  var human  = wrap.querySelector('.cdchat-human');
  var input  = wrap.querySelector('.cdchat-foot input');
  var sendBt = wrap.querySelector('.cdchat-foot .send');
  var closeB = wrap.querySelector('.cdchat-head .x');
  var headSub = wrap.querySelector('.cdchat-head p');

  function scrollDown() { body.scrollTop = body.scrollHeight; }

  function addMsg(text, who) {
    var m = document.createElement('div');
    m.className = 'cdchat-msg ' + who;
    m.textContent = text;
    body.appendChild(m);
    scrollDown();
    return m;
  }

  // A message from a real team member, with a small name tag.
  function addAgentMsg(text) {
    var tag = document.createElement('div');
    tag.className = 'cdchat-name';
    tag.textContent = 'C Design team';
    body.appendChild(tag);
    var m = document.createElement('div');
    m.className = 'cdchat-msg agent';
    m.textContent = text;
    body.appendChild(m);
    scrollDown();
    return m;
  }

  // A small centred system note.
  function addSystem(text) {
    var m = document.createElement('div');
    m.className = 'cdchat-sys';
    m.textContent = text;
    body.appendChild(m);
    scrollDown();
    return m;
  }

  // A compact "how can we reach you" form so we can reply even if the
  // visitor closes the chat. Optional — they can just start typing.
  function renderContactForm() {
    if (live && visitorContact) { human.innerHTML = ''; return; }
    human.innerHTML =
      '<div class="cdchat-cform">' +
        '<p>How can we reach you? (so we can reply even if you leave)</p>' +
        '<input class="cf-name" type="text" placeholder="Your name (optional)" maxlength="80">' +
        '<input class="cf-contact" type="text" placeholder="Email or phone" maxlength="120">' +
        '<button class="go" type="button">Save &amp; start chatting</button>' +
        '<button class="cancel" type="button">Skip — just start typing</button>' +
      '</div>';
    var nEl = human.querySelector('.cf-name');
    var cEl = human.querySelector('.cf-contact');
    if (visitorName) nEl.value = visitorName;
    if (visitorContact) cEl.value = visitorContact;
    setTimeout(function () { (visitorName ? cEl : nEl).focus(); }, 50);
    human.querySelector('.go').addEventListener('click', function () {
      saveContact(nEl.value.trim(), cEl.value.trim());
      human.innerHTML = '';
      addSystem('Thanks! Type your message below and we\'ll reply here shortly.');
      input.focus();
    });
    human.querySelector('.cancel').addEventListener('click', function () {
      human.innerHTML = '';
      input.focus();
    });
  }

  // Store the visitor's contact details (locally, and on the server if live).
  function saveContact(name, contact) {
    visitorName = name || visitorName;
    visitorContact = contact || visitorContact;
    try {
      if (visitorName) localStorage.setItem('cd_chat_name', visitorName);
      if (visitorContact) localStorage.setItem('cd_chat_contact', visitorContact);
    } catch (e) {}
    if (live && (name || contact)) {
      fetch('/api/chat/human', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cid: cid, name: visitorName, contact: visitorContact, message: '' })
      }).catch(function () {});
    }
  }

  // The visitor's first message: create the live conversation and notify us.
  function firstSend(text) {
    addMsg(text, 'user');
    human.innerHTML = '';
    sugg.innerHTML = '';
    busy = true; sendBt.disabled = true;
    fetch('/api/chat/human', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cid: cid, name: visitorName, contact: visitorContact, message: text })
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        live = true;
        liveSince = (data && typeof data.count === 'number') ? data.count : liveSince;
        if (headSub) headSub.textContent = 'Chatting with the team';
        input.placeholder = 'Type your message…';
        addSystem("Thanks — a real person will reply here shortly. We'll email you too if you leave.");
        if (!visitorContact) renderContactForm();
        startPolling();
      })
      .catch(function () {
        addSystem("Couldn't send just now — please try again, or email office@c-designs.uk.");
      })
      .finally(function () { busy = false; sendBt.disabled = false; input.focus(); });
  }

  // Send a follow-up message once the conversation is live.
  function sendLive(text) {
    addMsg(text, 'user');
    busy = true; sendBt.disabled = true;
    fetch('/api/chat/human', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cid: cid, name: visitorName, contact: visitorContact, message: text })
    })
      .then(function (r) { return r.json(); })
      .catch(function () {
        addSystem("Message not sent — please check your connection and try again.");
      })
      .finally(function () { busy = false; sendBt.disabled = false; input.focus(); pollOnce(); });
  }

  // Fetch any new owner/assistant messages since liveSince and render them.
  function pollOnce() {
    if (!live) return;
    fetch('/api/chat/updates?cid=' + encodeURIComponent(cid) + '&since=' + liveSince)
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || !Array.isArray(data.messages)) return;
        data.messages.forEach(function (m) {
          if (m.idx < liveSince) return;
          if (m.role === 'owner') {
            addAgentMsg(m.content);
            if (!panel.classList.contains('open')) {
              badge.textContent = 'C Design team: ' + m.content.slice(0, 60);
              badge.classList.add('show');
            }
          } else if (m.role === 'assistant') {
            addMsg(m.content, 'bot');
          }
          liveSince = m.idx + 1;
        });
      })
      .catch(function () {});
  }

  function startPolling() {
    stopPolling();
    pollOnce();
    pollTimer = setInterval(function () {
      if (document.hidden) return;
      pollOnce();
    }, 5000);
  }
  function stopPolling() {
    if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
  }

  function renderSuggestions() {
    sugg.innerHTML = '';
    SUGGESTIONS.forEach(function (q) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = q;
      b.addEventListener('click', function () { send(q); });
      sugg.appendChild(b);
    });
  }

  var greeted = false;
  function greet() {
    if (greeted) return;
    greeted = true;
    addMsg("Hi 👋 Send us a message and a real person from C Design will reply right here — usually within a few minutes. If you leave the chat, we'll email you our reply too.", 'bot');
    renderSuggestions();
    if (!live && !(visitorName && visitorContact)) renderContactForm();
    restoreLive();
  }

  // If this conversation is already live server-side (e.g. after a page
  // reload), rebuild the thread and resume polling for the team's replies.
  function restoreLive() {
    fetch('/api/chat/updates?cid=' + encodeURIComponent(cid) + '&since=0&full=1')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || data.mode !== 'live' || !Array.isArray(data.messages) || !data.messages.length) return;
        live = true;
        sugg.innerHTML = ''; human.innerHTML = '';
        addSystem('Here is your chat with the C Design team.');
        data.messages.forEach(function (m) {
          if (m.role === 'owner') addAgentMsg(m.content);
          else if (m.role === 'user') addMsg(m.content, 'user');
          else if (m.role === 'assistant') addMsg(m.content, 'bot');
        });
        liveSince = (typeof data.count === 'number') ? data.count : data.messages.length;
        if (headSub) headSub.textContent = 'Chatting with the team';
        input.placeholder = 'Message the team…';
        startPolling();
      })
      .catch(function () {});
  }

  function openPanel() {
    panel.classList.add('open');
    badge.classList.remove('show');
    greet();
    setTimeout(function () { input.focus(); }, 100);
  }
  function closePanel() { panel.classList.remove('open'); }

  btn.addEventListener('click', function () {
    panel.classList.contains('open') ? closePanel() : openPanel();
  });
  closeB.addEventListener('click', closePanel);

  function send(text) {
    text = (text || input.value || '').trim();
    if (!text || busy) return;
    input.value = '';
    sugg.innerHTML = '';
    if (live) { sendLive(text); } else { firstSend(text); }
  }

  sendBt.addEventListener('click', function () { send(); });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); send(); }
  });

  // Nudge badge after a moment if the panel is still closed.
  setTimeout(function () {
    if (!panel.classList.contains('open')) {
      badge.classList.add('show');
      setTimeout(function () { badge.classList.remove('show'); }, 6000);
    }
  }, 4000);

  // ── Footer social links ─────────────────────────────────────
  // Wire the footer's social icons (.f-social a) to the URLs set in
  // the admin (Social tab). Only accounts marked Active with a URL are
  // shown; unconfigured icons are hidden so there are no dead "#" links.
  (function wireSocials() {
    var anchors = document.querySelectorAll('.f-social a[aria-label]');
    if (!anchors.length) return;
    function norm(s) {
      var k = String(s || '').toLowerCase().replace(/[^a-z]/g, '');
      if (k.indexOf('facebook') > -1) return 'facebook';
      if (k.indexOf('instagram') > -1) return 'instagram';
      if (k.indexOf('linkedin') > -1) return 'linkedin';
      if (k.indexOf('tiktok') > -1) return 'tiktok';
      if (k.indexOf('youtube') > -1) return 'youtube';
      if (k.indexOf('twitter') > -1 || k === 'x') return 'x';
      return k;
    }
    fetch('/api/social').then(function (r) { return r.ok ? r.json() : []; }).then(function (list) {
      if (!Array.isArray(list)) list = [];
      var map = {};
      list.forEach(function (s) {
        if (s && s.enabled && s.url && String(s.url).trim()) map[norm(s.platform)] = String(s.url).trim();
      });
      anchors.forEach(function (a) {
        var url = map[norm(a.getAttribute('aria-label'))];
        if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.style.display = ''; }
        else { a.style.display = 'none'; }
      });
    }).catch(function () {});
  })();
})();
