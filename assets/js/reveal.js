/* §6.2 — The swimmer crossing his phases, and the world underneath.
   The base layer drifts between the two production states of the shot. Where
   the pointer passes, the generative state comes through.

   Explicitly NOT a before/after split (master context §6.2): there is no
   divider, no handle, no percentage and no straight edge anywhere. The
   opening is an accumulation field that decays on its own, so it is soft,
   ragged, and closes behind you.

   The lime is not drawn as a shape. It is the difference between the opening
   and a slightly dilated copy of itself — so it can only ever exist exactly
   where the frame is being torn open, and it dies where the opening is
   complete. The colour is the act of revealing, not a marker placed on top. */
(function () {
  'use strict';

  var HEY = window.HEY;

  var root = document.querySelector('[data-reveal]');
  var canvas = document.querySelector('[data-reveal-canvas]');
  if (!root || !canvas) return;

  var ctx = canvas.getContext('2d', { alpha: false });
  var toggle = document.querySelector('[data-reveal-toggle]');
  var hint = document.querySelector('[data-reveal-hint]');

  var MASK_SCALE = 0.5;    // the field is soft; half resolution is invisible
  var TRAIL_TAU = 1.5;     // seconds for the opening to close behind you
  var HALO_TAU = 0.6;      // the dilation fades first, so lime rides the front
  var DILATE = 1.3;
  var IDLE_MS = 2400;
  var PHASE_PERIOD = 12;   // seconds for one backstage↔plate round trip

  var img = null;
  var buf, bufX, maskC, maskX, haloC, haloX, edgeC, edgeX;
  var baseC, baseCX, baseMaskC, baseMaskX;
  var baseDissolve = HEY.dissolve(7717, 44);
  var basePhase = -1;

  var px = 0, py = 0, hasPointer = false;
  var lastInput = -1e9, clock = 0, driftT = 0;
  var forced = 0, forceTarget = 0;
  var touched = false, dirty = false;
  var live = false, stopFrames = null, ready = false;

  /* ── Sizing ─────────────────────────────────────────── */

  function resize() {
    if (!ready) return;
    HEY.fitCanvas(canvas, 1600, { w: HEY.view.w, h: HEY.view.h });
    var w = canvas.width, h = canvas.height;
    if (!w || !h) return;

    buf = HEY.buffer(w, h); bufX = buf.getContext('2d');
    baseC = HEY.buffer(w, h); baseCX = baseC.getContext('2d');
    basePhase = -1;

    var mw = Math.max(2, Math.round(w * MASK_SCALE));
    var mh = Math.max(2, Math.round(h * MASK_SCALE));
    maskC = HEY.buffer(mw, mh); maskX = maskC.getContext('2d');
    haloC = HEY.buffer(mw, mh); haloX = haloC.getContext('2d');
    edgeC = HEY.buffer(mw, mh); edgeX = edgeC.getContext('2d');
    baseMaskC = HEY.buffer(mw, mh); baseMaskX = baseMaskC.getContext('2d');
    draw(0);
  }

  /* ── Input ──────────────────────────────────────────── */

  function toLocal(clientX, clientY) {
    // Invert the hero camera (translate + uniform scale about centre) rather
    // than measuring the element, so pointer handling never forces a layout.
    var cam = HEY.heroCam || { scale: 1, lift: 0 };
    var vw = HEY.view.w, vh = HEY.view.h;
    var lx = (clientX - vw / 2) / cam.scale + vw / 2;
    var ly = (clientY - vh / 2 - cam.lift) / cam.scale + vh / 2;
    return { x: (lx / vw) * maskC.width, y: (ly / vh) * maskC.height };
  }

  /* Strokes are laid down as the events arrive, not once per animation frame:
     a fast sweep fires several moves per frame, and sampling only the last
     one would leave the trail in disconnected dabs. */
  function strokeTo(x, y, seed) {
    var mw = maskC.width;
    var r = mw * 0.13;
    var dx = x - px, dy = y - py;
    var dist = Math.hypot(dx, dy);
    var steps = Math.min(32, Math.max(1, Math.ceil(dist / (r * 0.3))));
    var speed = HEY.clamp(dist / (r * 1.8), 0, 1);
    var rr = r * (0.88 + speed * 0.38);

    maskX.globalCompositeOperation = 'source-over';
    haloX.globalCompositeOperation = 'source-over';
    for (var i = 1; i <= steps; i++) {
      var t = i / steps;
      var sx = px + dx * t, sy = py + dy * t;
      var b = HEY.brush(i + seed);
      HEY.stamp(maskX, b, sx, sy, rr, 0.6);
      HEY.stamp(haloX, b, sx, sy, rr * DILATE, 0.6);
    }
    px = x; py = y;
  }

  function feed(clientX, clientY) {
    if (!ready || !maskC) return;
    var p = toLocal(clientX, clientY);
    if (!hasPointer) { px = p.x; py = p.y; hasPointer = true; }
    strokeTo(p.x, p.y, clock * 60 | 0);
    lastInput = clock;
    dirty = true;
    if (!touched) { touched = true; if (hint) hint.style.opacity = '0'; }
  }

  root.addEventListener('pointermove', function (e) { feed(e.clientX, e.clientY); });
  root.addEventListener('pointerdown', function (e) { feed(e.clientX, e.clientY); });
  root.addEventListener('pointerleave', function () { hasPointer = false; });

  if (toggle) {
    toggle.addEventListener('click', function () {
      forceTarget = forceTarget > 0.5 ? 0 : 1;
      toggle.setAttribute('aria-pressed', forceTarget > 0.5 ? 'true' : 'false');
      lastInput = clock;
      if (HEY.reduced) forced = forceTarget;
      if (!touched) { touched = true; if (hint) hint.style.opacity = '0'; }
    });
  }

  /* ── Painting ───────────────────────────────────────── */

  function drift(dt) {
    // With no one at the controls the opening keeps moving on its own, so the
    // hero states its own trick instead of waiting to be discovered.
    driftT += dt * 0.32;
    var mw = maskC.width, mh = maskC.height;
    var x = mw * (0.5 + 0.28 * Math.sin(driftT) + 0.08 * Math.sin(driftT * 2.3));
    var y = mh * (0.47 + 0.18 * Math.sin(driftT * 0.77 + 1.1));
    if (!hasPointer) { px = x; py = y; hasPointer = true; }
    strokeTo(x, y, driftT * 7 | 0);
  }

  function phaseAt(t) {
    // Hold on each state, then cross. Holding is what makes it read as two
    // takes of one shot rather than a loop that never settles.
    var c = (t % PHASE_PERIOD) / PHASE_PERIOD;
    if (c < 0.34) return 0;
    if (c < 0.5) return HEY.smooth((c - 0.34) / 0.16);
    if (c < 0.84) return 1;
    return 1 - HEY.smooth((c - 0.84) / 0.16);
  }

  function draw(dt) {
    if (!ready || !buf) return;
    var w = canvas.width, h = canvas.height;
    var mw = maskC.width, mh = maskC.height;

    if (!HEY.reduced && dt > 0) {
      maskX.globalCompositeOperation = 'destination-out';
      maskX.fillStyle = 'rgba(0,0,0,' + (1 - Math.exp(-dt / TRAIL_TAU)) + ')';
      maskX.fillRect(0, 0, mw, mh);

      haloX.globalCompositeOperation = 'destination-out';
      haloX.fillStyle = 'rgba(0,0,0,' + (1 - Math.exp(-dt / HALO_TAU)) + ')';
      haloX.fillRect(0, 0, mw, mh);

      forced += (forceTarget - forced) * Math.min(1, dt * 3.4);
    }

    if (forced > 0.002) {
      maskX.globalCompositeOperation = 'source-over';
      maskX.globalAlpha = HEY.smooth(HEY.clamp(forced, 0, 1));
      maskX.fillStyle = '#fff';
      maskX.fillRect(0, 0, mw, mh);
      maskX.globalAlpha = 1;
    }

    /* 1 — base state: backstage giving way to the finished plate. The cycle
       holds on each state for most of its length, so recompose it only when
       the phase actually moves and replay the cached frame otherwise. */
    var phase = HEY.reduced ? 1 : phaseAt(clock);
    var fit = HEY.cover(w, h, img.backstage.naturalWidth, img.backstage.naturalHeight);

    if (Math.abs(phase - basePhase) > 0.002) {
      basePhase = phase;
      baseCX.globalCompositeOperation = 'copy';
      baseCX.drawImage(img.backstage, fit.x, fit.y, fit.w, fit.h);
      if (phase > 0.001) {
        baseDissolve(baseMaskX, mw, mh, phase);
        bufX.globalCompositeOperation = 'copy';
        bufX.drawImage(img.plate, fit.x, fit.y, fit.w, fit.h);
        bufX.globalCompositeOperation = 'destination-in';
        bufX.drawImage(baseMaskC, 0, 0, w, h);
        baseCX.globalCompositeOperation = 'source-over';
        baseCX.drawImage(buf, 0, 0);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(baseC, 0, 0);

    /* 2 — the generative world, clipped by the opening. Drawn a touch larger
       than the plate so it parallaxes against it: it reads as a layer sitting
       under the surface of the film, not beside it. */
    bufX.globalCompositeOperation = 'copy';
    var g = 1.035;
    bufX.drawImage(img.generative,
      fit.x - (fit.w * (g - 1)) / 2, fit.y - (fit.h * (g - 1)) / 2,
      fit.w * g, fit.h * g);
    bufX.globalCompositeOperation = 'destination-in';
    bufX.drawImage(maskC, 0, 0, w, h);
    ctx.drawImage(buf, 0, 0);

    /* 3 — lime = dilation minus opening. Where the frame is fully open the
       result is zero, so the colour survives only on the torn edge. */
    edgeX.globalCompositeOperation = 'copy';
    edgeX.drawImage(haloC, 0, 0);
    edgeX.globalCompositeOperation = 'destination-out';
    edgeX.drawImage(maskC, 0, 0);
    edgeX.globalCompositeOperation = 'source-in';
    edgeX.fillStyle = '#E5FD5D';
    edgeX.fillRect(0, 0, mw, mh);

    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = 0.9;
    ctx.drawImage(edgeC, 0, 0, w, h);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    if (!canvas.hasAttribute('data-ready')) canvas.setAttribute('data-ready', '');
  }

  function tick(dt) {
    clock += dt;
    if (HEY.reduced) {
      // Nothing moves unless the visitor moves it — but what they do move has
      // to be painted, so the stroke still reaches the screen.
      if (forced !== forceTarget) { forced = forceTarget; dirty = true; }
      if (dirty) { dirty = false; draw(0); }
      return;
    }
    if ((clock - lastInput) > IDLE_MS / 1000) drift(dt);
    draw(dt);
  }

  /* ── Lifecycle ──────────────────────────────────────── */

  function start() { if (!live && ready) { live = true; stopFrames = HEY.onFrame(tick); } }
  function halt() { if (live) { live = false; stopFrames(); stopFrames = null; } }

  HEY.frames.then(function (f) {
    if (!f.backstage || !f.plate || !f.generative) return;
    if (!f.backstage.naturalWidth) return;
    img = f;
    ready = true;
    resize();

    if (HEY.coarse) {
      var t = document.querySelector('[data-hint-touch]');
      var p = document.querySelector('[data-hint-pointer]');
      if (t && p) { t.hidden = false; p.hidden = true; }
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) {
        e[0].isIntersecting ? start() : halt();
      }, { rootMargin: '10% 0px' }).observe(canvas);
    } else {
      start();
    }
  });

  HEY.onResize(resize);
  HEY.onMotionChange(function () { forced = forceTarget; resize(); });
})();
