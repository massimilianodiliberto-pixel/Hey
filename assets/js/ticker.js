/* One rAF for the whole page. Every module reads the same cached scroll
   position, so no module can force a second layout pass per frame. */
(function () {
  'use strict';

  var HEY = (window.HEY = window.HEY || {});

  var subs = [];
  var running = false;
  var lastT = 0;

  var view = { w: 0, h: 0, scroll: 0, dpr: 1 };
  HEY.view = view;

  function measure() {
    view.w = window.innerWidth;
    view.h = window.innerHeight;
    view.dpr = Math.min(window.devicePixelRatio || 1, 2);
  }

  function loop(t) {
    var dt = lastT ? Math.min((t - lastT) / 1000, 0.05) : 1 / 60;
    lastT = t;
    view.scroll = window.pageYOffset;

    var batch = subs.slice();
    for (var i = 0; i < batch.length; i++) batch[i](dt, t);

    if (subs.length && !document.hidden) {
      requestAnimationFrame(loop);
    } else {
      running = false;
      lastT = 0;
    }
  }

  function wake() {
    if (running || !subs.length || document.hidden) return;
    running = true;
    requestAnimationFrame(loop);
  }

  HEY.onFrame = function (fn) {
    if (subs.indexOf(fn) === -1) subs.push(fn);
    wake();
    return function off() {
      var i = subs.indexOf(fn);
      if (i > -1) subs.splice(i, 1);
    };
  };

  var resizeSubs = [];
  HEY.onResize = function (fn) {
    resizeSubs.push(fn);
    return fn;
  };

  var resizeRaf = 0;
  function onResize() {
    if (resizeRaf) return;
    resizeRaf = requestAnimationFrame(function () {
      resizeRaf = 0;
      measure();
      for (var i = 0; i < resizeSubs.length; i++) resizeSubs[i]();
      wake();
    });
  }

  measure();
  addEventListener('resize', onResize, { passive: true });
  addEventListener('orientationchange', onResize, { passive: true });
  document.addEventListener('visibilitychange', wake);
  addEventListener('scroll', wake, { passive: true });

  /* ── Motion preference, live ── */
  var mq = matchMedia('(prefers-reduced-motion: reduce)');
  HEY.reduced = mq.matches;
  var motionSubs = [];
  HEY.onMotionChange = function (fn) { motionSubs.push(fn); };
  function motionChanged() {
    HEY.reduced = mq.matches;
    for (var i = 0; i < motionSubs.length; i++) motionSubs[i](HEY.reduced);
    onResize();
  }
  if (mq.addEventListener) mq.addEventListener('change', motionChanged);
  else if (mq.addListener) mq.addListener(motionChanged);

  HEY.coarse = matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ── Maths ── */
  HEY.clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  HEY.lerp = function (a, b, t) { return a + (b - a) * t; };
  HEY.smooth = function (t) { return t * t * (3 - 2 * t); };
  HEY.inRange = function (v, a, b) { return HEY.clamp((v - a) / (b - a), 0, 1); };

  /* Deterministic noise: the dissolve must look identical on every reload. */
  HEY.prng = function (seed) {
    var s = seed >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) >>> 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
})();
