// HEY — note di regia in overlay, SOLO per la review con Gianluca.
// Vedi HEY_Note_Regia_Overlay_Review_v01.md. Script separato, non tocca
// scroll-world.js (vendorizzato) né home.js: legge il manifest per conto suo
// e si aggancia dall'esterno alla classe "is-active" che l'engine già mette
// sui suoi route dot per sapere quale sezione è in scrub in un dato momento.
//
// INTERRUTTORE UNICO: world-manifest.json → "reviewNotes": false (o rimuovi
// il campo) spegne tutto qui, senza toccare altri file.
(function () {
  "use strict";

  var box = document.getElementById("director-note");
  var contextBox = document.getElementById("director-note-context");
  if (!box) return;

  fetch("assets/world/world-manifest.json")
    .then(function (r) {
      return r.json();
    })
    .then(function (manifest) {
      if (!manifest.reviewNotes) return;

      function setNote(text) {
        if (!text) {
          box.hidden = true;
          return;
        }
        box.textContent = "NOTA REGIA — " + text;
        box.hidden = false;
      }

      // Riga di contesto: una volta sola, sparisce al primo scroll o dopo un
      // po' — non è ripetuta ad ogni cambio di clip (sarebbe rumore).
      if (contextBox && manifest.reviewIntroNote) {
        contextBox.textContent = manifest.reviewIntroNote;
        contextBox.hidden = false;
        var dismissContext = function () {
          contextBox.hidden = true;
          window.removeEventListener("scroll", dismissContext);
        };
        window.addEventListener("scroll", dismissContext, { once: true, passive: true });
        setTimeout(dismissContext, 7000);
      }

      // Fase intro (non guidata da scroll): nota fissa finché l'intro non finisce.
      var introNote = manifest.intro && manifest.intro.directorNote;
      if (introNote) setNote(introNote);

      // "hey:intro-done" (assets/js/home.js) è l'unico segnale che uso per
      // sapere quando smettere di mostrare la nota dell'intro e iniziare a
      // seguire la sezione attiva — i route dot del viaggio esistono già
      // durante l'intro stessa (il mount parte in parallelo, vedi home.js),
      // quindi non posso agganciarmi alla loro sola presenza.
      if (window.__heyIntroDone) attachSectionWatcher();
      else window.addEventListener("hey:intro-done", attachSectionWatcher, { once: true });

      function attachSectionWatcher() {
        var dots = document.querySelectorAll(".sw-route__dot");
        if (!dots.length) {
          setTimeout(attachSectionWatcher, 200);
          return;
        }
        var notes = (manifest.sections || []).map(function (s) {
          return s.directorNote || "";
        });
        function sync() {
          for (var i = 0; i < dots.length; i++) {
            if (dots[i].classList.contains("is-active")) {
              setNote(notes[i]);
              return;
            }
          }
        }
        sync();
        var mo = new MutationObserver(sync);
        dots.forEach(function (d) {
          mo.observe(d, { attributes: true, attributeFilter: ["class"] });
        });
      }
    })
    .catch(function () {
      /* niente manifest, niente note — il sito resta comunque intero */
    });
})();
