/* §6.3 — The same shot, state by state.
   Anyone can put a before next to an after. Having the backstage, the plate
   and the final of one shot is the barrier to entry, so the timeline shows
   the craft rather than the result.

   Working states (effects, compositing, transformation) sit inset behind a
   lime hairline — a shot under examination. The idea and the finished film
   go full bleed. The last step is the one where the craft disappears. */
(function () {
  'use strict';

  var HEY = window.HEY;

  var root = document.querySelector('[data-scrub]');
  if (!root) return;

  var stage = root.querySelector('[data-scrub-stage]');
  var canvas = root.querySelector('[data-scrub-canvas]');
  var rail = root.querySelector('[data-scrub-rail]');
  var fill = root.querySelector('[data-scrub-fill]');
  var ticks = root.querySelectorAll('[data-scrub-ticks] li');
  var caption = root.querySelector('[data-scrub-caption]');
  var nowEl = root.querySelector('[data-scrub-now]');
  var ideaEl = root.querySelector('[data-scrub-idea]');
  var marksEl = root.querySelector('[data-scrub-marks]');
  var marks = [].slice.call(root.querySelectorAll('.mark'));
  marks.forEach(function (el) {
    el._mx = parseFloat(el.dataset.mx);
    el._my = parseFloat(el.dataset.my);
  });
  var grab = root.querySelector('[data-scrub-grab]');
  var ctx = canvas.getContext('2d', { alpha: false });

  var LAST = 5;
  var AUTOPLAY_DELAY = 1.4;
  var AUTOPLAY_SPEED = 0.36;   // states per second

  var STATES = [
    { key: 'backstage',  inset: 0,     dark: 0.9, rule: 0, idea: 1, mark: 0, name: 'Idea',
      text: 'Un uomo vola dentro una piscina vuota. Prima di qualunque strumento esiste solo la frase che descrive l’immagine.' },
    { key: 'backstage',  inset: 0,     dark: 0,   rule: 0, idea: 0, mark: 0, name: 'Produzione',
      text: 'Piscina svuotata, carrello su binari, adduzione d’ossigeno. La parte che non si vede è quella che tiene in piedi tutto il resto.' },
    { key: 'backstage',  inset: 0.055, dark: 0,   rule: 1, idea: 0, mark: 1, name: 'Effetti speciali',
      text: 'Il rig è progettato per sparire. Ogni appoggio sta dove la cancellazione sarà possibile: l’effetto si decide sul set, non dopo.' },
    { key: 'plate',      inset: 0.055, dark: 0,   rule: 1, idea: 0, mark: 0, name: 'Compositing',
      text: 'Carrello e binari rimossi, il corpo resta sospeso. L’illusione è compiuta e il mestiere è diventato invisibile.' },
    { key: 'generative', inset: 0.055, dark: 0,   rule: 1, idea: 0, mark: 0, name: 'Trasformazione',
      text: 'La stessa inquadratura scende sott’acqua. Rovine, colonne, corallo: l’ambiente che l’idea aveva in testa dal principio.' },
    { key: 'generative', inset: 0,     dark: 0,   rule: 0, idea: 0, mark: 0, name: 'Nuova immagine',
      text: 'Nessuno chiede più come è stata fatta. È il punto in cui il lavoro smette di essere una prova e diventa un film.' }
  ];
  // How much lime rides the front of each hand-over. The transformation
  // carries it fully; compositing, which erases the rig, carries half.
  var LIME = [0, 0, 0.5, 1, 0];

  var img = null, ready = false;
  var t = 0, target = 0, velocity = 0;
  var dragging = false, engaged = false, idleFor = 0;
  var shownState = -1;
  var clock = 0;
  var live = false, stopFrames = null, onScreen = false;

  var layerC, layerX, maskC, maskX, prevC, prevX, bandC, bandX, limeTint;
  var dissolve = HEY.dissolve(4241, 46);

  /* ── Sizing ─────────────────────────────────────────── */

  function resize() {
    if (!ready) return;
    HEY.fitCanvas(canvas);
    var w = canvas.width, h = canvas.height;
    if (!w || !h) return;
    layerC = HEY.buffer(w, h); layerX = layerC.getContext('2d');
    var mw = Math.max(2, w >> 1), mh = Math.max(2, h >> 1);
    maskC = HEY.buffer(mw, mh); maskX = maskC.getContext('2d');
    prevC = HEY.buffer(mw, mh); prevX = prevC.getContext('2d');
    bandC = HEY.buffer(mw, mh); bandX = bandC.getContext('2d');
    limeTint = HEY.buffer(mw, mh);
    draw();
  }

  /* ── Value ──────────────────────────────────────────── */

  function setTarget(v, immediate) {
    target = HEY.clamp(v, 0, LAST);
    // With no frame loop running there is nothing to tween and nothing to
    // watch, but the reported value still has to be true: land on it now so a
    // keyboard press is never swallowed while the section is off screen.
    if (immediate || HEY.reduced || !live) { t = target; velocity = 0; draw(); }
  }

  function engage() {
    if (!engaged) {
      engaged = true;
      if (grab) grab.style.opacity = '0';
    }
    idleFor = 0;
  }

  function announce() {
    // Reported from the committed value, not the tweened one: a slider's value
    // is what was asked for, and the easing is only presentation. Reading it
    // off `t` would delay every announcement by the length of the animation.
    var s = Math.round(target);
    if (s === shownState) return;
    shownState = s;
    if (caption) caption.textContent = STATES[s].text;
    if (nowEl) nowEl.textContent = ('0' + (s + 1)) + ' · ' + STATES[s].name;
    if (rail) {
      rail.setAttribute('aria-valuenow', String(s));
      rail.setAttribute('aria-valuetext', STATES[s].name);
    }
    for (var i = 0; i < ticks.length; i++) {
      if (i <= s) ticks[i].setAttribute('data-on', '');
      else ticks[i].removeAttribute('data-on');
    }
  }

  /* ── Input ──────────────────────────────────────────── */

  var dragFrom = 0, dragBase = 0;

  function stageWidth() {
    return stage.getBoundingClientRect().width || 1;
  }

  stage.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragging = true;
    dragFrom = e.clientX;
    dragBase = target;
    engage();
    stage.setAttribute('data-dragging', '');
    stage.setPointerCapture(e.pointerId);
  });

  stage.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    // A full sweep of the stage walks the whole pipeline; on touch this is
    // the same gesture as a swipe, which is why the axis is horizontal.
    setTarget(dragBase + ((e.clientX - dragFrom) / stageWidth()) * LAST);
    e.preventDefault();
  });

  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    stage.removeAttribute('data-dragging');
    if (e && e.pointerId != null && stage.hasPointerCapture(e.pointerId)) {
      stage.releasePointerCapture(e.pointerId);
    }
    setTarget(Math.round(target));
  }
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);

  function railTo(clientX) {
    var r = rail.getBoundingClientRect();
    setTarget(((clientX - r.left) / (r.width || 1)) * LAST);
  }

  var railDrag = false;
  rail.addEventListener('pointerdown', function (e) {
    railDrag = true;
    engage();
    rail.setPointerCapture(e.pointerId);
    railTo(e.clientX);
    e.preventDefault();
  });
  rail.addEventListener('pointermove', function (e) { if (railDrag) railTo(e.clientX); });
  function endRail(e) {
    if (!railDrag) return;
    railDrag = false;
    if (e && e.pointerId != null && rail.hasPointerCapture(e.pointerId)) {
      rail.releasePointerCapture(e.pointerId);
    }
    setTarget(Math.round(target));
  }
  rail.addEventListener('pointerup', endRail);
  rail.addEventListener('pointercancel', endRail);

  rail.addEventListener('keydown', function (e) {
    var k = e.key, n = null;
    if (k === 'ArrowRight' || k === 'ArrowUp' || k === 'PageUp') n = Math.round(target) + 1;
    else if (k === 'ArrowLeft' || k === 'ArrowDown' || k === 'PageDown') n = Math.round(target) - 1;
    else if (k === 'Home') n = 0;
    else if (k === 'End') n = LAST;
    if (n === null) return;
    e.preventDefault();
    engage();
    setTarget(n);
  });

  /* ── Painting ───────────────────────────────────────── */

  function draw() {
    if (!ready || !layerC) return;
    var w = canvas.width, h = canvas.height;
    var i = HEY.clamp(Math.floor(t), 0, LAST - 1);
    var f = HEY.clamp(t - i, 0, 1);
    var e = HEY.smooth(f);
    var A = STATES[i], B = STATES[i + 1];

    var inset = HEY.lerp(A.inset, B.inset, e);
    var dark = HEY.lerp(A.dark, B.dark, e);
    var rule = HEY.lerp(A.rule, B.rule, e);
    var ideaAmt = HEY.lerp(A.idea, B.idea, e);
    var markAmt = HEY.lerp(A.mark, B.mark, e);

    var pad = inset * w;
    var bw = w - pad * 2, bh = h - pad * 2;
    var src = img[A.key];
    var fit = HEY.cover(bw, bh, src.naturalWidth, src.naturalHeight);
    fit.x += pad; fit.y += pad;

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#121310';
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.beginPath();
    ctx.rect(pad, pad, bw, bh);
    ctx.clip();
    ctx.drawImage(src, fit.x, fit.y, fit.w, fit.h);

    var swap = A.key !== B.key;
    if (swap && f > 0.001) {
      dissolve(maskX, maskC.width, maskC.height, f);
      layerX.globalCompositeOperation = 'copy';
      layerX.drawImage(img[B.key], fit.x, fit.y, fit.w, fit.h);
      layerX.globalCompositeOperation = 'destination-in';
      layerX.drawImage(maskC, 0, 0, w, h);
      ctx.drawImage(layerC, 0, 0);

      // The advancing edge of the hand-over, in lime: the same trace as the
      // hero, here marking where one state is giving way to the next.
      var limeAmt = LIME[i] * Math.sin(Math.PI * f);
      if (limeAmt > 0.02) {
        var mw = maskC.width, mh = maskC.height;
        dissolve(prevX, mw, mh, f, 1.13);
        bandX.globalCompositeOperation = 'copy';
        bandX.drawImage(prevC, 0, 0);
        bandX.globalCompositeOperation = 'destination-out';
        bandX.drawImage(maskC, 0, 0);

        var lt = limeTint.getContext('2d');
        lt.globalCompositeOperation = 'copy';
        lt.drawImage(bandC, 0, 0);
        lt.globalCompositeOperation = 'source-in';
        lt.fillStyle = '#E5FD5D';
        lt.fillRect(0, 0, mw, mh);

        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 0.5 * limeAmt;
        ctx.drawImage(limeTint, 0, 0, w, h);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
      }
    }

    if (dark > 0.001) {
      ctx.fillStyle = 'rgba(18,19,16,' + dark.toFixed(3) + ')';
      ctx.fillRect(0, 0, w, h);
    }
    ctx.restore();

    if (rule > 0.01) {
      ctx.strokeStyle = 'rgba(229,253,93,' + (rule * 0.5).toFixed(3) + ')';
      ctx.lineWidth = Math.max(1, HEY.view.dpr);
      ctx.strokeRect(pad + 0.5, pad + 0.5, bw - 1, bh - 1);
    }

    if (ideaEl) ideaEl.style.opacity = ideaAmt.toFixed(3);
    if (marksEl) {
      marksEl.style.opacity = markAmt.toFixed(3);
      if (markAmt > 0.001) {
        for (var m = 0; m < marks.length; m++) {
          var el = marks[m];
          el.style.left = (((fit.x + el._mx * fit.w) / w) * 100).toFixed(3) + '%';
          el.style.top = (((fit.y + el._my * fit.h) / h) * 100).toFixed(3) + '%';
        }
      }
    }
    if (fill) fill.style.width = ((t / LAST) * 100).toFixed(2) + '%';
    announce();
  }

  function tick(dt) {
    clock += dt;

    if (!engaged && onScreen && !HEY.reduced) {
      // Left alone, the journey plays itself — the same path, without a hand.
      idleFor += dt;
      if (idleFor > AUTOPLAY_DELAY && target < LAST) {
        target = Math.min(LAST, target + dt * AUTOPLAY_SPEED);
      }
    }

    if (HEY.reduced) {
      if (t !== target) { t = target; draw(); }
      return;
    }

    var d = target - t;
    if (Math.abs(d) < 0.0004 && Math.abs(velocity) < 0.0004) {
      if (t !== target) { t = target; draw(); }
      return;
    }
    // Critically damped follow: it lands without wobbling past a state.
    velocity += d * 26 * dt;
    velocity *= Math.exp(-9 * dt);
    t = HEY.clamp(t + velocity * dt, 0, LAST);
    draw();
  }

  function start() { if (!live && ready) { live = true; stopFrames = HEY.onFrame(tick); } }
  function halt() { if (live) { live = false; stopFrames(); stopFrames = null; } }

  HEY.frames.then(function (f) {
    if (!f.backstage || !f.backstage.naturalWidth) return;
    img = f;
    ready = true;
    resize();
    announce();

    if (HEY.coarse) {
      var a = root.querySelector('[data-grab-touch]');
      var b = root.querySelector('[data-grab-pointer]');
      if (a && b) { a.hidden = false; b.hidden = true; }
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        onScreen = en[0].isIntersecting;
        onScreen ? start() : halt();
      }, { rootMargin: '5% 0px' }).observe(stage);
    } else {
      onScreen = true;
      start();
    }
  });

  HEY.onResize(resize);
  HEY.onMotionChange(function () { t = target; resize(); });
})();
