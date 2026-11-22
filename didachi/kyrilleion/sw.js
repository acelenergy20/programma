// Κυρίλλειον · service worker: λειτουργία χωρίς σύνδεση
const C='kyrilleion-v1';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./audio/ymnos.mp3'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url); if(e.request.method!=='GET'||u.origin!==location.origin) return;
 // σελίδα: πρῶτα δίκτυο (γιὰ νὰ ἔρχονται οἱ ἐνημερώσεις), ἀλλιῶς ἀποθήκη
 if(e.request.mode==='navigate'){ e.respondWith(fetch(e.request).then(r=>{const cp=r.clone(); caches.open(C).then(c=>c.put('./index.html',cp)); return r;}).catch(()=>caches.match('./index.html'))); return; }
 e.respondWith(caches.match(e.request).then(m=>m||fetch(e.request).then(r=>{ if(r.ok){const cp=r.clone(); caches.open(C).then(c=>c.put(e.request,cp));} return r; })));
});
