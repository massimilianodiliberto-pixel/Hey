# TIMELINE — Punto G

Versione 0, scritta dalle sezioni 2 e 5 del `BRIEF.md`. **Il materiale di riferimento non è
ancora arrivato**: quando arrivano i fotogrammi in `reference/`, valori e durate vanno corretti
su di essi.

---

## Convenzioni

- **`p`** = progresso dentro il pin di una stazione, da 0 a 1. Il pin è il tratto di scroll in
  cui il viewport resta fermo sulla stazione.
- **Lunghezza del pin:** desktop **300vh**, mobile **180vh**. Ogni 0,1 di `p` vale 30vh su
  desktop e 18vh su mobile.
- **Proprietà animate:** solo `transform`, `opacity`, `clip-path`. Niente che ricalcoli il
  layout.
- **Scrub:** ogni valore è una funzione di `p`. Avanti e indietro danno lo stesso risultato.
  Smorzamento con ScrollTrigger `scrub: 0.6` più Lenis su desktop, `scrub: 0.3` con scroll
  nativo su touch.
- **Unica eccezione al tempo-scroll: la clip.** La clip scorre nel tempo, non nello scroll (§2,
  primo tempo). Tutto quello che succede durante la clip è misurato in **secondi**, tutto il
  resto in **`p`**.

### I piani della scena

| Piano | Cosa contiene | Si muove con |
|---|---|---|
| `bg` | fondo della scena, il piano più lontano | scroll, ampiezza minima |
| `mid` | soggetto principale del fotogramma | scroll, ampiezza media |
| `fg` | elemento in primo piano, spesso fuori scala (§6) | scroll, ampiezza massima |
| `clip` | il `<video>`, sopra i tre piani, stesso quadro | tempo |
| `text` | riga "ricevuto", senso, riga "oggi" | scroll (la riga "ricevuto" segue la clip) |
| `chrome` | indice, tracce dei sensi, skip, link, audio | fisso, sempre sopra |

Il **quadro** (la finestra in cui vivono clip e freeze) non è a tutto schermo: lascia fondo
neutro attorno, come chiede il §6. Clip e freeze hanno lo stesso quadro al pixel (§5).

Nel prototipo il freeze è simulato: il fotogramma chiave viene separato in `bg`/`mid`/`fg` e
spostato in parallax. Con le sequenze vere, i tre piani sono sostituiti da un canvas che mostra
il frame `round(p / 0.86 × (N − 1))`.

---

## A. Stazione tipo — fase clip (tempo, `p` = 0)

All'arrivo il pin è fermo a `p = 0` (punto di aggancio). Lo scroll non avanza finché l'utente non
scrolla.

| t | Elemento | Cosa succede | Proprietà |
|---|---|---|---|
| 0,0 s | `clip` | Dal poster parte la clip: autoplay, `muted`, `playsInline` | — |
| 0,0 → 0,6 s | riga "ricevuto" | Entra | opacity 0→1, translateY 12px→0 |
| 0,0 → 0,6 s | titolo clip, skip, "watch full work" | Entrano, piccoli, a bordo quadro | opacity 0→1 |
| 0,0 s | sequenza freeze | Parte il precaricamento (§5) | — |
| 13–15 s | `clip` | Si ferma sull'ultimo fotogramma. È identico al frame 0 del freeze, che è già disegnato sotto: lo scambio non si vede | `clip` opacity 1→0 in 1 frame |
| fine clip → +0,3 s | titolo clip, skip | Escono. Il link "watch full work" resta fino a `p = 0.08` | opacity 1→0 |

**Montage:** gli ultimi 1,5 s della clip mostrano la `caption` ("Centinaia.") al centro del
quadro, poi si chiude come sopra.

**Più clip nella stessa stazione:** alla fine di ogni clip che non è l'ultima si passa alla
successiva con una dissolvenza di 0,4 s. Lo skip anticipa lo stesso passaggio. Solo l'ultima clip
porta al freeze.

**Scroll durante la clip:** al primo delta di scroll significativo (soglia 8px) la clip sfuma in
**0,35 s** sul fotogramma chiave dell'**ultima** clip della stazione, e da lì comanda `p`. La
dissolvenza è a tempo, ma i piani sotto seguono `p` da subito, quindi non c'è un salto.

---

## B. Stazione tipo — sosta in scroll (`p` 0 → 0.86)

Desktop. La colonna "vh" vale per il pin di 300vh.

| p | vh | Elemento | Cosa succede | Proprietà | Easing |
|---|---|---|---|---|---|
| 0.00 → 0.86 | 0 → 258 | `bg` | La camera avanza nel fermo | scale 1→1.08, x 0→−2% | linear |
| 0.00 → 0.86 | 0 → 258 | `mid` | Parallax medio | scale 1→1.18, x 0→−4%, y 0→−1% | linear |
| 0.00 → 0.86 | 0 → 258 | `fg` | Parallax forte, può uscire dal quadro | scale 1→1.35, x 0→−8%, y 0→+3% | linear |
| 0.00 → 0.08 | 0 → 24 | riga "ricevuto" | Esce: il passato si chiude | opacity 1→0, y 0→−12px | power1.in |
| 0.00 → 0.08 | 0 → 24 | link "watch full work" | Esce | opacity 1→0 | power1.in |
| **0.14 → 0.28** | 42 → 84 | **senso** | **Entra con una maschera da sinistra a destra, al centro del quadro** | clip-path inset(0 100% 0 0)→inset(0 0 0 0), opacity 0→1 | power2.out |
| 0.28 → 0.48 | 84 → 144 | senso | Resta. È il cuore della stazione | — | — |
| 0.48 → 0.60 | 144 → 180 | senso | Rimpicciolisce e si sposta nel suo posto al margine | translate verso lo slot, scale 1→0.32 | power2.inOut |
| 0.60 | 180 | traccia del senso | Al margine il senso diventa traccia accesa e resta per tutto il viaggio | opacity 0→0.45 (scambio su un frame) | — |
| **0.58 → 0.70** | 174 → 210 | **riga "oggi"** | **Entra** | opacity 0→1, y 12px→0 | power2.out |
| 0.70 → 0.86 | 210 → 258 | riga "oggi" | Resta | — | — |
| 0.80 → 0.86 | 240 → 258 | riga "oggi" | Esce | opacity 1→0 | power1.in |

**Durata del freeze:** la sequenza copre tutta la sosta (`p` 0→0.86). Senso e "oggi" compaiono
**dentro** il tempo fermo, non dopo.

### Freeze che avanza da solo (utente fermo)

| Condizione | Cosa succede |
|---|---|
| Clip finita e nessun input per **2 s** | La sosta avanza da sola dal `p` corrente fino a `0.86`, in **14 s** circa (sine.inOut). Compaiono senso e "oggi" come nella tabella sopra |
| Arrivo a `p = 0.86` | Si ferma. Dopo **1,5 s** compare un invito discreto a proseguire (opacity 0→0.6) |
| Qualsiasi input (rotella, touch, tastiera) | L'avanzamento automatico si interrompe subito e lo scroll riprende **dallo stesso punto** |
| Primo scroll dopo l'invito | L'invito esce (opacity →0) |

Come lo faccio: l'avanzamento automatico **sposta la posizione di scroll reale**, in modo lento
e interrompibile. Così stato e scroll restano una cosa sola e la ripresa senza salti è garantita
per costruzione. L'alternativa è un progresso virtuale separato da riallineare allo scroll. Va
confermato (domanda 1).

### Scroll all'indietro

Dentro la sosta tutto si ripercorre al contrario. Tornati a `p = 0`, la scena resta sul
fotogramma chiave: **la clip non riparte**. Titolo clip e link ricompaiono, statici.

---

## C. Transizione tra due stazioni (A `p` 0.86 → 1.00, poi B `p` = 0)

La transizione vive alla fine del pin di A: 42vh su desktop. Sotto A, B è già montata e mostra il
**poster della sua prima clip**, così all'arrivo la clip parte da un'immagine già vista e non c'è
stacco.

Idea: la scena B **emerge da un elemento di A**. Il piano `fg` di A diventa la finestra
attraverso cui si vede B, la finestra si allarga fino a diventare il quadro di B, e intanto la
camera spinge oltre A (§3: trasformazione, non sostituzione).

| p di A | vh | Elemento | Cosa succede | Proprietà | Easing |
|---|---|---|---|---|---|
| 0.86 | 258 | `fg` di A | Smette di seguire il parallax e si blocca: sarà la finestra | — | — |
| 0.86 → 0.90 | 258 → 270 | B (tutti i piani) | Compare dentro la sagoma di `fg` di A | clip-path circle(0% at fg)→circle(6% at fg) | power2.in |
| 0.88 → 1.00 | 264 → 300 | `bg` + `mid` di A | La camera spinge oltre A | scale 1.08→1.5 / 1.18→1.7 | power2.in |
| 0.90 → 1.00 | 270 → 300 | maschera di B | La finestra si apre fino a coprire il quadro di B. Il centro scivola dalla posizione di `fg` di A al centro di B | circle(6%)→circle(75%), centro interpolato | power3.inOut |
| 0.90 → 1.00 | 270 → 300 | piani di B | Contro-zoom: entriamo in B invece di vederla arrivare | scale 1.25→1, ognuno con il suo fattore | power2.out |
| 0.94 → 1.00 | 282 → 300 | `fg` di A | Si dissolve dentro il bordo della finestra | opacity 1→0 | power1.in |
| 0.94 → 1.00 | 282 → 300 | `bg` + `mid` di A | Escono | opacity 1→0 | power1.in |
| 0.93 | 279 | indice | La stazione corrente diventa B | scambio di stato | — |
| 1.00 | 300 | B | Atterraggio: B a `p = 0`, la clip parte (tabella A) | — | — |

Le **tracce dei sensi** non partecipano alla transizione: restano ferme al margine.

**Caricamento:** la clip e il poster di B si caricano quando A arriva a `p = 0.5`. La sequenza
freeze di B si carica mentre gira la clip di B. Le stazioni a più di un passo dalla corrente si
scaricano (§8).

**Aggancio (flag `SNAP`, attivo di default):** agisce solo nella zona di transizione. Se lo
scroll si ferma tra `0.86` e `1.00` di A, si aggancia a B `p = 0` se si è oltre la metà
(`0.93`), altrimenti torna ad A `p = 0.86`. Durata 0,6 s, power2.out. Dentro la sosta non c'è
aggancio.

---

## D. Mobile

Stessi rapporti, pin più corto, meno piani.

| Voce | Desktop | Mobile |
|---|---|---|
| Pin | 300vh | 180vh |
| Piani | `bg` + `mid` + `fg` | `bg` + `fg` |
| Parallax (ampiezze) | come tabella B | dimezzate |
| Freeze | sequenza piena | sequenza corta a risoluzione ridotta, oppure fotogramma fisso con parallax leggero |
| Senso → traccia | si sposta al margine laterale | si sposta al bordo superiore, in riga |
| Transizione | finestra + spinta su A + contro-zoom su B | finestra + spinta su A, niente contro-zoom |
| Scroll | Lenis | nativo |

## E. `prefers-reduced-motion`

Niente pin e niente scrub. Ogni stazione è una pagina alta 100vh, con dissolvenza di 0,4 s al
cambio. La clip parte solo a mano. Senso, "ricevuto" e "oggi" sono visibili tutti insieme. Le
tracce dei sensi si accendono comunque.

## F. Fuori dalla timeline: salti con indice e richiami

Un salto **non scrubba** attraverso le stazioni intermedie. Il quadro corrente si chiude
(opacity a 0, scale 1→0.96, 0,5 s), lo scroll viene riposizionato a `p = 0` della destinazione,
il nuovo quadro si apre (0,5 s) e la clip parte. I sensi delle stazioni saltate restano spenti.

---

## Domande aperte

1. **Avanzamento automatico:** sposta lo scroll reale (la mia proposta) o è un progresso virtuale
   separato?
2. **Tornando a `p = 0`:** la clip non riparte. Serve un piccolo comando "rivedi" a mano, o resta
   solo il fotogramma fermo?
3. **Scroll durante una clip che non è l'ultima:** ho supposto che porti dritto al freeze
   dell'ultima clip, saltando le altre. È corretto?
4. **Quadro:** clip e freeze in una finestra con fondo neutro attorno (la mia proposta, per il
   §6) o a tutto schermo?
