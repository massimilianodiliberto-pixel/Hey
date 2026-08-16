# HEY — sito v1

Sito statico. Nessun build step, nessuna dipendenza a runtime: si apre da filesystem
e si pubblica su qualunque host statico copiando la cartella.

Riferimento normativo: `HEY_MASTER_CONTEXT.md`. Dove questo documento e il master
context divergono, vale il master context.

---

## Struttura

```
index.html
site.webmanifest
assets/
  css/hey.css
  fonts/            Archivo Narrow (SIL OFL 1.1) + licenza
  img/brand/        marchio reversed SVG, favicon, apple-touch-icon
  img/frames/       i tre stati dello shot × AVIF/WebP/JPEG × 3 larghezze
  js/
    ticker.js       un solo rAF condiviso, scroll in cache, preferenza motion
    media.js        decodifica immagini, cover-fit, pennelli, dissolvenza
    traversal.js    §6.1 attraversamento ancorato allo scroll
    reveal.js       §6.2 rivelazione hero
    scrub.js        §6.3 timeline di processo
    ui.js           navigazione, sezione corrente, form
```

I moduli sono script classici che si appendono a `window.HEY`, non moduli ES: così
la pagina funziona anche aperta da `file://`, senza server.

---

## Le tre interazioni

**Attraversamento (§6.1).** Lo stage dell'hero è `sticky` dentro una traccia alta più
di un viewport. La progressione è una funzione pura della posizione di scroll, non
un'animazione con stato: per questo scorre identica avanti e indietro, come una clip
su una testina. La camera avanza in scala e bascula verso il basso, così l'immagine
esce dai bordi e la si attraversa invece di vederla sfumare.

**Rivelazione hero (§6.2).** Due livelli sovrapposti al pixel. Il livello generativo è
ritagliato da un campo ad accumulo su cui il puntatore deposita macchie che decadono
da sole: l'apertura è sfrangiata e si richiude dietro. Non esiste linea, maniglia né
percentuale — il vincolo del §6.2 è rispettato per costruzione, non per stile.

Il lime non è disegnato come forma. È la **differenza tra l'apertura e una sua copia
dilatata**: può esistere solo dove il fotogramma si sta aprendo e si spegne dove
l'apertura è compiuta. Il colore è l'atto di rivelare, non un'etichetta sopra.

Sotto l'apertura, il livello generativo è disegnato leggermente più grande della
base: fa parallasse e legge come uno strato sotto la superficie del film.

**Scrub di processo (§6.3).** Sei stati sullo stesso shot. Gli stati di lavorazione
(effetti speciali, compositing, trasformazione) stanno incassati dietro un filo lime,
con le annotazioni sul rig; l'idea e il film finito vanno a pieno campo. L'ultimo
passaggio è quello in cui il mestiere sparisce.

Le due transizioni che cambiano davvero immagine dissolvono per materia: chiazze che
arrivano in ordine sparso ma fisso, con un orlo lime sul fronte.

---

## Prestazioni

- I tre fotogrammi sono decodificati con `decode()` prima che qualunque livello
  diventi interattivo: il primo gesto non cade mai su una bitmap non decodificata.
- Un solo `requestAnimationFrame` per l'intera pagina; ogni modulo legge la stessa
  posizione di scroll in cache, quindi nessuno può forzare un secondo layout.
- I canvas trasportano fotografia, mai testo: il backing store è limitato a 1600–1800px
  di larghezza invece di seguire un DPR 2.
- Le maschere lavorano a metà risoluzione. Sono morbide, non si vede.
- Il livello base dell'hero viene ricomposto solo quando la fase si muove davvero:
  il ciclo tiene fermo su ciascuno stato per gran parte della sua durata.
- Il puntatore si mappa invertendo analiticamente la trasformazione della camera,
  senza leggere il layout dentro il loop.
- Gli `IntersectionObserver` sospendono i ticker fuori schermo.

Costo per frame dimezzato rispetto alla prima stesura, misurato con rendering software
(senza GPU) dove una singola `drawImage` a pieno canvas costa ~6 ms.

---

## Quality floor

- Responsive fino a mobile. Su touch il drag diventa swipe orizzontale e il percorso
  si riproduce da solo se nessuno interviene.
- Focus da tastiera sempre visibile. La timeline è uno slider ARIA vero, pilotabile
  con frecce, Home ed End; il valore annunciato è quello richiesto, non quello ancora
  in animazione.
- `prefers-reduced-motion`: la traccia dell'hero si accorcia e lo stage diventa un
  fotogramma fermo, decade e deriva si spengono, l'autoplay non parte. Il gesto
  dell'utente continua a dipingere, perché non è animazione: è manipolazione diretta.
- Senza JavaScript restano il fotogramma dell'hero, tutti i testi e la navigazione.
- La barra della timeline resta un filo di 2px ma il bersaglio è alto 2.5rem.

---

## Marchio

Non esisteva un sorgente vettoriale. Il wordmark è stato **ricostruito dal raster**
per estrazione dei contorni e semplificazione poligonale: 41 vertici in tutto, con
sovrapposizione del 99,2% sull'originale. Il lettering angolare condensato e i tagli
obliqui sono quelli del file fornito, non un font sostitutivo.

Il raster originale su fondo lime resta come favicon e apple-touch-icon (§9).

**Da decidere:** il raster porta sotto il marchio la dicitura *AI GENERATIVE MEDIA*.
Va contro il §2 (nessun descriptor) e contro il §5 (mai "AI" in navigazione primaria),
quindi in navbar compare **solo il wordmark**. Se il descriptor va tenuto, va detto.

---

## Aperto — serve una decisione

1. **Recapito di contatto.** Il form è completo e validato ma non è collegato a nulla:
   nel master context non c'è un indirizzo. Finché `CONTACT_ENDPOINT` in
   `assets/js/ui.js` resta vuoto, l'invio dichiara onestamente di non essere attivo
   invece di fingere. Basta incollarci l'URL del collector.
2. **Case study.** Il §10 vieta di inventare progetti o clienti. In WORK c'è un solo
   lavoro reale — il nuotatore, materiale di Gianluca Magnoni, diritti confermati — e
   tre posizioni dichiarate come in preparazione, con la sola tassonomia di disciplina.
3. **Crediti.** Solo HEY o HEY più i ruoli individuali: non deciso, quindi in ABOUT
   compaiono i ruoli del core team e nulla sui lavori.
4. **Stato IDEA dello scrub.** Trattato tipograficamente, come previsto dal §6.3
   finché non esiste materiale di storyboard.
