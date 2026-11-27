# Σφραγίδα έκδοσης για Κυρίλλειον: γράφει kyrilleion/version.txt και ενημερώνει τις δύο σελίδες
import time,re
V=time.strftime('%Y%m%d%H%M%S')
SNIP='<script id="kyrver">(function(){var V="%s";try{fetch("/kyrilleion/version.txt?t="+Date.now(),{cache:"no-store"}).then(function(r){return r.ok?r.text():""}).then(function(t){t=(t||"").trim();if(t&&t!==V){var k="kyrrl"+t;try{if(sessionStorage.getItem(k))return;sessionStorage.setItem(k,"1")}catch(e){}location.reload()}}).catch(function(){})}catch(e){}})();</script>'
for p in ['kyrilleion/index.html','didachi/kyrilleion/index.html']:
    s=open(p,encoding='utf8').read()
    s=re.sub(r'<script id="kyrver">.*?</script>','',s,flags=re.S)
    s=s.replace('</head>',SNIP%V+'\n</head>',1)
    open(p,'w',encoding='utf8').write(s)
open('kyrilleion/version.txt','w').write(V+'\n'); print(V)
