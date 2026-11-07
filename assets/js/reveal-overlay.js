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

    // SCIA LIME (master context §6.2): dove passa il puntatore resta per un
    // attimo una traccia; dentro la traccia il livello 02 resta visibile e il
    // bordo è un filo lime che si spegne. Il lime rivela, non riempie.
    var TRAIL_MS = 900;
    var trail = [];      // {x, y, r, t} in pixel del canvas
    var lastTrailT = 0;

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
        // la traccia: il livello 02 resta aperto per un attimo dove si è passati
        for (var k = 0; k < trail.length; k++) {
          var q = trail[k], age = (t - q.t) / TRAIL_MS;
          if (age >= 1) continue;
          maskCtx.globalAlpha = (1 - age) * 0.55;
          maskCtx.fillStyle = "#fff";
          maskPath(maskCtx, q.x * MASK_SCALE, q.y * MASK_SCALE, q.r * MASK_SCALE * 0.82 * (1 - age * 0.5), q.t);
          maskCtx.fill();
        }
        maskCtx.globalAlpha = 1;
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
      drawLime(t);
    }

    // il filo lime: sul bordo della finestra e, sempre più debole, sugli
    // ultimi punti della traccia
    function drawLime(t) {
      if (reduce) return;
      var frac = R_MIN + (R_MAX - R_MIN) * grow;
      var r = Math.min(W, H) * frac * open;
      ctx.lineWidth = Math.max(1, dpr);
      ctx.strokeStyle = "#E5FD5D";
      for (var k = 0; k < trail.length; k++) {
        var q = trail[k], age = (t - q.t) / TRAIL_MS;
        if (age >= 1) continue;
        ctx.globalAlpha = (1 - age) * (1 - age) * 0.16 * open;
        maskPath(ctx, q.x, q.y, q.r * 0.74 * (1 - age * 0.5), q.t);
        ctx.stroke();
      }
      ctx.globalAlpha = 0.42 * open;
      maskPath(ctx, cx, cy, r * 0.74, t);
      ctx.stroke();
      ctx.globalAlpha = 1;
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
      if (!reduce && moved && open > 0.05 && t - lastTrailT > 45) {
        // un punto nuovo solo se ci si è spostati davvero: col movimento lento
        // gli anelli si accatastavano come curve di livello (effetto "tech")
        var rNow = Math.min(W, H) * (R_MIN + (R_MAX - R_MIN) * grow) * open;
        var lp = trail[trail.length - 1];
        if (!lp || Math.hypot(cx - lp.x, cy - lp.y) > rNow * 0.45) {
          lastTrailT = t;
          trail.push({ x: cx, y: cy, r: rNow, t: t });
        }
      }
      while (trail.length && t - trail[0].t > TRAIL_MS) trail.shift();
      if (trail.length > 24) trail.shift();
      moved = false;

      draw(t);

      var still =
        Math.abs(tx - cx) < 0.4 &&
        Math.abs(ty - cy) < 0.4 &&
        Math.abs(openTarget - open) < 0.002;
      if (still && openTarget === 0 && !trail.length) {
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

    // `subito` chiude di scatto invece di dissolvere: lo usa lo scroll, dove la
    // rivelazione deve sparire nell'istante in cui il viaggio si muove. Con la
    // sola dissolvenza (~800ms) la finestra restava visibile a cavallo del
    // cambio di sezione. Uscendo col mouse invece la morbidezza serve, e resta.
    function leave(subito) {
      openTarget = 0;
      vid.pause();
      if (subito) {
        open = 0;
        grow = 0;
        trail.length = 0;
        draw(performance.now());
      }
      wake();
    }

    // Lo scroll spegne la rivelazione all'istante. Serve perché scorrendo con
    // la rotella il puntatore non si muove: senza questo il video resterebbe
    // acceso "per inerzia" mentre si passa da una sezione all'altra, come se il
    // mouse fosse ancora fermo sopra. Si riaccende solo quando lo scroll è
    // finito e il puntatore si muove davvero.
    var scrolling = false;
    var scrollIdle = 0;
    window.addEventListener(
      "scroll",
      function () {
        if (!scrolling) {
          scrolling = true;
          leave(true);
        }
        clearTimeout(scrollIdle);
        scrollIdle = setTimeout(function () {
          scrolling = false;
        }, 140);
      },
      { passive: true }
    );

    if (!isCoarse()) {
      window.addEventListener("mousemove", function (e) {
        if (scrolling) return; // in movimento: nessuna rivelazione
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
        // su touch il dito scorre il viaggio: se sta scorrendo, niente finestra
        if (scrolling) return;
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

    // MOBILE (§6.4) — stesso viaggio, gesto naturale.
    // 1) Swipe orizzontale: scena successiva / precedente. Lo scroll verticale
    //    resta la timeline; lo swipe è una scorciatoia, non la sostituisce.
    var sw = null;
    window.addEventListener("touchstart", function (e) {
      lastTouch = performance.now();
      stopDrift();
      if (e.touches.length !== 1 || document.body.classList.contains("world-done")) { sw = null; return; }
      sw = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: e.timeStamp };
    }, { passive: true });
    window.addEventListener("touchend", function (e) {
      lastTouch = performance.now();
      if (!sw || !e.changedTouches.length) return;
      var dx = e.changedTouches[0].clientX - sw.x, dy = e.changedTouches[0].clientY - sw.y;
      // niente limite di tempo: conta solo la direzione (un gesto lento ma
      // chiaramente orizzontale è comunque uno swipe)
      sw = null;
      if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.6) return;
      var i = activeIndex();
      var dots = document.querySelectorAll("#world .sw-route__dot");
      var to = dx < 0 ? i + 1 : i - 1;
      if (i >= 0 && to >= 0 && to < dots.length) dots[to].click();
    }, { passive: true });

    // 2) Se nessuno tocca, la rivelazione fa il suo percorso da sola: la
    //    finestra si muove lenta sulla scena, come farebbe il dito. Si ferma
    //    al primo tocco o scroll e riparte dopo qualche secondo di quiete.
    //    Solo su touch, mai con movimento ridotto.
    var lastTouch = performance.now();
    var DRIFT_AFTER = 3500;
    var drifting = false, driftRaf = 0;
    function driftOK() {
      return isCoarse() && !reduce && !scrolling && !document.hidden &&
        !document.body.classList.contains("world-done") &&
        performance.now() - lastTouch > DRIFT_AFTER && activeIndex() >= 0;
    }
    function stopDrift() {
      if (drifting) { drifting = false; leave(); }
    }
    function driftLoop(t) {
      driftRaf = requestAnimationFrame(driftLoop);
      if (!driftOK()) { stopDrift(); return; }
      drifting = true;
      var w = window.innerWidth, h = window.innerHeight;
      enter(w * (0.5 + 0.24 * Math.sin(t * 0.00031)), h * (0.42 + 0.15 * Math.sin(t * 0.00047 + 1.3)));
    }
    if (isCoarse() && !reduce) {
      driftRaf = requestAnimationFrame(driftLoop);
      window.addEventListener("scroll", function () { lastTouch = performance.now(); stopDrift(); }, { passive: true });
    }

    // quando il viaggio finisce, il rig sparisce: anche questa deve sparire
    var mo = new MutationObserver(function () {
      if (document.body.classList.contains("world-done")) leave(true);
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
