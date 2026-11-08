# Punto G — anteprima

Anteprima temporanea con contenuti segnaposto. Brief: `BRIEF.md`. Regia dello scroll: `TIMELINE.md`.

## Avvio

```
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Dove stanno le cose

- `content/stations.ts`: tutti i testi (stazioni, apertura, arrivo, stringhe dell'interfaccia).
- `config.ts`: flag (stazioni costruite, aggancio, audio, durata clip, avanzamento automatico).
- `lib/phases.ts`: i valori di `p` della stazione tipo, specchio di `TIMELINE.md`.
- `lib/engine.ts`: motore di scroll (GSAP + ScrollTrigger, Lenis su desktop).
- `lib/spine.ts`: la colonna in Three.js, caricata a parte.
- `components/looks.ts`: forme segnaposto delle scene, da sostituire con i fotogrammi veri.

## Cosa contiene

Apertura, sei sensi e arrivo lungo una colonna astratta in 3D (Three.js, `lib/spine.ts`): la colonna
è il tempo, ogni esperienza di Giangi sta alla vertebra della sua epoca, i salti nel tempo sono la
camera che scatta lungo la colonna. I ricordi (clip e fotogrammi segnaposto) escono dalle vertebre.
Finale con titoli di coda e «Continua». Solo le sue cinque frasi.

Clip simulate con timer, skip, "watch full work", Rivedi, freeze in parallax, senso al margine,
avanzamento automatico, aggancio, indice con i mondi, richiami, mobile, `prefers-reduced-motion`.

## Pubblicazione

Anteprima su Vercel, non indicizzata (`robots: noindex`). Progetto separato da HEY, root del
branch `punto-g`, framework Next.js, nessuna variabile d'ambiente.
