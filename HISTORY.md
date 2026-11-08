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
