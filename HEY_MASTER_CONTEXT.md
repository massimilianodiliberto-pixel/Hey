# HEY — MASTER CONTEXT
Documento unico di riferimento per lo sviluppo del sito. Contiene identità, regole,
decisioni chiuse e spec tecnica. Se un dettaglio non è qui, va chiesto — non inventato.
Aggiornato: 16/08/2026

---

## 1. COS'È HEY

HEY è una **Creative / Production Company con competenze avanzate nelle tecnologie
generative**. Fondata da Gianluca Magnoni. Massimiliano Di Liberto (Bill Jobs) affianca
nella realizzazione con ruolo esecutivo nel core team.

Non è: una società che fa video con l'AI, un gruppo di prompt engineer, una content farm
AI, una software company, una casa di produzione tradizionale che ha iniziato a usare
l'AI.

Il vantaggio competitivo non è possedere la tecnologia — quella è accessibile a chiunque.
È sapere cosa farne.

**Claim pubblico:** THE TECHNOLOGY DOESN'T LEAD. THE IDEA DOES.

**Bussola interna** (non è un secondo claim pubblico, serve a validare ogni scelta):
Don't show what AI can do. Show what an idea can become.

**Regola operativa assoluta:** se un elemento del sito si spiega meglio dicendo quale
strumento è stato usato che perché l'idea richiedeva quello strumento, l'elemento è
sbagliato.

---

## 2. DECISIONI CHIUSE — non rimetterle in discussione

- Nome: **HEY**, senza descriptor sotto il logo. (Variante "HUMAN. EVOLUTION. YDEA."
  esiste in alcuni mockup ma NON è approvata — non usarla.)
- Struttura: core team ristretto + specialist network.
- Governance: decide Gianluca.
- Posizionamento: production company, non agenzia AI.

---

## 3. SISTEMA VISIVO

**Colori**
- LIME accent — `#E5FD5D` (ufficiale, scelto da Gianluca. Ignorare `#C6FF00` visto in
  mockup: è un'approssimazione errata.)
- RHYME fondo — `#1A1C17`
- GRAY processo — `#A8A8A0`
- LIGHT testo — `#E6E6DF`

**Regola cromatica narrativa:** nero = mondo reale, contenitore. Grigio = processo.
Lime = intervento, possibilità, trasformazione. Il lime è materia che rivela, mai
fondale. Non fare un sito "tutto nero e lime": diventa tech startup.

**Tipografia:** mono / condensed, uppercase, spazi ampi, leggibilità tecnica. Deve
sembrare cinema + design editoriale, non software.

**Da evitare visivamente:** neon, glitch gratuito, gradienti viola, reti neurali, robot,
prompt a schermo, terminali, estetica "futuristica". Serve materia reale: pelle, set,
luce, acqua, piastrelle, metallo.

---

## 4. GLI ASSET — IL NUOTATORE

Videoclip di Gianluca, girato circa 25 anni fa. Diritti di utilizzo confermati.
È l'asset più forte del progetto: un effetto speciale che oggi tutti leggerebbero come
AI, realizzato in live action + VFX quando l'AI non esisteva. Dimostra il posizionamento
senza enunciarlo.

Tre frame forniti:

1. **BACKSTAGE** — il nuotatore appoggiato a un carrello su binari, in piscina vuota.
   Si vede il trucco: il tubo dell'ossigeno, il rig, la meccanica della produzione.
2. **RIPRESA / COMPOSITING** — stessa inquadratura, carrello rimosso. Il nuotatore
   sospeso nel vuoto della piscina. L'illusione compiuta.
3. **TRASFORMAZIONE AI** — stessa scena, ora sott'acqua: rovine sommerse, colonne,
   luce che filtra dalla superficie, bolle, corallo. Il mondo che l'idea originale
   immaginava e che oggi si può realizzare.

**Narrativa dei tre frame, in una riga:** l'idea c'era già — la tecnologia la rende
possibile ora.

---

## 5. IL SITO — ARCHITETTURA V1

Sezioni richieste già in versione 1 (non un placeholder, tutte presenti):

1. **HERO** — il nuotatore, ingresso nel mondo
2. **WORK** — Enter the film. Ogni progetto è un viaggio.
3. **SYSTEM** — Il nostro metodo. Idea → Produzione → Tecnologia → Film.
4. **TRANSFORMATION LAB** — Esplora le possibilità. Interventi su luce, ambiente,
   materia, movimento, realtà.
5. **ABOUT** — Chi siamo. Esperienza, creatività, visione, strumenti, risultati.
6. **CONTACT** — Parliamo del tuo progetto. Ogni idea merita il giusto linguaggio.

**Navigazione:** WORK / SYSTEM / METHOD / ABOUT / CONTACT.
**Mai la parola "AI" in navigazione primaria.** Le specifiche tecniche (Live Action,
VFX, CGI, Generative AI, Hybrid Production) compaiono solo dentro i case study.

---

## 6. INTERAZIONE — IL CUORE DEL SITO

### 6.1 Ingresso scroll-driven
Lo scroll deve far **entrare dentro il mondo** attraverso i frame, come scorrere avanti
e indietro una clip video: zoom lento in avanti e/o tilt verso il basso, ancorato alla
posizione di scroll. Non un semplice fade tra sezioni — deve dare la sensazione di
attraversare l'immagine.

### 6.2 Hero — il nuotatore che si trasforma
Nell'hero il nuotatore attraversa le sue fasi. Al passaggio del mouse (o del dito su
mobile) la scena si trasforma nel mondo generativo: la piscina vuota diventa il mondo
sommerso.

**Vincolo critico:** NON usare uno split-slider before/after classico. È il device
standard di ogni demo AI, esattamente ciò che il posizionamento vuole evitare. La
trasformazione deve essere **cinematografica e continua** — una zona che rivela, una
dissolvenza per materia, non un confronto A/B con una linea netta al centro. Se in
prototipo si legge come "prima/dopo", va cambiato approccio.

Il lime può essere la traccia che rivela: dove passa il cursore resta una scia lime, e
dentro quella scia appare il livello generativo — come se la trasformazione fosse
nascosta sotto la superficie del film.

### 6.3 Scrub di processo
Timeline trascinabile che attraversa gli stati dello stesso shot:

IDEA → PRODUZIONE → EFFETTI SPECIALI → COMPOSITING → TRASFORMAZIONE AI → NUOVA IMMAGINE

Mostra il mestiere, non il risultato. Un before/after lo fa chiunque; avere backstage,
plate e final dello stesso shot è una barriera d'ingresso reale.

Con tre frame disponibili: BACKSTAGE copre PRODUZIONE/EFFETTI SPECIALI, RIPRESA copre
COMPOSITING, TRASFORMAZIONE AI copre gli ultimi due stati. IDEA può essere trattato
tipograficamente (testo/concept) finché non esiste materiale di storyboard.

### 6.4 Mobile
Stesso viaggio, gesto naturale. Swipe orizzontale al posto del drag. Se l'utente non
interagisce, il percorso si riproduce automaticamente. Il mobile non è una versione
ridotta: è lo stesso concept con un altro gesto.

---

## 7. TECNOLOGIA WEB — cosa è ammesso e con quale criterio

Disponibili: video sincronizzati allo scroll, sequenze frame-by-frame, WebGL, canvas,
maschere, parallax, depth, particelle, morphing, transizioni video↔immagine, layer
interattivi, audio reattivo, micro-interazioni, reazione al cursore, touch interaction.

**Criterio unico:** la tecnologia deve servire la narrazione. Se un effetto non racconta
qualcosa, si toglie. Stessa identica regola dell'AI applicata al codice.

Quality floor obbligatorio: responsive fino a mobile, focus da tastiera visibile,
`prefers-reduced-motion` rispettato, performance reale (le sequenze frame-by-frame vanno
precaricate e decodificate con criterio, non buttate in pagina).

---

## 8. LESSICO

**Usare:** idea, creative direction, produzione, storytelling, craft, esperienza,
tecnologia, generativo, live action, CGI, VFX, ibrido, human, machine, possibilità,
giudizio, risultato.

**Vietato:** AI agency, AI-powered, AI content, rivoluzionario, disruptive, next
generation, future of video, limitless possibilities, create anything, basta un prompt,
10x faster, no camera needed, "sostituiamo la produzione tradizionale".

**Copy hero confermato:**
"L'IDEA C'ERA GIÀ. LA TECNOLOGIA LA RENDE POSSIBILE ORA."
"Circa 25 anni fa, abbiamo immaginato l'impossibile. Oggi possiamo trasformarlo."

**Chiusura possibile:** THE IDEA DOESN'T CHANGE. (pausa) THE POSSIBILITIES DO. HEY.

---

## 9. LOGO

Il file fornito è il marchio HEY su fondo lime pieno (versione icona). Corretta per
favicon e apple-touch-icon.

Serve una **versione reversed** per la navbar su fondo scuro: solo il tratto del
wordmark, in `#E5FD5D` o `#E6E6DF`, sfondo trasparente, preferibilmente SVG. Non esiste
un sorgente vettoriale: va ricostruita dal file raster.

Il lettering è angolare, condensato, con tagli obliqui — non sostituirlo con un font
generico.

---

## 10. COSA NON È ANCORA DEFINITO

- Crediti sui lavori: solo HEY vs HEY + ruoli individuali
- Contenuti reali di WORK (case study) — la v1 può usare struttura e placeholder
  dichiarati, non inventare progetti o clienti inesistenti
- Materiale di storyboard per lo stato IDEA dello scrub
