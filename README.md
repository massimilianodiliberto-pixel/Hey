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
- `components/looks.ts`: forme segnaposto delle scene, da sostituire con i fotogrammi veri.

## Cosa contiene

Apertura, sei sensi e arrivo. Ogni senso nasce da un'esperienza di Giangi (Match Music, pubblicità,
grandi eventi…), il cui nome è il titolo grande durante la clip. Il viaggio salta avanti e indietro
nel tempo: transizione «dopo» (la camera spinge in avanti) e «prima» (la camera arretra e torna
un ricordo), con la parola corrispondente. Nel sito ci sono solo le sue cinque frasi.

Clip simulate (campi di colore con timer), skip e "watch full work", freeze in parallax, senso che
va al margine e resta acceso, avanzamento automatico, invito a proseguire, aggancio, indice con i
mondi, richiami, arrivo con «Istinto», versione mobile, versione `prefers-reduced-motion`.

## Pubblicazione

Anteprima su Vercel, non indicizzata (`robots: noindex`). Progetto separato da HEY, root del
branch `punto-g`, framework Next.js, nessuna variabile d'ambiente.
