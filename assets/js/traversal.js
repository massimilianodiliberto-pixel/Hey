/* §6.1 — Entering the world.
   Scroll drives a camera, not a slideshow. Progress is a pure function of
   scroll position, so the shot scrubs backwards exactly as it ran forward:
   the page behaves like a clip on a playhead, never like a queue of
   transitions that have already fired. */
(function () {
  'use strict';

  var HEY = window.HEY;

  var track = document.querySelector('.track--hero');
  if (!track) return;

  var frame = track.querySelector('[data-plane="frame"]');
  var vignette = track.querySelector('[data-plane="vignette"]');
  var copy = track.querySelector('[data-plane="copy"]');
  var cue = track.querySelector('[data-plane="cue"]');

  var parallax = [].slice.call(document.querySelectorAll('.case__media img'));

  var geom = { top: 0, span: 1 };
  var pxTargets = [];

  function remeasure() {
    var r = track.getBoundingClientRect();
    geom.top = r.top + HEY.view.scroll;
    geom.span = Math.max(1, track.offsetHeight - HEY.view.h);

    pxTargets = parallax.map(function (el) {
      var b = el.getBoundingClientRect();
      return { el: el, top: b.top + HEY.view.scroll, h: b.height };
    });
  }

  // Published so the reveal can invert the camera analytically and map the
  // pointer without reading layout inside the frame loop.
  var cam = (HEY.heroCam = { scale: 1.06, lift: 0 });

  /* Static poses, so a reduced-motion visitor still gets a composed frame
     rather than whatever the last animated value happened to be. */
  function rest() {
    cam.scale = 1.02;
    cam.lift = 0;
    if (frame) frame.style.transform = 'scale(1.02)';
    if (vignette) vignette.style.opacity = '0.55';
    if (copy) { copy.style.transform = 'none'; copy.style.opacity = '1'; }
    if (cue) cue.style.opacity = '0';
    parallax.forEach(function (el) { el.style.transform = 'none'; });
  }

  function tick() {
    var p = HEY.clamp((HEY.view.scroll - geom.top) / geom.span, 0, 1);
    var e = HEY.smooth(p);

    if (frame) {
      // Dolly forward and pitch down: the frame grows past the viewport
      // edges and you pass through it, rather than it fading out under you.
      var scale = 1.06 + e * 0.62;
      var lift = -e * HEY.view.h * 0.09;
      var tilt = e * 3.6;
      cam.scale = scale;
      cam.lift = lift;
      frame.style.transform =
        'translate3d(0,' + lift.toFixed(2) + 'px,0) rotateX(' + tilt.toFixed(3) +
        'deg) scale(' + scale.toFixed(4) + ')';
    }

    if (vignette) {
      vignette.style.opacity = (0.42 + HEY.inRange(p, 0.18, 0.94) * 0.58).toFixed(3);
    }

    if (copy) {
      var out = HEY.inRange(p, 0.3, 0.68);
      copy.style.transform = 'translate3d(0,' + (-out * 90).toFixed(1) + 'px,0)';
      copy.style.opacity = (1 - out).toFixed(3);
    }

    if (cue) cue.style.opacity = (1 - HEY.inRange(p, 0, 0.14)).toFixed(3);

    for (var i = 0; i < pxTargets.length; i++) {
      var t = pxTargets[i];
      // −1 above the fold, +1 below it: a slow drift that keeps the sections
      // reading as depth rather than as stacked cards.
      var rel = (t.top + t.h / 2 - HEY.view.scroll - HEY.view.h / 2) / HEY.view.h;
      t.el.style.transform =
        'translate3d(0,' + HEY.clamp(rel, -1.2, 1.2) * -22 + 'px,0) scale(1.08)';
    }
  }

  var live = false;
  var stop = null;

  function start() {
    if (live || HEY.reduced) return;
    live = true;
    stop = HEY.onFrame(tick);
  }
  function halt() {
    if (!live) return;
    live = false;
    if (stop) stop();
    stop = null;
  }

  function apply() {
    remeasure();
    if (HEY.reduced) { halt(); rest(); return; }
    start();
    tick();
  }

  HEY.onResize(apply);
  HEY.onMotionChange(apply);

  // Frames are only worth spending while something the camera drives is on
  // screen — the hero track or one of the parallax targets further down.
  if ('IntersectionObserver' in window) {
    // Track membership, not a tally: the first callback reports every observed
    // element, and counting the off-screen ones as −1 would cancel out the
    // hero and leave the camera frozen at its opening pose.
    var onScreen = [];
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        var at = onScreen.indexOf(entries[i].target);
        if (entries[i].isIntersecting) { if (at === -1) onScreen.push(entries[i].target); }
        else if (at > -1) onScreen.splice(at, 1);
      }
      if (HEY.reduced) return;
      onScreen.length ? start() : halt();
    }, { rootMargin: '20% 0px 20% 0px' });
    io.observe(track);
    parallax.forEach(function (el) { io.observe(el); });
  }

  apply();
  addEventListener('load', apply);
})();
