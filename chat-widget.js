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

  // Conversation history sent to the API (excludes the greeting bubble).
  var history = [];
  var busy = false;

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
        '<div><h4>C Design Assistant</h4><p>Typically replies instantly</p></div>' +
        '<button class="x" aria-label="Close">&times;</button>' +
      '</div>' +
      '<div class="cdchat-body"></div>' +
      '<div class="cdchat-sugg"></div>' +
      '<div class="cdchat-foot">' +
        '<input type="text" placeholder="Type your message…" maxlength="1000" aria-label="Your message">' +
        '<button class="send" aria-label="Send">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>' +
        '</button>' +
      '</div>' +
      '<div class="cdchat-legal">Powered by AI · <a href="/pricing">Get a free quote</a></div>' +
    '</div>';
  document.body.appendChild(wrap);

  var btn    = wrap.querySelector('.cdchat-btn');
  var badge  = wrap.querySelector('.cdchat-badge');
  var panel  = wrap.querySelector('.cdchat-panel');
  var body   = wrap.querySelector('.cdchat-body');
  var sugg   = wrap.querySelector('.cdchat-sugg');
  var input  = wrap.querySelector('.cdchat-foot input');
  var sendBt = wrap.querySelector('.cdchat-foot .send');
  var closeB = wrap.querySelector('.cdchat-head .x');

  function scrollDown() { body.scrollTop = body.scrollHeight; }

  function addMsg(text, who) {
    var m = document.createElement('div');
    m.className = 'cdchat-msg ' + who;
    m.textContent = text;
    body.appendChild(m);
    scrollDown();
    return m;
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
    addMsg("Hi 👋 I'm the C Design assistant. Ask me about our web design, e-commerce, SEO or marketing services — or about our £200 launch offer that gets your business fully online (website, SEO, Google & social).", 'bot');
    renderSuggestions();
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
    addMsg(text, 'user');
    history.push({ role: 'user', content: text });

    busy = true;
    sendBt.disabled = true;
    var typing = document.createElement('div');
    typing.className = 'cdchat-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(typing);
    scrollDown();

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history, cid: cid })
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        typing.remove();
        var reply = (data && data.reply) ? data.reply
          : "Sorry, something went wrong. Please try again or use the contact form.";
        addMsg(reply, 'bot');
        history.push({ role: 'assistant', content: reply });
      })
      .catch(function () {
        typing.remove();
        addMsg("I couldn't reach the server. Please check your connection or use the contact form on our site.", 'bot');
      })
      .finally(function () {
        busy = false;
        sendBt.disabled = false;
        input.focus();
      });
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
})();
