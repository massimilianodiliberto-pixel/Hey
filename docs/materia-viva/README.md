# MATERIA VIVA — Fasi A, B, C

Concept e brief di Massimiliano: «Everything is in motion». Pagina di prova: `/materia`.
Il sito attuale (`/`) non è toccato finché la direzione non è approvata.

- Fase A, sistema particellare: Three.js `Points` con shader GLSL, 130.000 particelle su desktop e
  45.000 su telefono. Ogni particella conosce le sette forme (nascita, massa, dispersione, onda,
  strati, nastro, rarefazione) e le attraversa con un ritardo proprio, più turbolenza nei passaggi.
- Fase B, scroll: GSAP ScrollTrigger con scrub (inerzia), Lenis su desktop, avanti e indietro senza
  scatti. Indice dell'evoluzione narrativa cliccabile.
- Fase C, ambienti: lo sfondo è uno shader che passa da nero ad ambra, rosso, petrolio, argento,
  tramonto con orizzonte e sole, luce quasi bianca, in modo continuo. Profondità di campo sulle
  particelle (desktop), grana leggera, vignettatura.

Tipografia: Playfair Display e Inter, come da moodboard, serviti dal sito.
Senza WebGL: sfondo sfumato con lo stesso viaggio di colori. Movimento ridotto: forme compiute,
senza trasformazioni.
