"""Παράγει τη σελίδα anamorfosi/index.html από το index.html του προγράμματος
(ίδια αισθητική, μόνο η ενότητα της Μελέτης Αναμόρφωσης). Τρέξτε: python3 build_anamorfosi.py"""
import re, os
s = open('index.html', encoding='utf-8').read()
s = s.replace('<script src="data.js"></script>',
  '<script>window.PK_MODE="reform";window.PK_REG="../eggrafes/";</script>\n<script src="../data.js"></script>')
s = s.replace('<script src="bios.js"></script>', '<script src="../bios.js"></script>')
s = s.replace('src="logo-bronze.png"', 'src="../logo-bronze.png"')
s = s.replace('src="assets/embed-mode.js"', 'src="../assets/embed-mode.js"')
s = re.sub(r'<title>[^<]*</title>', '<title>Μελέτη Αναμόρφωσης και Εκσυγχρονισμού · Εταιρεία των Φίλων του Λαού</title>', s, 1)
s = s.replace('<meta name="description" content="Πρόγραμμα Λαϊκού Πανεπιστημίου της Εταιρείας των Φίλων του Λαού, Α΄ εξάμηνο 2026–27.">',
  '<meta name="description" content="Μελέτη Αναμόρφωσης και Εκσυγχρονισμού της Εταιρείας των Φίλων του Λαού (Ιούλιος 2026): άξονες, φάσεις, δείκτες.">')
s = s.replace('<style>body{margin:0}</style>', '<style>body{margin:0}.tabs,.freeband,#upnext,#term{display:none!important}</style>')
s = s.replace('<h1>Πρόγραμμα Α΄ εξαμήνου 2026–27</h1>', '<h1>Μελέτη Αναμόρφωσης και Εκσυγχρονισμού</h1>')
s = s.replace('<p class="sub">162ο ακαδημαϊκό έτος · Ευριπίδου 12, Αθήνα</p>', '<p class="sub">Ιούλιος 2026 · Εσωτερικό έγγραφο εργασίας</p>')
s = s.replace('<div class="eyebrow">Εταιρεία των Φίλων του Λαού · Λαϊκό Πανεπιστήμιο · από το 1865</div>', '<div class="eyebrow">Εταιρεία των Φίλων του Λαού · από το 1865</div>')
s = s.replace('href="https://politisk.gr/" style="color:#8e1b1b', 'href="https://politisk.gr/#etaireia" style="color:#8e1b1b', 1)
os.makedirs('anamorfosi', exist_ok=True)
open('anamorfosi/index.html', 'w', encoding='utf-8').write(s)
print('ok', s.count('../data.js'), s.count('PK_MODE'))
