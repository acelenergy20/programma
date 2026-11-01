/* Διδαχή · ψηφιακή βοηθός (σύστημα ΤΝ) — παράθυρο συνομιλίας
   Ενσωμάτωση:
   <script src="https://programma.politisk.gr/didachi.js" defer
           data-endpoint="https://bot.politisk.gr"
           data-turnstile=""></script>
   Χωρίς cookies. Η συνομιλία κρατιέται μόνο στην καρτέλα (sessionStorage) και σβήνει όταν κλείσει.
*/
(function () {
  if (customElements.get('didachi-chat')) return;
  const script = document.currentScript;

  const T = {
    el: {
      open: 'Ρωτήστε τη Διδαχή', close: 'Κλείσιμο', title: 'Διδαχή', sub: 'ψηφιακή βοηθός · σύστημα ΤΝ',
      hello: 'Καλώς ορίσατε. Είμαι η Διδαχή, ψηφιακή βοηθός (σύστημα ΤΝ) του Προγράμματος εκμάθησης ψαλτικής. Πώς μπορώ να σας βοηθήσω;',
      ph: 'Γράψτε την ερώτησή σας…', send: 'Αποστολή', wait: 'Η Διδαχή γράφει…', clear: 'Νέα συνομιλία',
      chips: ['Ποια μαθήματα έχει αυτή την εβδομάδα;', 'Πώς γράφομαι στο Λαϊκό Πανεπιστήμιο;', 'Τι είναι ο πρώτος ήχος;'],
      note: 'Απαντά σύστημα τεχνητής νοημοσύνης και μπορεί να κάνει λάθη. Μη γράφετε ευαίσθητα προσωπικά στοιχεία.',
      privacy: 'Προσωπικά δεδομένα', privacyUrl: 'https://politisk.gr/prosopika-dedomena/',
      wTitle: 'Καλώς ορίσατε',
      wText: 'Είμαι η Διδαχή, ψηφιακή βοηθός (σύστημα ΤΝ). Ρωτήστε με ό,τι θέλετε για τον ιστότοπο: θα σας οδηγήσω στη σωστή σελίδα και θα σας πω τι προσφέρεται, από τα μαθήματα και τις εγγραφές του Λαϊκού Πανεπιστημίου ως τη Μουσική στην Κοινότητα και την ψαλτική τέχνη.',
      wAsk: 'Ρωτήστε τη Διδαχή', wLater: 'Συνέχεια στον ιστότοπο', wNote: 'Απαντά σύστημα τεχνητής νοημοσύνης και μπορεί να κάνει λάθη.',
      listen: 'Ακρόαση', stop: 'Διακοπή ακρόασης', mic: 'Υπαγόρευση με τη φωνή', micStop: 'Τέλος υπαγόρευσης', listening: 'Σας ακούω…',
      micNote: 'Η υπαγόρευση χρησιμοποιεί την υπηρεσία φωνής του προγράμματος περιήγησής σας (π.χ. της Google στον Chrome).',
      offline: 'Δεν υπάρχει σύνδεση. Δοκιμάστε ξανά σε λίγο, ή καλέστε τη Γραμματεία στο 210 3216626 (καθημερινές 17:00–20:00).'
    },
    en: {
      open: 'Ask Didache', close: 'Close', title: 'Didache', sub: 'AI assistant',
      hello: 'Welcome. I am Didache, the AI assistant of the programme for learning the psaltic art. How may I help you?',
      ph: 'Type your question…', send: 'Send', wait: 'Didache is writing…', clear: 'New conversation',
      chips: ['Which lectures are on this week?', 'How do I register at the People’s University?', 'What is the first mode?'],
      note: 'Answers come from an AI system and may contain mistakes. Please do not share sensitive personal data.',
      privacy: 'Privacy', privacyUrl: 'https://politisk.gr/en/privacy/',
      wTitle: 'Welcome',
      wText: 'I am Didache, an AI assistant. Ask me anything about this website: I will take you to the right page and tell you what is on offer, from the People\u2019s University courses and registration to Music in the Community and the psaltic art.',
      wAsk: 'Ask Didache', wLater: 'Continue to the website', wNote: 'Answers come from an AI system and may contain mistakes.',
      listen: 'Listen', stop: 'Stop reading', mic: 'Speak your question', micStop: 'Stop dictation', listening: 'Listening…',
      micNote: 'Dictation uses your browser\u2019s speech service (e.g. Google in Chrome).',
      offline: 'No connection. Please try again shortly, or call the Secretariat on +30 210 3216626 (weekdays 17:00–20:00).'
    }
  };

  const ICON = `<svg viewBox="0 0 48 48" aria-hidden="true"><defs><clipPath id="dcc"><circle cx="24" cy="24" r="22"/></clipPath><radialGradient id="dcbg" cx="50%" cy="38%" r="65%"><stop offset="0" stop-color="#f7e8c8"/><stop offset="1" stop-color="#d9b56e"/></radialGradient></defs><circle cx="24" cy="24" r="22" fill="url(#dcbg)"/><g clip-path="url(#dcc)"><path d="M12.6 25 Q11.6 9.2 24 9.4 Q36.4 9.2 35.4 25 L36.6 37.5 Q33 35.5 30.6 34.6 L29.6 26 L18.4 26 L17.4 34.6 Q15 35.5 11.4 37.5 Z" fill="#3a2418"/><rect x="21.3" y="27" width="5.4" height="9" rx="2" fill="#d6a47a"/><path d="M5 49 C7 39 15 35.2 24 35.2 C33 35.2 41 39 43 49 Z" fill="#7a1f1f"/><path d="M16 36.6 Q24 42 32 36.6" fill="none" stroke="#c9a14a" stroke-width="1.6"/><ellipse cx="24" cy="21.8" rx="7.2" ry="9" fill="#e6bc93"/><path d="M16.7 20 Q17 12.4 24 12.2 Q31 12.4 31.3 20 Q29.3 15.6 24 15.2 Q18.7 15.6 16.7 20 Z" fill="#3a2418"/><path d="M19.2 19.1 Q21.1 18 22.8 18.9 M25.2 18.9 Q26.9 18 28.8 19.1" fill="none" stroke="#3a2418" stroke-width=".95" stroke-linecap="round"/><path d="M19.5 21.3 Q21.2 19.8 22.9 21.3 Q21.2 22.5 19.5 21.3 Z M25.1 21.3 Q26.8 19.8 28.5 21.3 Q26.8 22.5 25.1 21.3 Z" fill="#fbf4e6"/><circle cx="21.2" cy="21.2" r=".95" fill="#2a1a10"/><circle cx="26.8" cy="21.2" r=".95" fill="#2a1a10"/><path d="M24 21.6 L23.2 25 Q24 25.6 24.8 25" fill="none" stroke="#a8714c" stroke-width=".7" stroke-linecap="round"/><path d="M22.3 27.3 Q24 28.3 25.7 27.3" fill="none" stroke="#8e3b2f" stroke-width="1" stroke-linecap="round"/><circle cx="20.3" cy="24.6" r="1.4" fill="#d98a6a" opacity=".22"/><circle cx="27.7" cy="24.6" r="1.4" fill="#d98a6a" opacity=".22"/></g><circle cx="24" cy="24" r="22" fill="none" stroke="#c9a14a" stroke-width="1.8"/></svg>`;

  const CSS = `
  :host{all:initial;--ink:#2b1d14;--paper:#fbf7ef;--line:#e6dccb;--red:#7a1f1f;--red2:#5e1616;--gold:#c9a14a;--muted:#6f6254;
    font-family:"Noto Sans","Segoe UI",system-ui,-apple-system,sans-serif;font-size:15px;line-height:1.5;color:var(--ink)}
  *{box-sizing:border-box}
  .fab{position:fixed;right:20px;bottom:20px;z-index:2147483000;width:78px;height:78px;border-radius:50%;border:2px solid var(--gold);
    background:radial-gradient(circle at 35% 30%,#93302a,var(--red) 55%,var(--red2));color:var(--gold);cursor:pointer;
    box-shadow:0 6px 22px rgba(60,20,10,.35);display:grid;place-items:center;padding:0;transition:transform .15s}
  .fab:hover{transform:translateY(-2px)} .fab:focus-visible{outline:3px solid var(--gold);outline-offset:3px}
  .fab svg{width:70px;height:70px}
  .tip{position:fixed;right:108px;bottom:44px;z-index:2147483000;background:var(--paper);border:1px solid var(--line);border-radius:10px;
    padding:6px 12px;font-size:14px;box-shadow:0 3px 12px rgba(0,0,0,.12);font-family:Georgia,"Noto Serif",serif;color:var(--red)}
  .panel{position:fixed;right:20px;bottom:110px;z-index:2147483001;width:min(400px,calc(100vw - 32px));height:min(620px,calc(100vh - 120px));
    background:var(--paper);border:1px solid var(--line);border-radius:16px;box-shadow:0 18px 50px rgba(40,15,5,.30);
    display:flex;flex-direction:column;overflow:hidden}
  .panel[hidden]{display:none}
  header{background:linear-gradient(180deg,var(--red),var(--red2));color:#fff;padding:12px 14px;display:flex;align-items:center;gap:10px;
    border-bottom:2px solid var(--gold)}
  header .mark{width:42px;height:42px;color:var(--gold);flex:none} header .mark svg{width:100%;height:100%}
  header h2{margin:0;font:600 20px/1.1 Georgia,"Noto Serif","Times New Roman",serif;letter-spacing:.02em}
  header p{margin:2px 0 0;font-size:12.5px;opacity:.88}
  header .sp{flex:1}
  .ib{background:transparent;border:1px solid rgba(255,255,255,.35);color:#fff;border-radius:8px;height:32px;min-width:32px;cursor:pointer;font-size:13px;padding:0 8px}
  .ib:hover{background:rgba(255,255,255,.12)} .ib:focus-visible{outline:2px solid var(--gold)}
  .log{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth}
  .m{max-width:88%;padding:9px 12px;border-radius:14px;white-space:normal;word-wrap:break-word}
  .m.a{align-self:flex-start;background:#fff;border:1px solid var(--line);border-top-left-radius:4px}
  .m.u{align-self:flex-end;background:var(--red);color:#fff;border-top-right-radius:4px}
  .m p{margin:0 0 6px} .m p:last-child{margin:0} .m ul{margin:4px 0 6px;padding-left:18px} .m li{margin:2px 0}
  .m a{color:var(--red);font-weight:600;text-underline-offset:2px} .m.u a{color:#fff}
  .m.w{color:var(--muted);font-style:italic;background:transparent;border:none}
  .chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 8px}
  .chip{border:1px solid var(--gold);background:#fff;color:var(--red);border-radius:999px;padding:5px 11px;font:inherit;font-size:13.5px;cursor:pointer}
  .chip:hover{background:#fbf1dd}
  form{display:flex;gap:8px;padding:10px 12px;border-top:1px solid var(--line);background:#fff}
  textarea{flex:1;resize:none;border:1px solid var(--line);border-radius:10px;padding:9px 10px;font:inherit;max-height:120px;min-height:40px;color:var(--ink);background:var(--paper)}
  textarea:focus{outline:2px solid var(--gold);border-color:var(--gold)}
  .send{background:var(--red);color:#fff;border:none;border-radius:10px;padding:0 14px;font:inherit;font-weight:600;cursor:pointer}
  .spk{display:inline-flex;align-items:center;gap:4px;margin-top:6px;border:1px solid var(--line);background:var(--paper);color:var(--red);border-radius:999px;padding:2px 10px 2px 8px;font:inherit;font-size:12.5px;cursor:pointer}
  .spk:hover{border-color:var(--gold)} .spk[aria-pressed=true]{background:#fbf1dd;border-color:var(--gold)}
  .mic{background:#fff;color:var(--red);border:1px solid var(--line);border-radius:10px;width:42px;font-size:18px;cursor:pointer;flex:none}
  .mic[aria-pressed=true]{background:var(--red);color:#fff;border-color:var(--red);animation:pulse 1.2s infinite}
  @keyframes pulse{50%{box-shadow:0 0 0 6px rgba(122,31,31,.18)}}
  .send:disabled{opacity:.5;cursor:default}
  .note{font-size:11.5px;color:var(--muted);padding:6px 14px 10px;background:#fff;line-height:1.35}
  .note a{color:var(--muted)}
  :host([page]) .fab,:host([page]) .tip,:host([page]) .x{display:none}
  :host([page]) .panel{position:fixed;inset:0;width:100vw;height:100dvh;border-radius:0;border:none;max-width:none}
  @media (min-width:760px){:host([page]) .panel{inset:24px auto 24px 50%;transform:translateX(-50%);width:720px;height:calc(100dvh - 48px);border-radius:16px;border:1px solid var(--line)}}
  .wb{position:fixed;inset:0;z-index:2147483002;background:rgba(27,20,14,.45);display:grid;place-items:center;padding:16px;animation:fade .25s ease-out}
  .wc{width:min(440px,100%);background:var(--paper);border:1px solid var(--gold);border-radius:18px;box-shadow:0 24px 60px rgba(40,15,5,.35);overflow:hidden;text-align:center}
  .wc .wh{background:linear-gradient(180deg,var(--red),var(--red2));border-bottom:2px solid var(--gold);padding:22px 20px 16px;color:#fff}
  .wc .wh .mk{width:64px;height:64px;margin:0 auto 8px;color:var(--gold)} .wc .wh .mk svg{width:100%;height:100%}
  .wc h2{margin:0;font:600 26px/1.15 Georgia,"Noto Serif",serif;letter-spacing:.02em}
  .wc .wh p{margin:4px 0 0;font-size:13px;opacity:.9}
  .wc .wb2{padding:18px 22px 20px}
  .wc .wb2 p{margin:0 0 16px;font-size:15.5px;line-height:1.55}
  .wc .acts{display:flex;flex-direction:column;gap:8px}
  .wc .go{background:var(--red);color:#fff;border:none;border-radius:999px;padding:11px 18px;font:inherit;font-weight:600;font-size:15.5px;cursor:pointer}
  .wc .go:hover{background:var(--red2)} .wc .go:focus-visible,.wc .later:focus-visible{outline:3px solid var(--gold);outline-offset:2px}
  .wc .later{background:transparent;border:none;color:var(--muted);font:inherit;font-size:14px;cursor:pointer;padding:6px;text-decoration:underline;text-underline-offset:3px}
  .wc small{display:block;margin-top:10px;color:var(--muted);font-size:11.5px}
  @keyframes fade{from{opacity:0}to{opacity:1}}
  @media (prefers-reduced-motion:reduce){.wb{animation:none}}
  @media (max-width:520px){.panel{right:0;bottom:0;width:100vw;height:100dvh;border-radius:0;border:none}.tip{display:none}}
  @media (prefers-reduced-motion:reduce){.fab{transition:none}.log{scroll-behavior:auto}}`;

  function esc(s) { return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  // Ασφαλής απόδοση: μόνο παράγραφοι, κουκκίδες, έντονα και σύνδεσμοι http(s)/mailto/tel.
  function render(md) {
    const inline = t => esc(t)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\(((?:https?:\/\/|mailto:|tel:)[^\s)]+)\)/g, (_, a, u) => `<a href="${u}" target="_blank" rel="noopener">${a}</a>`)
      .replace(/(^|[\s(])(https?:\/\/[^\s<)]+[^\s<).,;])/g, (_, p, u) => `${p}<a href="${u}" target="_blank" rel="noopener">${u.replace(/^https?:\/\//, '')}</a>`);
    const out = []; let list = null;
    for (const raw of md.split('\n')) {
      const line = raw.trim();
      const li = line.match(/^[-•*]\s+(.*)/);
      if (li) { if (!list) { list = []; } list.push(`<li>${inline(li[1])}</li>`); continue; }
      if (list) { out.push(`<ul>${list.join('')}</ul>`); list = null; }
      if (line) out.push(`<p>${inline(line)}</p>`);
    }
    if (list) out.push(`<ul>${list.join('')}</ul>`);
    return out.join('');
  }

  class DidachiChat extends HTMLElement {
    connectedCallback() {
      const ds = (script && script.dataset) || {};
      this.endpoint = (this.getAttribute('endpoint') || ds.endpoint || 'https://bot.politisk.gr').replace(/\/$/, '');
      this.sitekey = this.getAttribute('turnstile') || ds.turnstile || '';
      const docLang = (document.documentElement.lang || '').slice(0, 2);
      let qLang = ''; try { qLang = (new URLSearchParams(location.search).get('lang') || '').slice(0, 2).toLowerCase(); } catch (e) {}
      const want = this.getAttribute('lang') || ds.lang || qLang;
      this.lang = T[want] ? want : (location.pathname.startsWith('/en/') || docLang === 'en' ? 'en' : 'el');
      this.t = T[this.lang];
      this.key = 'didachi.v1';
      this.state = this.load();
      const r = this.attachShadow({ mode: 'open' });
      r.innerHTML = `<style>${CSS}</style>
        <span class="tip" part="tip">${this.t.open}</span>
        <button class="fab" aria-haspopup="dialog" aria-expanded="false" aria-label="${this.t.open}">${ICON}</button>
        <section class="panel" role="dialog" aria-modal="false" aria-label="${this.t.title} — ${this.t.sub}" hidden>
          <header><span class="mark">${ICON}</span><div><h2>${this.t.title}</h2><p>${this.t.sub}</p></div><span class="sp"></span>
            <button class="ib clr" type="button" title="${this.t.clear}" aria-label="${this.t.clear}">↺</button>
            <button class="ib x" type="button" aria-label="${this.t.close}">✕</button></header>
          <div class="log" role="log" aria-live="polite"></div>
          <div class="chips"></div>
          <form><button class="mic" type="button" hidden aria-pressed="false" aria-label="${this.t.mic}" title="${this.t.mic}">🎤</button><textarea rows="1" maxlength="1200" aria-label="${this.t.ph}" placeholder="${this.t.ph}"></textarea>
            <button class="send" type="submit">${this.t.send}</button></form>
          <div class="note">${this.t.note} <span class="micnote" hidden>${this.t.micNote} </span><a href="${this.t.privacyUrl}" target="_blank" rel="noopener">${this.t.privacy}</a></div>
        </section>`;
      this.$ = s => r.querySelector(s);
      this.$('.fab').addEventListener('click', () => this.toggle());
      this.$('.x').addEventListener('click', () => this.toggle(false));
      this.$('.clr').addEventListener('click', () => { this.state = { messages: [], session: this.state.session }; this.save(); this.paint(); });
      this.$('form').addEventListener('submit', e => { e.preventDefault(); this.send(); });
      const ta = this.$('textarea');
      ta.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.send(); } });
      ta.addEventListener('input', () => { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'; });
      this.$('.panel').addEventListener('keydown', e => { if (e.key === 'Escape') this.toggle(false); });
      this.setupVoice();
      setTimeout(() => { const tip = this.$('.tip'); if (tip) tip.remove(); }, 9000);
      if (ds.mode === 'page') this.setAttribute('page', '');
      if (ds.welcome && !this.hasAttribute('page') && !this.state.messages.length) {
        let seen = false; try { seen = sessionStorage.getItem('didachi.welcomed') === '1'; } catch {}
        if (!seen) setTimeout(() => this.welcome(), 900);
      }
      if (this.state.open || this.hasAttribute('page')) this.toggle(true);
    }
    welcome() {
      if (this.$('.wb') || !this.$('.panel').hidden) return;
      try { sessionStorage.setItem('didachi.welcomed', '1'); } catch {}
      const t = this.t, w = document.createElement('div');
      w.className = 'wb';
      w.innerHTML = `<div class="wc" role="dialog" aria-modal="true" aria-labelledby="dw-t" aria-describedby="dw-d">
        <div class="wh"><div class="mk">${ICON}</div><h2 id="dw-t">${t.wTitle}</h2><p>${t.title} · ${t.sub}</p></div>
        <div class="wb2"><p id="dw-d">${t.wText}</p>
          <div class="acts"><button class="go" type="button">${t.wAsk}</button><button class="later" type="button">${t.wLater}</button></div>
          <small>${t.wNote}</small></div></div>`;
      const close = (open) => { w.remove(); document.removeEventListener('keydown', esc, true); if (open) this.toggle(true); else this.$('.fab').focus(); };
      const esc = e => { if (e.key === 'Escape') close(false); if (e.key === 'Tab') { const b = [...w.querySelectorAll('button')]; const i = b.indexOf(this.shadowRoot.activeElement); if (e.shiftKey && i <= 0) { e.preventDefault(); b.at(-1).focus(); } else if (!e.shiftKey && i === b.length - 1) { e.preventDefault(); b[0].focus(); } } };
      w.addEventListener('click', e => { if (e.target === w) close(false); });
      w.querySelector('.go').addEventListener('click', () => close(true));
      w.querySelector('.later').addEventListener('click', () => close(false));
      document.addEventListener('keydown', esc, true);
      const tip = this.$('.tip'); if (tip) tip.remove();
      this.shadowRoot.appendChild(w);
      w.querySelector('.go').focus();
    }
    load() { try { return JSON.parse(sessionStorage.getItem(this.key)) || { messages: [] }; } catch { return { messages: [] }; } }
    save() { try { sessionStorage.setItem(this.key, JSON.stringify(this.state)); } catch {} }
    toggle(force) {
      const p = this.$('.panel'), open = force ?? p.hidden;
      if (!open && this.hasAttribute('page')) return;
      p.hidden = !open; this.$('.fab').setAttribute('aria-expanded', String(open));
      const tip = this.$('.tip'); if (tip) tip.remove();
      this.state.open = open; this.save();
      if (open) { this.paint(); this.$('textarea').focus(); } else this.$('.fab').focus();
    }
    paint() {
      const log = this.$('.log');
      log.innerHTML = '';
      this.bubble('a', this.t.hello);
      for (const m of this.state.messages) this.bubble(m.role === 'user' ? 'u' : 'a', m.content, m.sig);
      const chips = this.$('.chips'); chips.innerHTML = '';
      if (!this.state.messages.length) for (const c of this.t.chips) {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = c;
        b.addEventListener('click', () => { this.$('textarea').value = c; this.send(); }); chips.appendChild(b);
      }
    }
    bubble(kind, text, sig) {
      const d = document.createElement('div'); d.className = 'm ' + kind;
      if (kind === 'u') d.textContent = text; else if (kind === 'w') d.textContent = text; else d.innerHTML = render(text);
      if (kind === 'a' && (this.voice || this.serverTts)) {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'spk'; b.setAttribute('aria-pressed', 'false');
        b.innerHTML = '<span aria-hidden="true">🔊</span> ' + this.t.listen;
        b.addEventListener('click', () => this.speak(text, b, sig)); d.appendChild(b); d._spk = b;
      }
      this.$('.log').appendChild(d); d.scrollIntoView({ block: 'end' });
      return d;
    }
    // ---------- φωνή: ακρόαση (speechSynthesis) και υπαγόρευση (SpeechRecognition), μόνο με τα εργαλεία του browser ----------
    setupVoice() {
      const want = this.lang === 'en' ? 'en' : 'el';
      const pick = () => {
        const vs = (window.speechSynthesis && speechSynthesis.getVoices()) || [];
        const mine = vs.filter(v => (v.lang || '').toLowerCase().startsWith(want));
        const pref = want === 'en' ? /en-gb/i : /el-gr/i;
        this.voice = mine.find(v => pref.test(v.lang) && /google|natural|premium|enhanced/i.test(v.name)) || mine.find(v => pref.test(v.lang)) || mine[0] || null;
        if (this.voice && this.state.open) this.paint();
      };
      fetch(this.endpoint + '/health').then(r => r.json()).then(h => { if (h.tts) { this.serverTts = true; if (this.state.open) this.paint(); } }).catch(() => {});
      if ('speechSynthesis' in window) { pick(); speechSynthesis.addEventListener && speechSynthesis.addEventListener('voiceschanged', pick); }
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SR) {
        const mic = this.$('.mic'); mic.hidden = false; this.$('.micnote').hidden = false;
        mic.addEventListener('click', () => this.dictate(SR, mic));
      }
    }
    speakable(md) {
      let t = md.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/https?:\/\/\S+/g, '').replace(/[*_#>`]/g, '')
        .split('\n').map(l => l.replace(/^\s*[-•]\s+/, '').trim()).filter(Boolean)
        .map(l => /[.;:!?;»)]$/.test(l) ? l : l + '.').join(' ');
      if (this.lang !== 'en') {
        const B = '(?<![Α-Ωα-ωΆ-Ώά-ώA-Za-z])';           // αρχή λέξης (το \b δεν πιάνει ελληνικά)
        const R = (re, to) => { t = t.replace(new RegExp(B + re, 'g'), to); };
        const GEN = { 'α': 'πρώτου', 'β': 'δευτέρου', 'γ': 'τρίτου', 'δ': 'τετάρτου' }, NOM = { 'α': 'πρώτος', 'β': 'δεύτερος', 'γ': 'τρίτος', 'δ': 'τέταρτος' };
        t = t.replace(new RegExp(B + 'πλ\\.\\s?([αβγδ])΄', 'g'), (_, n) => 'πλάγιος του ' + GEN[n]);
        t = t.replace(new RegExp(B + '([αβγδ])΄(?=\\s+ήχ)', 'g'), (_, n) => NOM[n]);
        R('πλ\\.\\s?', 'πλάγιος ');
        t = t.replace(/(^|\s)(τον|Τον) κ\.\s/g, '$1$2 κύριο ').replace(/(^|\s)(του|Του) κ\.\s/g, '$1$2 κυρίου ').replace(/(^|\s)(ο|Ο) κ\.\s/g, '$1$2 κύριος ');
        R('κ\\.\\s(?=[Α-Ω])', 'κύριο '); R('σ\\.\\s?(?=\\d)', 'σελίδα ');
        R('τηλ\\.\\s?', 'τηλέφωνο '); R('Θ\\. Φωκαεύς', 'Θεόδωρος Φωκαεύς'); R('π\\.χ\\.', 'παραδείγματος χάρη');
        t = t.replace(/\(σύστημα ΤΝ\)/g, ', σύστημα τεχνητής νοημοσύνης,').replace(new RegExp(B + 'ΤΝ(?![Α-Ω])', 'g'), 'τεχνητή νοημοσύνη')
          .replace(/(\d{1,2}):00\s?[–-]\s?(\d{1,2}):00/g, '$1 έως $2').replace(/(\d+)\s?€/g, '$1 ευρώ')
          .replace(/([Α-Ωα-ω])΄/g, '$1');
      }
      return t.replace(/\s+/g, ' ').trim();
    }
    stopSpeaking() {
      if (window.speechSynthesis) speechSynthesis.cancel();
      if (this.audio) { this.audio.pause(); this.audio = null; }
      if (this.speaking) { this.speaking.setAttribute('aria-pressed', 'false'); this.speaking.lastChild.textContent = ' ' + this.t.listen; this.speaking = null; }
    }
    async speak(text, btn, sig) {
      const same = this.speaking === btn; this.stopSpeaking();
      if (same) return;                                   // δεύτερο πάτημα: διακοπή
      btn.setAttribute('aria-pressed', 'true'); btn.lastChild.textContent = ' ' + this.t.stop; this.speaking = btn;
      const done = () => { if (this.speaking === btn) { btn.setAttribute('aria-pressed', 'false'); btn.lastChild.textContent = ' ' + this.t.listen; this.speaking = null; this.audio = null; } };
      if (this.serverTts) {                               // γυναικεία φωνή της Διδαχής, ίδια παντού
        try {
          const r = await fetch(this.endpoint + '/tts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, sig, lang: this.lang }) });
          if (!r.ok) throw new Error('tts ' + r.status);
          const url = URL.createObjectURL(await r.blob());
          if (this.speaking !== btn) return;              // πατήθηκε διακοπή στο μεταξύ
          const a = new Audio(url); this.audio = a;
          a.onended = a.onerror = () => { URL.revokeObjectURL(url); done(); };
          await a.play();
          return;
        } catch (e) { if (this.speaking !== btn) return; }   // αλλιώς: φωνή της συσκευής
      }
      const ss = window.speechSynthesis; if (!ss || !this.voice) return done();
      const u = new SpeechSynthesisUtterance(this.speakable(text));
      try { u.voice = this.voice; } catch (e) {} u.lang = this.voice ? this.voice.lang : (this.lang === 'en' ? 'en-GB' : 'el-GR'); u.rate = 0.95;
      u.onend = done; u.onerror = done;
      ss.speak(u);
    }
    dictate(SR, mic) {
      if (this.rec) { this.rec.stop(); return; }
      this.stopSpeaking();
      const ta = this.$('textarea'), before = ta.value;
      const rec = new SR(); this.rec = rec;
      rec.lang = this.lang === 'en' ? 'en-GB' : 'el-GR'; rec.interimResults = true; rec.continuous = false;
      mic.setAttribute('aria-pressed', 'true'); mic.setAttribute('aria-label', this.t.micStop); ta.placeholder = this.t.listening;
      let finalText = '';
      rec.onresult = e => {
        let interim = ''; finalText = '';
        for (const r of e.results) (r.isFinal ? (finalText += r[0].transcript) : (interim += r[0].transcript));
        ta.value = (before ? before + ' ' : '') + (finalText || interim);
      };
      rec.onend = () => {
        this.rec = null; mic.setAttribute('aria-pressed', 'false'); mic.setAttribute('aria-label', this.t.mic); ta.placeholder = this.t.ph;
        if (finalText.trim()) { this.dictated = true; this.send(); } else ta.focus();
      };
      rec.onerror = () => {};
      try { rec.start(); } catch { rec.onend(); }
    }
    async turnstileToken() {
      if (!this.sitekey) return undefined;
      if (!window.turnstile) await new Promise((ok, no) => {
        const s = document.createElement('script'); s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        s.async = true; s.onload = ok; s.onerror = no; document.head.appendChild(s);
      });
      return new Promise(ok => {
        const host = document.createElement('div'); host.style.cssText = 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:2147483002';
        document.body.appendChild(host);
        window.turnstile.render(host, { sitekey: this.sitekey, appearance: 'interaction-only', language: this.lang,
          callback: tok => { ok(tok); setTimeout(() => host.remove(), 300); },
          'error-callback': () => { ok(''); host.remove(); } });
      });
    }
    async send() {
      const ta = this.$('textarea'), text = ta.value.trim();
      if (!text || this.busy) return;
      this.busy = true; this.$('.send').disabled = true; ta.value = ''; ta.style.height = '';
      this.$('.chips').innerHTML = '';
      this.state.messages.push({ role: 'user', content: text }); this.save();
      this.bubble('u', text);
      const w = this.bubble('w', this.t.wait);
      let reply, res, data;
      try {
        const body = { messages: this.state.messages.slice(-12), lang: this.lang, page: location.href.split('#')[0], session: this.state.session };
        if (this.sitekey && !this.state.session) body.turnstile = await this.turnstileToken();
        res = await fetch(this.endpoint + '/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        data = await res.json().catch(() => ({}));
        if (data.needs_verification && this.sitekey) {           // η συνεδρία έληξε: νέος έλεγχος, μία φορά
          this.state.session = undefined; body.session = undefined; body.turnstile = await this.turnstileToken();
          res = await fetch(this.endpoint + '/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
          data = await res.json().catch(() => ({}));
        }
        if (data.session) this.state.session = data.session;
        reply = data.reply || this.t.offline;
        if (res.ok) this.state.messages.push({ role: 'assistant', content: reply, sig: data.sig });
        else this.state.messages.pop();            // αποτυχία: δεν κρατάμε την ερώτηση στο ιστορικό
      } catch { reply = this.t.offline; this.state.messages.pop(); }
      this.save(); w.remove(); const ab = this.bubble('a', reply, res && res.ok ? data.sig : undefined);
      if (this.dictated && ab._spk) this.speak(reply, ab._spk, res && res.ok ? data.sig : undefined);
      this.dictated = false;
      this.busy = false; this.$('.send').disabled = false; ta.focus();
    }
  }
  customElements.define('didachi-chat', DidachiChat);
  // Όχι μέσα σε iframe ή σε λειτουργία ενσωμάτωσης (?embed=1): εκεί η σελίδα φιλοξενείται σε άλλον ιστότοπο.
  let inFrame = false; try { inFrame = window.self !== window.top; } catch (e) { inFrame = true; }
  if (inFrame || /[?&]embed=1\b/.test(location.search)) return;
  const mount = () => { if (!document.querySelector('didachi-chat')) document.body.appendChild(document.createElement('didachi-chat')); };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', mount) : mount();
})();
