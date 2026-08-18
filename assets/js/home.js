// HEY — monta il viaggio (Home) leggendo assets/world/world-manifest.json.
// Sostituire i placeholder in futuro = sovrascrivere i file in assets/world/ +
// aggiornare il manifest. Questo script non cambia. Vedi HEY_MASTER_CONTEXT.md §6.1.
(function () {
  "use strict";

  var mount = document.getElementById("world");
  if (!mount || typeof window.mountScrollWorld !== "function") return;

  // ---------------------------------------------------------------------
  // INTRO — clip una tantum (non in loop, non guidata dallo scroll): la donna
  // esce/si svela da dietro la colonna. Gira una sola volta all'apertura del
  // sito, poi dissolve nel loop (sezione 0 del viaggio, vedi sotto). Se in
  // manifest.intro non c'è ancora una clip, la si salta subito — nessun
  // placeholder finto, il loop parte da solo.
  // ---------------------------------------------------------------------
  function playIntro(intro) {
    var host = document.getElementById("intro");
    if (!host) return Promise.resolve();
    if (!intro || !intro.clip) {
      host.remove();
      window.__heyIntroDone = true;
      window.dispatchEvent(new CustomEvent("hey:intro-done"));
      return Promise.resolve();
    }
    return new Promise(function (resolve) {
      var done = false;
      function finish() {
        if (done) return;
        done = true;
        host.classList.add("is-hidden");
        window.__heyIntroDone = true;
      window.dispatchEvent(new CustomEvent("hey:intro-done"));
        setTimeout(function () {
          host.remove();
        }, 700);
        resolve();
      }
      var v = document.createElement("video");
      v.muted = true;
      v.playsInline = true;
      v.setAttribute("muted", "");
      v.setAttribute("playsinline", "");
      v.preload = "auto";
      if (intro.still) {
        var poster = document.createElement("img");
        poster.alt = "";
        poster.src = intro.still;
        host.appendChild(poster);
      }
      v.addEventListener("ended", finish);
      v.addEventListener("error", finish);
      // Rete lenta o autoplay bloccato: non si resta bloccati sull'intro.
      var safety = setTimeout(finish, 8000);
      v.addEventListener("ended", function () {
        clearTimeout(safety);
      });
      v.src = intro.clip;
      host.appendChild(v);
      var p = v.play();
      if (p && p.catch) p.catch(finish); // autoplay negato: salta all'istante
    });
  }

  fetch("assets/world/world-manifest.json")
    .then(function (r) {
      return r.json();
    })
    .then(function (manifest) {
      var sections = manifest.sections.map(function (s, i) {
        return {
          id: s.id,
          label: s.label,
          still: s.still,
          clip: s.clip,
          accent: s.accent,
          eyebrow: s.eyebrow || "",
          title: s.title || "",
          body: "",
          tags: [],
          cta: s.cta || null,
          loopIdle: i === 0, // sezione 0 = il loop pre-scroll ("HEY.")
        };
      });

      window.mountScrollWorld(mount, {
        brand: null,
        hint: "",
        nav: false,
        atmosphere: true,
        diveScroll: manifest.diveScroll || 1.3,
        connScroll: manifest.connScroll || 0.7,
        sections: sections,
        connectors: manifest.connectors || [],
      });

      // In parallelo al mount, non in sequenza bloccante: così il loop (sezione
      // 0) ha già iniziato a caricare la sua clip mentre l'intro sta girando,
      // ed è pronto a subentrare via loopIdle nel momento in cui l'intro finisce.
      playIntro(manifest.intro);

      if (manifest.placeholder) {
        mount.setAttribute("data-placeholder", "true");
      }

      // Il rig del viaggio (route dots, hint, scrollbar) è in position:fixed sul
      // viewport per costruzione dell'engine — resta altrimenti visibile anche
      // dopo la fine del film, sopra la sezione post-viaggio. Lo si spegne
      // quando quella sezione entra in vista.
      var post = document.getElementById("post");
      if (post && "IntersectionObserver" in window) {
        var io = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              document.body.classList.toggle("world-done", entry.isIntersecting);
            });
          },
          // rootMargin invece del semplice threshold 0: con quello la classe
          // scattava appena un pixel della sezione entrava dal basso, spegnendo
          // il testo del viaggio mentre l'ultima scena era ancora a schermo —
          // "YOUR IDEA." spariva prima di essere letto. Con il margine negativo
          // la sezione deve arrivare a meta' viewport, cioe' quando ha davvero
          // preso il posto del film.
          { threshold: 0, rootMargin: "0px 0px -50% 0px" }
        );
        io.observe(post);
      }
    })
    .catch(function (err) {
      // Nessuna clip disponibile: il fallback è il fotogramma statico già nel
      // markup (vedi .world-fallback in index.html), niente si rompe.
      console.warn("HEY: impossibile caricare il viaggio.", err);
    });
})();
