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

**Home: MATERIA VIVA** («Everything is in motion»), concept e brief di Massimiliano. Una materia
granulare 3D (Three.js, shader GLSL, `lib/materia.ts`) attraversa sette fasi con lo scroll:
Nascita, Ricordo, Salto, Espansione, Composizione, Sintesi (Istinto), Continua. Lo sfondo evolve dal
nero alla luce insieme alla materia. Nelle fasi Ricordo, Salto, Espansione e Composizione i progetti
emergono dalla materia e si aprono in una scheda (video, anno, ruolo, descrizione, crediti).

- `content/materia.ts`: testi delle fasi. `content/projects.ts`: i progetti, aggiornabili senza
  toccare il sistema particellare.
- `components/MateriaViva.tsx`, `app/materia/materia.css`: esperienza e stile (Playfair Display, Inter).
- `/colonna`: la versione precedente (colonna come scultura), conservata per confronto.

## Pubblicazione

Anteprima su Vercel, non indicizzata (`robots: noindex`). Progetto separato da HEY, root del
branch `punto-g`, framework Next.js, nessuna variabile d'ambiente.
