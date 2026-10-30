/* Λειτουργία ενσωμάτωσης: όταν η σελίδα φορτώνεται μέσα σε άλλο site (iframe) ή με ?embed=1 */
(function(){
  var inFrame = false; try { inFrame = window.self !== window.top; } catch(e){ inFrame = true; }
  var forced = /[?&]embed=1\b/.test(location.search);
  if(!inFrame && !forced) return;
  var css = document.createElement("style");
  css.textContent = ".pk-home{display:none!important}" +
    ".pk-credit{margin:28px auto 8px;text-align:center;font:600 14px/1.4 'Commissioner','Segoe UI',system-ui,sans-serif;color:#5a4a36}" +
    ".pk-credit a{color:#8e1b1b}";
  document.head.appendChild(css);
  function ready(fn){ if(document.readyState!=="loading") fn(); else document.addEventListener("DOMContentLoaded", fn); }
  ready(function(){
    document.documentElement.classList.add("pk-embed");
    var c = document.createElement("div");
    c.className = "pk-credit";
    c.innerHTML = 'Λαϊκό Πανεπιστήμιο · <a href="https://programma.politisk.gr/" target="_blank" rel="noopener">Εταιρεία των Φίλων του Λαού</a>';
    document.body.appendChild(c);
    // Οι σύνδεσμοι προς άλλους ιστότοπους ανοίγουν σε νέα καρτέλα
    document.addEventListener("click", function(ev){
      var a = ev.target.closest && ev.target.closest("a[href]"); if(!a) return;
      var u; try { u = new URL(a.href, location.href); } catch(e){ return; }
      if(u.host && u.host !== location.host && !a.target){ a.target = "_blank"; a.rel = "noopener"; }
    }, true);
    // Αυτόματο ύψος: ενημερώνει το site που φιλοξενεί
    var last = 0;
    function send(){
      var h = Math.ceil(Math.max(document.documentElement.scrollHeight, document.body.scrollHeight));
      if(Math.abs(h-last) < 2) return; last = h;
      try { parent.postMessage({ type:"pk-height", height:h, path:location.pathname }, "*"); } catch(e){}
    }
    if(window.ResizeObserver) new ResizeObserver(send).observe(document.body);
    window.addEventListener("load", send); window.addEventListener("hashchange", function(){ setTimeout(send,60); });
    setInterval(send, 1000); send();
  });
})();
