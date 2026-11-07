// HEY — scrub di processo (master context §6.3), pagina SYSTEM.
// Lo stesso shot attraversato stato per stato:
// IDEA → PRODUZIONE → EFFETTI SPECIALI → COMPOSITING → TRASFORMAZIONE → NUOVA IMMAGINE.
// Tre frame veri (backstage, plate, generativo) del nuotatore di Gianluca.
//
// Il passaggio fra due frame non è una tendina prima/dopo: il frame nuovo
// affiora da una zona morbida che si allarga dal soggetto, con un filo lime
// sul fronte solo dove il mestiere interviene (cancellazione del rig,
// trasformazione). Gli stati di lavoro stanno rientrati dietro un filo lime,
// come uno shot sotto esame; IDEA e NUOVA IMMAGINE vanno a tutto quadro.
//
// Gesti: trascinare in orizzontale sull'immagine (lo swipe su telefono),
// cliccare sulla timeline, frecce / Home / Fine da tastiera. Se nessuno tocca
// niente, il percorso parte da solo. Con prefers-reduced-motion: niente
// autoplay e niente animazioni, si salta di stato in stato.
(function () {
  "use strict";

  var root = document.querySelector("[data-scrub]");
  if (!root) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var stage = root.querySelector("[data-scrub-stage]");
  var frame = root.querySelector("[data-scrub-frame]");
  var ruleEl = root.querySelector("[data-scrub-rule]");
  var halo = root.querySelector("[data-scrub-halo]");
  var darkEl = root.querySelector("[data-scrub-dark]");
  var ideaEl = root.querySelector("[data-scrub-idea]");
  var marksEl = root.querySelector("[data-scrub-marks]");
  var marks = [].slice.call(root.querySelectorAll(".mark"));
  var rail = root.querySelector("[data-scrub-rail]");
  var fill = root.querySelector("[data-scrub-fill]");
  var ticks = [].slice.call(root.querySelectorAll("[data-scrub-ticks] li"));
  var nowEl = root.querySelector("[data-scrub-now]");
  var caption = root.querySelector("[data-scrub-caption]");
  var grab = root.querySelector("[data-scrub-grab]");
  var layers = {};
  [].slice.call(root.querySelectorAll(".scrub__layer")).forEach(function (l) {
    layers[l.getAttribute("data-key")] = l;
  });

  var LAST = 5;
  // Testi della v1 (agosto), scritti sul master context §4 e §6.3.
  var STATES = [
    { key: "backstage", inset: 0, dark: 0.9, rule: 0, idea: 1, mark: 0, name: "Idea",
      text: "Un uomo vola dentro una piscina vuota. Prima di qualunque strumento esiste solo la frase che descrive l’immagine." },
    { key: "backstage", inset: 0, dark: 0, rule: 0, idea: 0, mark: 0, name: "Produzione",
      text: "Piscina svuotata, carrello su binari, adduzione d’ossigeno. La parte che non si vede è quella che tiene in piedi tutto il resto." },
    { key: "backstage", inset: 0.055, dark: 0, rule: 1, idea: 0, mark: 1, name: "Effetti speciali",
      text: "Il rig è progettato per sparire. Ogni appoggio sta dove la cancellazione sarà possibile: l’effetto si decide sul set, non dopo." },
    { key: "plate", inset: 0.055, dark: 0, rule: 1, idea: 0, mark: 0, name: "Compositing",
      text: "Carrello e binari rimossi, il corpo resta sospeso. L’illusione è compiuta e il mestiere è diventato invisibile." },
    { key: "generative", inset: 0.055, dark: 0, rule: 1, idea: 0, mark: 0, name: "Trasformazione",
      text: "La stessa inquadratura scende sott’acqua. Rovine, colonne, corallo: l’ambiente che l’idea aveva in testa dal principio." },
    { key: "generative", inset: 0, dark: 0, rule: 0, idea: 0, mark: 0, name: "Nuova immagine",
      text: "Nessuno chiede più come è stata fatta. È il punto in cui il lavoro smette di essere una prova e diventa un film." }
  ];
  // quanto lime porta il fronte di ogni passaggio (indice = stato di partenza)
  var LIME = [0, 0, 1, 1, 0];
  // centro della zona che rivela, in coordinate del frame (sul nuotatore)
  var CX = 0.45, CY = 0.4;

  var t = 0, target = 0, shown = -1;
  var engaged = false, idle = 0, holding = 0, visible = false, running = false, last = 0;
  var AUTOPLAY_DELAY = 1.6, AUTOPLAY_SPEED = 0.34, END_HOLD = 3;

  function clamp(x, a, b) { return Math.min(b, Math.max(a, x)); }
  function smooth(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }
  function lerp(a, b, p) { return a + (b - a) * p; }

  // ---- disegno: tutto via proprietà CSS, niente canvas ----
  function render() {
    var s = Math.floor(clamp(t, 0, LAST));
    var n = Math.min(LAST, s + 1);
    var p = smooth(t - s);
    var A = STATES[s], B = STATES[n];
    var inset = lerp(A.inset, B.inset, p);
    var rule = lerp(A.rule, B.rule, p);

    frame.style.clipPath = "inset(" + (inset * 100).toFixed(2) + "% round 0)";
    ruleEl.style.inset = (inset * 100).toFixed(2) + "%";
    ruleEl.style.opacity = rule.toFixed(3);
    darkEl.style.opacity = lerp(A.dark, B.dark, p).toFixed(3);
    ideaEl.style.opacity = lerp(A.idea, B.idea, p).toFixed(3);
    marksEl.style.opacity = lerp(A.mark, B.mark, p).toFixed(3);

    Object.keys(layers).forEach(function (k) {
      var el = layers[k];
      if (k === A.key) {
        el.style.opacity = "1"; el.style.zIndex = "1";
        el.style.webkitMaskImage = el.style.maskImage = "none";
      } else if (k === B.key && A.key !== B.key) {
        // il frame nuovo affiora da una zona morbida che si allarga
        var r = p * 135;
        var m = "radial-gradient(circle at " + CX * 100 + "% " + CY * 100 + "%, #000 " +
          Math.max(0, r - 18).toFixed(1) + "%, transparent " + r.toFixed(1) + "%)";
        el.style.opacity = p > 0.001 ? "1" : "0"; el.style.zIndex = "2";
        el.style.webkitMaskImage = el.style.maskImage = m;
      } else {
        el.style.opacity = "0"; el.style.zIndex = "0";
      }
    });

    var lime = A.key !== B.key ? LIME[s] * Math.sin(Math.PI * p) : 0;
    if (lime > 0.01) {
      var r2 = p * 135;
      halo.style.background = "radial-gradient(circle at " + CX * 100 + "% " + CY * 100 + "%, transparent " +
        Math.max(0, r2 - 1.6).toFixed(1) + "%, rgba(229,253,93,.38) " + Math.max(0, r2 - 0.5).toFixed(1) +
        "%, transparent " + (r2 + 0.3).toFixed(1) + "%)";
      halo.style.opacity = lime.toFixed(3);
    } else {
      halo.style.opacity = "0";
    }

    fill.style.transform = "scaleX(" + (t / LAST).toFixed(4) + ")";
    announce();
  }

  function announce() {
    var s = Math.round(target);
    if (s === shown) return;
    shown = s;
    caption.textContent = STATES[s].text;
    nowEl.textContent = "0" + (s + 1) + " · " + STATES[s].name;
    rail.setAttribute("aria-valuenow", String(s));
    rail.setAttribute("aria-valuetext", STATES[s].name);
    ticks.forEach(function (li, i) { li.toggleAttribute("data-on", i <= s); });
  }

  // le etichette del rig puntano al carrello e al tubo anche quando il
  // frame è ritagliato (object-fit: cover): coordinate ricalcolate sul taglio
  function placeMarks() {
    var w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;
    var ar = 1200 / 675, sw, sh;
    if (w / h > ar) { sw = w; sh = w / ar; } else { sh = h; sw = h * ar; }
    var ox = (w - sw) / 2, oy = (h - sh) / 2;
    marks.forEach(function (m) {
      m.style.left = (ox + parseFloat(m.getAttribute("data-mx")) * sw) + "px";
      m.style.top = (oy + parseFloat(m.getAttribute("data-my")) * sh) + "px";
    });
  }

  // ---- valore ----
  function setTarget(v, now) {
    target = clamp(v, 0, LAST);
    if (now || reduce) { t = target; render(); }
    else wake();
  }
  function engage() {
    idle = 0;
    if (!engaged) { engaged = true; grab.classList.add("is-gone"); }
  }

  // ---- ciclo: gira solo quando serve ----
  function wake() { if (!running && visible) { running = true; last = performance.now(); requestAnimationFrame(tick); } }
  function tick(now) {
    var dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!engaged && !reduce) {
      idle += dt;
      if (idle > AUTOPLAY_DELAY) {
        if (target >= LAST) {
          holding += dt;
          if (holding > END_HOLD) { holding = 0; target = 0; t = 0; idle = 0; }
        } else {
          target = Math.min(LAST, target + AUTOPLAY_SPEED * dt);
        }
      }
    }
    var k = engaged ? 0.22 : 1;
    t += (target - t) * k;
    if (Math.abs(target - t) < 0.0005) t = target;
    render();
    var busy = Math.abs(target - t) > 0 || (!engaged && !reduce);
    if (busy && visible) requestAnimationFrame(tick);
    else running = false;
  }

  // ---- input ----
  var dragging = false, fromX = 0, fromV = 0, fromY = 0, decided = false;
  stage.addEventListener("pointerdown", function (e) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragging = true; decided = e.pointerType === "mouse";
    fromX = e.clientX; fromY = e.clientY; fromV = target;
    if (decided) { engage(); stage.setPointerCapture(e.pointerId); stage.setAttribute("data-dragging", ""); }
  });
  stage.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    var dx = e.clientX - fromX, dy = e.clientY - fromY;
    if (!decided) {
      // su touch: decide il gesto. Orizzontale = scrub; verticale = scroll della pagina
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      if (Math.abs(dy) > Math.abs(dx)) { dragging = false; return; }
      decided = true; engage(); stage.setPointerCapture(e.pointerId); stage.setAttribute("data-dragging", "");
    }
    setTarget(fromV + (dx / (stage.clientWidth || 1)) * LAST);
  });
  function end(e) {
    if (!dragging) return;
    dragging = false; stage.removeAttribute("data-dragging");
    if (e.pointerId != null && stage.hasPointerCapture(e.pointerId)) stage.releasePointerCapture(e.pointerId);
    setTarget(Math.round(target)); // si posa sullo stato più vicino
  }
  stage.addEventListener("pointerup", end);
  stage.addEventListener("pointercancel", end);

  function railValue(e) {
    var r = rail.getBoundingClientRect();
    return ((e.clientX - r.left) / (r.width || 1)) * LAST;
  }
  var railDrag = false;
  rail.addEventListener("pointerdown", function (e) {
    railDrag = true; engage(); rail.setPointerCapture(e.pointerId);
    setTarget(Math.round(railValue(e)));
  });
  rail.addEventListener("pointermove", function (e) { if (railDrag) setTarget(railValue(e)); });
  rail.addEventListener("pointerup", function () { railDrag = false; setTarget(Math.round(target)); });
  rail.addEventListener("pointercancel", function () { railDrag = false; setTarget(Math.round(target)); });

  rail.addEventListener("keydown", function (e) {
    var s = Math.round(target), to = null;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") to = s + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") to = s - 1;
    else if (e.key === "Home") to = 0;
    else if (e.key === "End") to = LAST;
    if (to === null) return;
    e.preventDefault(); engage(); setTarget(to);
  });

  // ---- visibilità: niente lavoro fuori schermo ----
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) {
      visible = en[0].isIntersecting;
      if (visible) wake();
    }, { threshold: 0.35 }).observe(stage);
  } else { visible = true; wake(); }

  window.addEventListener("resize", placeMarks);
  placeMarks();
  render();
})();
