/* Image readiness, cover-fit maths, brush sprites and the material dissolve.
   Nothing interactive starts until every frame is decoded — the first gesture
   must never land on an undecoded bitmap. */
(function () {
  'use strict';

  var HEY = window.HEY;

  /* ── Frames ─────────────────────────────────────────── */

  function settled(img) {
    if (img.complete && img.naturalWidth) {
      return img.decode ? img.decode().catch(noop) : Promise.resolve();
    }
    return new Promise(function (res) {
      img.addEventListener('load', function () {
        (img.decode ? img.decode().catch(noop) : Promise.resolve()).then(res);
      }, { once: true });
      img.addEventListener('error', res, { once: true });
    });
  }
  function noop() {}

  var pics = document.querySelectorAll('[data-sources] picture[data-frame]');
  var frames = {};
  var jobs = [];
  Array.prototype.forEach.call(pics, function (p) {
    var img = p.querySelector('img');
    frames[p.dataset.frame] = img;
    jobs.push(settled(img));
  });

  HEY.frames = Promise.all(jobs).then(function () { return frames; });

  /* ── Geometry ───────────────────────────────────────── */

  HEY.cover = function (cw, ch, iw, ih) {
    var s = Math.max(cw / iw, ch / ih);
    var w = iw * s, h = ih * s;
    return { x: (cw - w) / 2, y: (ch - h) / 2, w: w, h: h };
  };

  /* These canvases carry photography, never text, so a full 2× backing store
     buys nothing visible and costs fill rate on every frame. Cap the backing
     width and let the browser scale it up. */
  var MAX_BACKING_W = 1800;

  /* `size` overrides the measured box. The hero canvas lives inside the plane
     the camera transforms, so its client rect grows as the shot dollies in —
     measuring it would tie the backing store to the scroll position. */
  HEY.fitCanvas = function (canvas, maxW, size) {
    var cw = size ? size.w : 0, ch = size ? size.h : 0;
    if (!cw || !ch) {
      var r = canvas.getBoundingClientRect();
      cw = r.width; ch = r.height;
    }
    if (!cw || !ch) return false;
    var cap = maxW || MAX_BACKING_W;
    var d = HEY.view.dpr;
    if (cw * d > cap) d = cap / cw;
    var w = Math.max(1, Math.round(cw * d));
    var h = Math.max(1, Math.round(ch * d));
    if (canvas.width === w && canvas.height === h) return false;
    canvas.width = w;
    canvas.height = h;
    return true;
  };

  HEY.buffer = function (w, h) {
    var c = document.createElement('canvas');
    c.width = Math.max(1, w | 0);
    c.height = Math.max(1, h | 0);
    return c;
  };

  /* ── Brushes ────────────────────────────────────────────
     A perfect circle reads as a UI cursor. Each sprite is a cluster of
     offset lobes, so the edge of a revealed area is ragged like a wipe
     through emulsion rather than a shape drawn on top. */

  var BRUSH_PX = 160;

  /* The profile is deliberately not a soft blur: a solid core with a short
     feathered rim. A fully soft brush accumulates into a wash, which reads as
     a smudge over the frame instead of an opening cut through it — and it
     leaves no edge for the lime to live on. */
  function makeBrush(seed) {
    var c = HEY.buffer(BRUSH_PX, BRUSH_PX);
    var x = c.getContext('2d');
    var rnd = HEY.prng(seed);
    var mid = BRUSH_PX / 2;
    for (var i = 0; i < 6; i++) {
      var a = rnd() * Math.PI * 2;
      var d = i === 0 ? 0 : rnd() * mid * 0.3;
      var r = mid * (i === 0 ? 0.66 : 0.3 + rnd() * 0.28);
      var cx = mid + Math.cos(a) * d;
      var cy = mid + Math.sin(a) * d;
      var g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.62, 'rgba(255,255,255,0.96)');
      g.addColorStop(0.86, 'rgba(255,255,255,0.42)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = g;
      x.fillRect(0, 0, BRUSH_PX, BRUSH_PX);
    }
    return c;
  }

  var brushes = [makeBrush(11), makeBrush(29), makeBrush(53), makeBrush(97)];
  HEY.brush = function (i) { return brushes[i & 3]; };

  HEY.stamp = function (ctx, sprite, x, y, r, alpha) {
    ctx.globalAlpha = alpha;
    ctx.drawImage(sprite, x - r, y - r, r * 2, r * 2);
    ctx.globalAlpha = 1;
  };

  /* ── Material dissolve ──────────────────────────────────
     Not a crossfade: patches of the next state arrive in a fixed but
     scattered order, the way one emulsion gives way to another. */

  HEY.dissolve = function (seed, count) {
    var n = count || 46;
    var rnd = HEY.prng(seed);
    var cols = 8;
    var rows = Math.ceil(n / cols);
    var blobs = [];
    for (var i = 0; i < n; i++) {
      var cx = (i % cols + 0.5) / cols;
      var cy = (Math.floor(i / cols) + 0.5) / rows;
      blobs.push({
        x: cx + (rnd() - 0.5) / cols * 1.5,
        y: cy + (rnd() - 0.5) / rows * 1.5,
        r: 0.15 + rnd() * 0.13,
        order: rnd(),
        sprite: (rnd() * 4) | 0
      });
    }
    var W = 0.4;

    /* `grow` paints the same field with fattened patches. Subtracting the
       plain field from a grown one leaves a rim around every patch — the
       moving edge of the hand-over, which is where the lime belongs. */
    return function paint(ctx, w, h, f, grow) {
      ctx.clearRect(0, 0, w, h);
      if (f <= 0) return;
      if (f >= 1) { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h); return; }
      var reach = f * (1 + W);
      var diag = Math.max(w, h);
      var k = grow || 1;
      for (var i = 0; i < blobs.length; i++) {
        var b = blobs[i];
        var a = HEY.clamp((reach - b.order) / W, 0, 1);
        if (a <= 0) continue;
        HEY.stamp(ctx, brushes[b.sprite], b.x * w, b.y * h,
                  b.r * diag * (0.6 + 0.4 * a) * k, HEY.smooth(a));
      }
      // Guarantee full coverage by the end so no seam survives the handover.
      var seal = HEY.inRange(f, 0.86, 1);
      if (seal > 0) {
        ctx.globalAlpha = HEY.smooth(seal);
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, w, h);
        ctx.globalAlpha = 1;
      }
    };
  };
})();
