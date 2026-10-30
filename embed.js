/* Ενσωμάτωση του Προγράμματος και των Εγγραφών του Λαϊκού Πανεπιστημίου
   Χρήση:
   <div class="lp-embed" data-view="programma"></div>   (ή data-view="eggrafes")
   <script src="https://programma.politisk.gr/embed.js" async></script>
*/
(function(){
  var BASE = "https://programma.politisk.gr/";
  var PATHS = { programma: "", eggrafes: "eggrafes/" };
  var frames = [];
  function mount(el){
    if(el.getAttribute("data-lp-mounted")) return; el.setAttribute("data-lp-mounted","1");
    var view = (el.getAttribute("data-view")||"programma").toLowerCase();
    var f = document.createElement("iframe");
    f.src = BASE + (PATHS[view]!==undefined ? PATHS[view] : "") + "?embed=1";
    f.title = view==="eggrafes" ? "Εγγραφές – Λαϊκό Πανεπιστήμιο" : "Πρόγραμμα – Λαϊκό Πανεπιστήμιο";
    f.loading = "lazy";
    f.setAttribute("allow","clipboard-write");
    f.style.cssText = "width:100%;border:0;display:block;min-height:" + (el.getAttribute("data-min-height")||"900") + "px;background:transparent";
    el.appendChild(f); frames.push(f);
  }
  window.addEventListener("message", function(ev){
    if(ev.origin !== BASE.replace(/\/$/,"")) return;
    var d = ev.data; if(!d || d.type!=="pk-height") return;
    for(var i=0;i<frames.length;i++) if(frames[i].contentWindow === ev.source){ frames[i].style.minHeight="0"; frames[i].style.height = d.height + "px"; }
  });
  function scan(){ var els = document.querySelectorAll(".lp-embed"); for(var i=0;i<els.length;i++) mount(els[i]); }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", scan); else scan();
})();
