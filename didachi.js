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
      offline: 'Δεν υπάρχει σύνδεση. Δοκιμάστε ξανά σε λίγο, ή καλέστε τη Γραμματεία στο 210 3216626 (καθημερινές 17:00–20:00).'
    },
    en: {
      open: 'Ask Didache', close: 'Close', title: 'Didache', sub: 'AI assistant',
      hello: 'Welcome. I am Didache, the AI assistant of the programme for learning the psaltic art. How may I help you?',
      ph: 'Type your question…', send: 'Send', wait: 'Didache is writing…', clear: 'New conversation',
      chips: ['Which lectures are on this week?', 'How do I register at the People’s University?', 'What is the first mode?'],
      note: 'Answers come from an AI system and may contain mistakes. Please do not share sensitive personal data.',
      privacy: 'Privacy', privacyUrl: 'https://politisk.gr/en/privacy/',
      offline: 'No connection. Please try again shortly, or call the Secretariat on +30 210 3216626 (weekdays 17:00–20:00).'
    }
  };

  const ICON = `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".55"/><path d="M24 11 L36 35 H12 Z" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/><path d="M9 39 H39" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity=".7"/></svg>`;

  const CSS = `
  :host{all:initial;--ink:#2b1d14;--paper:#fbf7ef;--line:#e6dccb;--red:#7a1f1f;--red2:#5e1616;--gold:#c9a14a;--muted:#6f6254;
    font-family:"Noto Sans","Segoe UI",system-ui,-apple-system,sans-serif;font-size:15px;line-height:1.5;color:var(--ink)}
  *{box-sizing:border-box}
  .fab{position:fixed;right:20px;bottom:20px;z-index:2147483000;width:62px;height:62px;border-radius:50%;border:2px solid var(--gold);
    background:radial-gradient(circle at 35% 30%,#93302a,var(--red) 55%,var(--red2));color:var(--gold);cursor:pointer;
    box-shadow:0 6px 22px rgba(60,20,10,.35);display:grid;place-items:center;padding:0;transition:transform .15s}
  .fab:hover{transform:translateY(-2px)} .fab:focus-visible{outline:3px solid var(--gold);outline-offset:3px}
  .fab svg{width:40px;height:40px}
  .tip{position:fixed;right:92px;bottom:36px;z-index:2147483000;background:var(--paper);border:1px solid var(--line);border-radius:10px;
    padding:6px 12px;font-size:14px;box-shadow:0 3px 12px rgba(0,0,0,.12);font-family:Georgia,"Noto Serif",serif;color:var(--red)}
  .panel{position:fixed;right:20px;bottom:96px;z-index:2147483001;width:min(400px,calc(100vw - 32px));height:min(620px,calc(100vh - 120px));
    background:var(--paper);border:1px solid var(--line);border-radius:16px;box-shadow:0 18px 50px rgba(40,15,5,.30);
    display:flex;flex-direction:column;overflow:hidden}
  .panel[hidden]{display:none}
  header{background:linear-gradient(180deg,var(--red),var(--red2));color:#fff;padding:12px 14px;display:flex;align-items:center;gap:10px;
    border-bottom:2px solid var(--gold)}
  header .mark{width:38px;height:38px;color:var(--gold);flex:none} header .mark svg{width:100%;height:100%}
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
  .send:disabled{opacity:.5;cursor:default}
  .note{font-size:11.5px;color:var(--muted);padding:6px 14px 10px;background:#fff;line-height:1.35}
  .note a{color:var(--muted)}
  :host([page]) .fab,:host([page]) .tip,:host([page]) .x{display:none}
  :host([page]) .panel{position:fixed;inset:0;width:100vw;height:100dvh;border-radius:0;border:none;max-width:none}
  @media (min-width:760px){:host([page]) .panel{inset:24px auto 24px 50%;transform:translateX(-50%);width:720px;height:calc(100dvh - 48px);border-radius:16px;border:1px solid var(--line)}}
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
      this.lang = this.getAttribute('lang') || (location.pathname.startsWith('/en/') || docLang === 'en' ? 'en' : 'el');
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
          <form><textarea rows="1" maxlength="1200" aria-label="${this.t.ph}" placeholder="${this.t.ph}"></textarea>
            <button class="send" type="submit">${this.t.send}</button></form>
          <div class="note">${this.t.note} <a href="${this.t.privacyUrl}" target="_blank" rel="noopener">${this.t.privacy}</a></div>
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
      setTimeout(() => { const tip = this.$('.tip'); if (tip) tip.remove(); }, 9000);
      if (ds.mode === 'page') this.setAttribute('page', '');
      if (this.state.open || this.hasAttribute('page')) this.toggle(true);
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
      for (const m of this.state.messages) this.bubble(m.role === 'user' ? 'u' : 'a', m.content);
      const chips = this.$('.chips'); chips.innerHTML = '';
      if (!this.state.messages.length) for (const c of this.t.chips) {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = c;
        b.addEventListener('click', () => { this.$('textarea').value = c; this.send(); }); chips.appendChild(b);
      }
    }
    bubble(kind, text) {
      const d = document.createElement('div'); d.className = 'm ' + kind;
      if (kind === 'u') d.textContent = text; else if (kind === 'w') d.textContent = text; else d.innerHTML = render(text);
      this.$('.log').appendChild(d); d.scrollIntoView({ block: 'end' });
      return d;
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
      let reply;
      try {
        const body = { messages: this.state.messages.slice(-12), lang: this.lang, page: location.href.split('#')[0], session: this.state.session };
        if (this.sitekey && !this.state.session) body.turnstile = await this.turnstileToken();
        let res = await fetch(this.endpoint + '/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        let data = await res.json().catch(() => ({}));
        if (data.needs_verification && this.sitekey) {           // η συνεδρία έληξε: νέος έλεγχος, μία φορά
          this.state.session = undefined; body.session = undefined; body.turnstile = await this.turnstileToken();
          res = await fetch(this.endpoint + '/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
          data = await res.json().catch(() => ({}));
        }
        if (data.session) this.state.session = data.session;
        reply = data.reply || this.t.offline;
        if (res.ok) this.state.messages.push({ role: 'assistant', content: reply });
        else this.state.messages.pop();            // αποτυχία: δεν κρατάμε την ερώτηση στο ιστορικό
      } catch { reply = this.t.offline; this.state.messages.pop(); }
      this.save(); w.remove(); this.bubble('a', reply);
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
