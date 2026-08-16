/* Navigation, section tracking, form. */
(function () {
  'use strict';

  var HEY = window.HEY;

  /* Not wired to a service yet — no address was settled for v1. Put the
     collector URL here and the form posts to it instead of refusing. */
  var CONTACT_ENDPOINT = '';

  /* ── Nav ────────────────────────────────────────────── */

  var nav = document.querySelector('[data-nav]');
  var toggle = document.querySelector('[data-nav-toggle]');
  var panel = document.getElementById('nav-list');
  var links = [].slice.call(panel.querySelectorAll('a'));

  function setStuck() {
    if (HEY.view.scroll > 40) nav.setAttribute('data-stuck', '');
    else nav.removeAttribute('data-stuck');
  }

  function closeMenu() {
    panel.removeAttribute('data-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', function () {
    var open = panel.hasAttribute('data-open');
    if (open) closeMenu();
    else {
      panel.setAttribute('data-open', '');
      toggle.setAttribute('aria-expanded', 'true');
    }
  });

  links.forEach(function (a) { a.addEventListener('click', closeMenu); });

  addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!panel.hasAttribute('data-open')) return;
    closeMenu();
    toggle.focus();
  });

  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  function markCurrent() {
    var best = -1, bestTop = -Infinity;
    var line = HEY.view.h * 0.35;
    for (var i = 0; i < sections.length; i++) {
      var top = sections[i].getBoundingClientRect().top;
      if (top <= line && top > bestTop) { bestTop = top; best = i; }
    }
    links.forEach(function (a, i) {
      if (i === best) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  var pending = false;
  function onScroll() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(function () {
      pending = false;
      setStuck();
      markCurrent();
    });
  }
  addEventListener('scroll', onScroll, { passive: true });
  HEY.onResize(onScroll);
  onScroll();

  /* ── Form ───────────────────────────────────────────── */

  var form = document.querySelector('[data-form]');
  if (form) {
    var status = form.querySelector('[data-form-status]');

    function fieldOf(input) { return input.closest('.field'); }

    function showError(input, msg) {
      var f = fieldOf(input);
      var err = form.querySelector('[data-err-for="' + input.id + '"]');
      if (msg) {
        f.setAttribute('data-invalid', '');
        input.setAttribute('aria-invalid', 'true');
        err.textContent = msg;
        err.hidden = false;
      } else {
        f.removeAttribute('data-invalid');
        input.removeAttribute('aria-invalid');
        err.hidden = true;
      }
      return !msg;
    }

    function validate(input) {
      var v = input.value.trim();
      if (!v) return showError(input, 'Campo obbligatorio');
      if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
        return showError(input, 'Indirizzo non valido');
      }
      return showError(input, '');
    }

    var inputs = [].slice.call(form.querySelectorAll('input, textarea'));
    inputs.forEach(function (input) {
      input.addEventListener('blur', function () {
        if (input.value.trim()) validate(input);
      });
      input.addEventListener('input', function () {
        if (fieldOf(input).hasAttribute('data-invalid')) validate(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true, first = null;
      inputs.forEach(function (input) {
        if (!validate(input)) { ok = false; if (!first) first = input; }
      });
      if (!ok) {
        status.textContent = 'Controlla i campi segnalati.';
        first.focus();
        return;
      }

      if (!CONTACT_ENDPOINT) {
        status.textContent =
          'Il recapito non è ancora collegato. Il messaggio non è stato inviato: ' +
          'scrivilo pure altrove finché non attiviamo la casella.';
        return;
      }

      status.textContent = 'Invio in corso…';
      fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.value.trim(),
          email: form.email.value.trim(),
          project: form.project.value.trim()
        })
      }).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        form.reset();
        status.textContent = 'Ricevuto. Rispondiamo presto.';
      }).catch(function () {
        status.textContent = 'Invio non riuscito. Riprova fra poco.';
      });
    });
  }

  var year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
