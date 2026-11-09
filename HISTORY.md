# HISTORY — Punto G

## 2026-10-07 — Avvio
Branch orfano `punto-g`, scheletro Next.js, `BRIEF.md`, `content/stations.ts` ricostruito dai dati
del cliente, `TIMELINE.md` v0 scritta dalle sezioni 2 e 5 del brief (il materiale di riferimento non
è arrivato).

## 2026-11-07 — Passo 1
Decisioni di Massimiliano: autoplay che muove lo scroll reale, comando «Rivedi», quadro in finestra
su fondo neutro, anteprima su link. Motore di scroll (GSAP + ScrollTrigger, Lenis su desktop),
apertura + Occhi + Orecchie con clip simulate, freeze in parallax, senso al margine, riga «oggi»,
transizione a finestra, aggancio, indice, richiamo, mobile, movimento ridotto. Next.js aggiornato a
16.4.5 per una vulnerabilità nota. Anteprima Vercel separata da HEY, `noindex` in meta e header.

## 2026-11-07 — Viaggio completo
Su richiesta di Massimiliano: Fegato, Mani, Gambe e Cuore con lo stesso motore e forme segnaposto,
e la scena di arrivo (ritratto PLACEHOLDER, sensi che convergono, linee da Gambe, «Istinto», frase,
chiusura, nome e contatti PLACEHOLDER). Tolta la riga «Fine del prototipo». Arrivo raggiungibile
anche dall'indice. Collaudo Playwright su desktop, iPhone 13 e movimento ridotto: console pulita,
tsc e build verdi, scroll avanti e indietro.

Aperto: Cuore supera il budget di 25 parole (29); manca il materiale di riferimento; clip, scene e
ritratto sono segnaposto.

## 2026-11-07 — Sensi e salti nel tempo
Decisione di Massimiliano: niente parti del corpo; restano i sensi; il viaggio va avanti e indietro
nel tempo tra le esperienze; nel sito solo le sue frasi. Applicato:
- stazioni = sensi, ognuno legato a un'esperienza (`worlds`), in ordine alternato lontano/recente;
  campo `era` (PLACEHOLDER, mai mostrato) per il verso del salto;
- transizione «prima» nuova (la camera arretra, il ricordo entra dai bordi) accanto a «dopo», con
  la parola «prima» / «dopo» / «oggi»;
- il mondo è il titolo grande durante la clip, il senso compare nel freeze; tolte tutte le righe
  scritte da noi: restano le 5 frasi di Giangi;
- indice con i sensi e i mondi; le linee dell'arrivo partono dall'orientamento;
- corretto: entrando in una stazione oltre l'inizio, mondo e frase compaiono comunque;
- BRIEF §1, §3 e §4 e TIMELINE (§H) aggiornati.
La trascrizione della telefonata non arriverà: si lavora con i dati che ci sono.

## 2026-11-07 — Salti di scroll
Segnalazione della regia: dopo un salto istantaneo la scena sembrava restare indietro. Verificato:
si riallineava in circa mezzo secondo (smorzamento dello scrub). Corretto comunque: sui salti
grandi (barra trascinata, ancora, scrollTo) la scena va subito al punto giusto. Trovato e corretto
un difetto più vecchio: i salti dall'indice accendevano i sensi delle stazioni saltate. Ora un senso
si accende solo se la sua stazione è sullo schermo quando il senso si apre.

## 2026-11-08 — La colonna
Osservazioni di Massimiliano: solo zoom, manca il concetto, finale «to be continued», pezzi di lavoro,
3D, design non premium. Fatti nuovi su Giangi (Crash Test, K+ Imaginary Studio, Match Music creato
da lui, copertine, interior design, Wella al Cosmoprof; Asenawer tolto). Proposte 2 (set), 3
(spirale di DNA) e 4 (colonna vertebrale) in `docs/`. Scelte di Massimiliano: colonna più astratta,
salto con torsione, scatto e inversione, Three.js. Costruito:
- `lib/spine.ts`: colonna di vertebre astratte instanziate, spirale che respira, scia di luce;
  disegnata solo quando cambia, caricata a parte, fallback senza WebGL;
- la colonna è il tempo: la camera scatta lungo la colonna tra le epoche, si svita tornando indietro;
- i ricordi escono e rientrano nelle vertebre al posto delle transizioni a finestra;
- teatro di posa al buio, luce al tungsteno, Anybody + Familjen Grotesk self-hosted;
- arrivo con la colonna intera, titoli di coda e «Continua»;
- skill di design installate (impeccable, emilkowalski, design-motion-principles).

## 2026-11-08 — MATERIA VIVA
Massimiliano porta un nuovo concept con moodboard e brief: MATERIA VIVA, «Everything is in motion».
Una materia granulare 3D che si aggrega, si disperde e si trasforma con lo scroll, mentre lo sfondo
evolve dal nero alla luce. Prima, proposta 5 (rete neuronale) in `docs/proposta-5/`, superata.
Fasi A-C costruite su `/materia` (il sito su `/` non è toccato):
- `lib/materia.ts`: 190.000 particelle su GPU (60.000 su telefono), sette forme, transizioni per
  particella con turbolenza; densità variabile come una superficie granulare; un granulo su 170 è
  un sasso sferico illuminato; profondità di campo su desktop;
- sfondo shader: nero, ambra, rosso, petrolio, argento, tramonto con orizzonte e sole, luce;
  luce volumetrica dietro la materia, grana e vignettatura; nel finale i grani diventano polvere
  controluce;
- camera per fase con inerzia dallo scrub; indice dell'evoluzione narrativa numerato come nel
  moodboard; Playfair Display e Inter self-hosted.
Decisioni: più materia (fatto); l'anno solo dentro la scheda del progetto, mai nel percorso;
numerazione delle fasi come nel moodboard.

## 2026-11-08 — MATERIA VIVA, fase D e home
- `content/projects.ts`: 11 progetti nelle fasi Ricordo (il primo spot, copertine, Match Music),
  Salto (Crash Test, K+ Imaginary Studio), Espansione (video musicali, interior design, Wella al
  Cosmoprof), Composizione (spot, VFX, regia). Fatti confermati, il resto PLACEHOLDER; anno solo
  nella scheda.
- I lavori emergono dalla materia (dalla sfocatura alla nitidezza, tre profondità in parallax) e si
  aprono in una scheda laterale accessibile (focus, Esc, clic fuori), mai a tutto schermo.
- MATERIA VIVA diventa la home; la versione con la colonna passa a `/colonna`.
- Pubblicata su richiesta di Massimiliano («Chiudilo e pubblicalo»).

## 2026-11-08 — MATERIA VIVA, indicazioni di Massimiliano
- Apertura: «Non sono mai stato un regista classico.» grande al centro; quando la camera avanza,
  la frase arretra, ruota e sfuma al contrario delle particelle.
- Lavori nel 3D vero: arrivano dal fondo ruotando, si compongono dai granuli (maschera di polvere),
  poi ruotano lenti con la prospettiva.
- Suolo di particelle sotto la materia, per sentire lo spostamento della camera.
- Grandi nomi delle esperienze fatti da un secondo sistema di particelle: uno alla volta, si
  compongono e si disfano, ruotano insieme ai lavori.
- Camera: zoom in, discesa verso il suolo, leggero pan, zoom out (scelta di Massimiliano).
- Chiusura: «To be continued.» → «La prossima la scriviamo insieme.»; G · Gianluca Magnoni · Giangi;
  tre azioni: «Mandami un saluto» (mail), «Hai bisogno di me?» (modulo che parte via email),
  «Approfondisci Giangi» (showreel). Email e showreel PLACEHOLDER: in demo il modulo lo dice.
- Crediti dei progetti: Gianluca Magnoni.

## MATERIA VIVA — evoluzione dai 7 riferimenti (incrementale)
- Ricordo: impronta concentrica di granuli (prima identità) al posto della massa sferica.
- Salto: l'impronta esplode a ventaglio asimmetrico dal suolo, con detriti a terra.
- Espansione: tre fasce fluide irregolari, granuli concentrati sulle creste.
- Composizione: lamine ondulate sovrapposte.
- Continua: il nastro della sintesi si dissolve in oro sull'avorio; testo finale centrato.
- Micro-sfere di vetro (bordo luminoso, riflesso) al posto dei sassi opachi; più piccole e rade.
- Suolo: dune granulari con creste che prendono la luce.
- Invariati: camera, scroll, contenuti, tipografia, schede, form.

## Ritorno alla materia di 1af5be0 + fondali e camera amplificata
- Feedback di Massimiliano (via regia): dai riferimenti ChatGPT si era preso troppo. Via impronta, ventaglio, fasce, lamine, micro-sfere di vetro e finale oro centrato: particelle e chiusura tornano a 1af5be0.
- Dai riferimenti restano solo i fondali: il fondale segue la camera (l'orizzonte sale e scende col tilt, i rilievi scorrono col pan), una seconda catena di colline più lontana, un banco di foschia sull'orizzonte, dune sul suolo, pulviscolo d'ambiente sfocato in un grande volume da attraversare.
- Camera amplificata, stessa sequenza: nascita più lontana (z 36), zoom in più profondo (z 7.5), tilt down vero nel salto, pan marcato (x -8), zoom out più ampio (z 27), sintesi dall'alto, arretramento finale lungo l'asse.

## Indice delle proposte
- La home diventa un indice da mandare con un solo link: HEY (GitHub Pages, non toccato) e Materia Viva.
- /a = 1af5be0 (lib/materia-a.ts), /b = 18fadb4 (lib/materia-b.ts, finale centrato con .mv-vb), /c = versione attuale (lib/materia.ts). Contenuti e componente condivisi.
- Testi dell'indice in content/versioni.ts, miniature in public/versioni/.
- Decisione di Massimiliano: resta solo la versione C, ora su /materia-viva (/a, /b, /c rimandano lì). A e B restano nella storia git (1af5be0, 18fadb4).
- Didascalie dei lavori sopra le piattaforme, con ombra di leggibilità; nel finale un velo d'avorio dietro l'indice dei capitoli.

## Volto di Giangi (commit separato, si toglie facilmente)
- scripts/volto.py ricava dalla foto in riferimenti/ (mai pubblicata) public/volto/volto.bin, ~140 KB: 14 000 punti mescolati (6000 su telefono) e le linee di livello della luce, come curve di un rilievo.
- In lib/materia.ts: punti e linee dietro la materia, a z -26, emergono dopo la nascita e svaniscono prima della luce finale, respirano lentamente e ruotano piano al contrario della materia.
- Per toglierlo: revert di questo commit.
- Volto in 3D vero (feedback: "piatto"): maglia MediaPipe portata in posa frontale, lato in ombra ricostruito specchiando quello illuminato (cucitura sulla linea del naso), guscio rado della testa con i capelli chiari, linee come sezioni orizzontali della maglia e contorni dei tratti. 16 400 punti, 134 KB.
- Movimento: sguardi con pause (yaw fino a ±40°, pitch ±12°), deriva al contrario della materia, ogni 30 s si dissolve in particelle e si ricompone. Parallasse vera: sta nello spazio 3D a z -26.
- Volto, terza versione (feedback: "non sembra più Giangi"): ritorno allo stile della prima (punti e linee di livello dalla luminanza della foto, stessa posa) con la profondità vera presa dalla maglia MediaPipe, usata solo come stampo invisibile; fuori dalla maglia un ellissoide raccordato senza gradino. Lato in ombra: punti del volto illuminato specchiati sul piano di simmetria e tenuti solo dove la foto è buia. Via guscio e sezioni orizzontali. 20 500 punti, 189 KB (8000 su telefono).
- Movimento appena accennato: yaw fino a ±18°, pitch fino a ±7°, lento con pause; dissolvenza ogni 30 s; prova in docs/volto/.

## Tre versioni di Materia Viva per l'email a Giangi
- Un solo codice, il volto è un parametro (`face`: "flat" | "none" | "3d" in createMateria e in <MateriaViva/>).
- /materia-viva/1 «Il volto» (volto piatto di 1ba9d3e, public/volto/volto-piatto.bin, scripts/volto-piatto.py), /materia-viva/2 «Materia e fondali» (senza volto), /materia-viva/3 «Il volto in 3D» (public/volto/volto-3d.bin, scripts/volto.py).
- /materia-viva, /a, /b, /c rimandano alla 3. L'indice mostra HEY e le tre versioni.
