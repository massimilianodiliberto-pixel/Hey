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

Tutto il viaggio: apertura, le sei stazioni dal file dati e l'arrivo. Il Passo 1 (apertura, Occhi,
Orecchie) è la parte rifinita. Le altre quattro stazioni usano lo stesso motore con forme segnaposto.
L'arrivo è semplificato: ritratto PLACEHOLDER, i sensi che convergono, le linee da Gambe, «Istinto».

Clip simulate (campi di colore con timer), skip e "watch full work", passaggio clip → freeze in
parallax, senso che va al margine e resta acceso, riga "oggi", avanzamento automatico, invito a
proseguire, aggancio, indice, richiami, versione mobile, versione `prefers-reduced-motion`.

## Pubblicazione

Anteprima su Vercel, non indicizzata (`robots: noindex`). Progetto separato da HEY, root del
branch `punto-g`, framework Next.js, nessuna variabile d'ambiente.
