// HEY — rivelazione a due livelli, su tutte le sezioni del viaggio.
//
// Livello 01 = la scena ferma che il motore già disegna scrollando (non la
// ridisegniamo: è di scroll-world.js, che qui non viene toccato).
// Livello 02 = un micro-loop video, uno per sezione, dichiarato nel manifest
// come `hoverClip`. Sta sotto una maschera a bordi sfumati che segue il
// puntatore: parte quando il puntatore entra, si ferma quando esce.
//
// Nessuna sezione è scritta a mano: la sezione attiva si legge dallo stato che
// il motore già mantiene per lo scroll (la classe is-active sui suoi indicatori
// di percorso), e da lì si pesca l'hoverClip corrispondente nel manifest.
//
// Un solo comportamento su tutta l'area della maschera: nessuna differenza fra
// zone del fotogramma.
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function isCoarse() {
    return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  }

  function mount(manifest) {
    var world = document.getElementById("world");
    if (!world) return;

    // un hoverClip per sezione, nell'ordine del manifest: l'indice combacia con
    // quello degli indicatori del motore, che seguono le stesse sezioni
    var clips = (manifest.sections || []).map(function (s) {
      return s.hoverClip || null;
    });
    if (!clips.some(Boolean)) return;

    var canvas = document.createElement("canvas");
    canvas.className = "reveal-overlay";
    canvas.setAttribute("aria-hidden", "true");
    world.appendChild(canvas);
    var ctx = canvas.getContext("2d");

    var maskCv = document.createElement("canvas");
    var maskCtx = maskCv.getContext("2d");
    var cutCv = document.createElement("canvas");
    var cutCtx = cutCv.getContext("2d");

    var W = 0, H = 0, dpr = 1;
    var MASK_SCALE = 0.5;

    // la finestra parte piccola e cresce mentre il puntatore si muove
    var R_MIN = 0.09;
    var R_MAX = 0.26;
    var grow = 0;      // 0..1, sale col movimento, decade da fermo
    var tx = 0, ty = 0, cx = 0, cy = 0;
    var lastX = 0, lastY = 0;
    var openTarget = 0, open = 0;
    var raf = 0, lastT = 0;
    var seeded = false;

    // un solo <video> riusato per tutte le sezioni: cambia solo la sorgente
    var vid = document.createElement("video");
    vid.muted = true;
    vid.loop = true;
    vid.playsInline = true;
    vid.preload = "auto";
    vid.setAttribute("muted", "");
    vid.setAttribute("playsinline", "");
    vid.className = "reveal-overlay__src";
    world.appendChild(vid);

    var loadedIndex = -1;
    var wantIndex = -1;
    var videoReady = false;

    function useSection(i) {
      if (i === loadedIndex || i < 0 || !clips[i]) return;
      loadedIndex = i;
      videoReady = false;
      vid.pause();
      vid.src = clips[i];
      vid.load();
    }
    vid.addEventListener("loadeddata", function () {
      videoReady = true;
      if (openTarget > 0) play();
    });

    function play() {
      if (!videoReady) return;
      var p = vid.play();
      if (p && p.catch) p.catch(function () {});
    }

    function resize() {
      var r = world.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.round(window.innerWidth * dpr));
      H = Math.max(1, Math.round(window.innerHeight * dpr));
      canvas.width = W;
      canvas.height = H;
      cutCv.width = W;
      cutCv.height = H;
      maskCv.width = Math.max(1, Math.round(W * MASK_SCALE));
      maskCv.height = Math.max(1, Math.round(H * MASK_SCALE));
      if (!seeded) {
        cx = tx = W / 2;
        cy = ty = H / 2;
        seeded = true;
      }
    }

    // Non un cerchio: il raggio è modulato per angolo da sinusoidi sfasate e poi
    // sfocato — è il blur che toglie il "buco netto" e lascia un bordo morbido.
    function maskPath(c, x, y, r, t) {
      var steps = 52;
      c.beginPath();
      for (var i = 0; i <= steps; i++) {
        var a = (i / steps) * Math.PI * 2;
        var wob =
          1 +
          0.11 * Math.sin(a * 3 + t * 0.0011) +
          0.07 * Math.sin(a * 5 - t * 0.0008) +
          0.05 * Math.sin(a * 2 + t * 0.0016);
        var rr = r * wob;
        var px = x + Math.cos(a) * rr;
        var py = y + Math.sin(a) * rr;
        if (i === 0) c.moveTo(px, py);
        else c.lineTo(px, py);
      }
      c.closePath();
    }

    function buildMask(t) {
      var mw = maskCv.width, mh = maskCv.height;
      maskCtx.setTransform(1, 0, 0, 1, 0, 0);
      maskCtx.clearRect(0, 0, mw, mh);

      var frac = R_MIN + (R_MAX - R_MIN) * grow;
      var r = Math.min(W, H) * frac * open * MASK_SCALE;
      if (r <= 0.5) return false;

      var x = cx * MASK_SCALE, y = cy * MASK_SCALE;
      if (typeof maskCtx.filter === "string") {
        maskCtx.filter = "blur(" + (r * 0.34).toFixed(1) + "px)";
        maskCtx.fillStyle = "#fff";
        maskPath(maskCtx, x, y, r * 0.82, t);
        maskCtx.fill();
        maskCtx.filter = "none";
      } else {
        var g = maskCtx.createRadialGradient(x, y, r * 0.15, x, y, r);
        g.addColorStop(0, "rgba(255,255,255,1)");
        g.addColorStop(0.55, "rgba(255,255,255,0.92)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        maskCtx.fillStyle = g;
        maskCtx.fillRect(0, 0, mw, mh);
      }
      return true;
    }

    function draw(t) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, W, H);
      if (open <= 0.001 || !videoReady || vid.readyState < 2) return;
      if (!buildMask(t)) return;

      // il livello 02 riempie lo schermo come la scena sotto (cover), così la
      // finestra mostra la stessa porzione di inquadratura
      var vw = vid.videoWidth, vh = vid.videoHeight;
      if (!vw || !vh) return;
      var s = Math.max(W / vw, H / vh);
      var dw = vw * s, dh = vh * s;

      cutCtx.setTransform(1, 0, 0, 1, 0, 0);
      cutCtx.clearRect(0, 0, W, H);
      cutCtx.drawImage(vid, (W - dw) / 2, (H - dh) / 2, dw, dh);
      cutCtx.globalCompositeOperation = "destination-in";
      cutCtx.drawImage(maskCv, 0, 0, W, H);
      cutCtx.globalCompositeOperation = "source-over";
      ctx.drawImage(cutCv, 0, 0);
    }

    function tick(t) {
      var dt = lastT ? Math.min(t - lastT, 60) : 16;
      lastT = t;

      cx += (tx - cx) * (reduce ? 1 : 0.2);
      cy += (ty - cy) * (reduce ? 1 : 0.2);
      open += (openTarget - open) * (reduce ? 1 : 0.09);
      // il movimento fa crescere la finestra, la quiete la fa tornare piccola
      grow += (moved ? 1 - grow : -grow) * 0.05 * (dt / 16);
      grow = Math.max(0, Math.min(1, grow));
      moved = false;

      draw(t);

      var still =
        Math.abs(tx - cx) < 0.4 &&
        Math.abs(ty - cy) < 0.4 &&
        Math.abs(openTarget - open) < 0.002;
      if (still && openTarget === 0) {
        open = 0;
        grow = 0;
        draw(t);
        raf = 0;
        lastT = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
    }

    var moved = false;
    function wake() {
      if (!raf) raf = requestAnimationFrame(tick);
    }

    function pointAt(clientX, clientY) {
      var nx = clientX * dpr, ny = clientY * dpr;
      if (Math.abs(nx - lastX) + Math.abs(ny - lastY) > 2) moved = true;
      lastX = nx;
      lastY = ny;
      tx = nx;
      ty = ny;
    }

    function activeIndex() {
      var dots = document.querySelectorAll("#world .sw-route__dot");
      for (var i = 0; i < dots.length; i++) {
        if (dots[i].classList.contains("is-active")) return i;
      }
      return -1;
    }

    function enter(clientX, clientY) {
      var i = activeIndex();
      if (i < 0 || !clips[i]) {
        openTarget = 0;
        wake();
        return;
      }
      if (i !== wantIndex) {
        wantIndex = i;
        useSection(i);
      }
      pointAt(clientX, clientY);
      openTarget = 1;
      play();
      wake();
    }

    function leave() {
      openTarget = 0;
      vid.pause();
      wake();
    }

    if (!isCoarse()) {
      window.addEventListener("mousemove", function (e) {
        enter(e.clientX, e.clientY);
      });
      document.addEventListener("mouseleave", leave);
    }

    // Touch: stesso gesto su tutte le sezioni, disponibile da subito.
    // Volutamente NON si annulla lo scroll: su mobile lo scroll è la timeline
    // del viaggio, bloccarlo lascerebbe l'utente fermo. Il dito quindi scorre
    // il film e insieme si porta dietro la finestra.
    window.addEventListener(
      "touchmove",
      function (e) {
        if (!e.touches || !e.touches.length) return;
        enter(e.touches[0].clientX, e.touches[0].clientY);
      },
      { passive: true }
    );
    window.addEventListener("touchstart", function (e) {
      if (!e.touches || !e.touches.length) return;
      enter(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener("touchend", leave, { passive: true });
    window.addEventListener("touchcancel", leave, { passive: true });

    // quando il viaggio finisce, il rig sparisce: anche questa deve sparire
    var mo = new MutationObserver(function () {
      if (document.body.classList.contains("world-done")) leave();
    });
    mo.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    window.addEventListener("resize", resize);
    resize();
    // preparo subito la sezione in cui ci si trova, così la prima apertura
    // non deve aspettare il caricamento
    setTimeout(function () {
      var i = activeIndex();
      if (i >= 0) {
        wantIndex = i;
        useSection(i);
      }
    }, 400);
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("world")) return;
    fetch("assets/world/world-manifest.json")
      .then(function (r) {
        return r.json();
      })
      .then(mount)
      .catch(function () {
        /* senza manifest la rivelazione semplicemente non esiste */
      });
  });
})();
