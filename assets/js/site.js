// HEY — comportamento condiviso del sito (nav attiva, form contatti, gate area privata).
// Nessuna dipendenza esterna, nessun modulo ES: gira anche da file://.
(function () {
  "use strict";

  function markActiveNav() {
    // Confronto su a.pathname (risolto dal browser, assoluto) e non sulla
    // stringa href grezza: gli href sono relativi (necessario per funzionare
    // sia in locale sia su GitHub Pages, che pubblica sotto un sottopercorso
    // tipo /Hey/, non alla radice del dominio — vedi index.html).
    var path = window.location.pathname.replace(/\/index\.html$/, "/");
    document.querySelectorAll(".sitenav__links a[href]").forEach(function (a) {
      var linkPath = a.pathname.replace(/\/index\.html$/, "/");
      if (linkPath === path) {
        a.setAttribute("aria-current", "page");
      }
    });
  }

  // ---------------------------------------------------------------------
  // Form a scelta multipla, riusata da CONTACT (Master Context §5.1) e da
  // NETWORK — stessa meccanica (step a scelte + step libero finale), niente
  // duplicata due volte. La logica di instradamento dei lead non è ancora
  // decisa: qui si raccoglie e si prepara un riepilogo, senza inventare un
  // endpoint. Vedi nota nel markup di ciascuna pagina.
  // ---------------------------------------------------------------------
  function initMultistepForm(form) {
    var steps = Array.prototype.slice.call(form.querySelectorAll(".formstep"));
    if (!steps.length) return;
    var rail = form.querySelectorAll(".steprail span");
    var backBtn = form.querySelector('[data-action="back"]');
    var nextBtn = form.querySelector('[data-action="next"]');
    var submitBtn = form.querySelector('[data-action="submit"]');
    var current = 0;
    var answers = {};

    function stepIsSatisfied(i) {
      var choices = steps[i].querySelectorAll(".choice");
      if (!choices.length) return true; // step libero: mai obbligatorio
      return steps[i].querySelector(".choice.sel") !== null;
    }

    function paint() {
      steps.forEach(function (s, i) {
        s.classList.toggle("is-active", i === current);
      });
      rail.forEach(function (r, i) {
        r.classList.toggle("done", i < current);
        r.classList.toggle("now", i === current);
      });
      if (backBtn) backBtn.style.visibility = current === 0 ? "hidden" : "visible";
      var isLast = current === steps.length - 1;
      if (nextBtn) nextBtn.hidden = isLast;
      if (submitBtn) submitBtn.hidden = !isLast;
      if (nextBtn) nextBtn.disabled = !stepIsSatisfied(current);
    }

    form.querySelectorAll(".choice").forEach(function (choice) {
      choice.addEventListener("click", function () {
        var group = choice.closest(".formstep");
        group.querySelectorAll(".choice").forEach(function (c) {
          c.classList.remove("sel");
          c.querySelector("input").checked = false;
        });
        choice.classList.add("sel");
        choice.querySelector("input").checked = true;
        var key = group.getAttribute("data-key");
        if (key) answers[key] = choice.querySelector(".choice__label").textContent.trim();
        paint();
      });
    });

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        if (current < steps.length - 1 && stepIsSatisfied(current)) {
          current += 1;
          paint();
          steps[current].scrollIntoView({ block: "start", behavior: "smooth" });
        }
      });
    }
    if (backBtn) {
      backBtn.addEventListener("click", function () {
        if (current > 0) {
          current -= 1;
          paint();
        }
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      form.querySelectorAll("textarea[data-key], input[data-key]").forEach(function (field) {
        answers[field.getAttribute("data-key")] = field.value.trim();
      });

      // Nessun endpoint di invio deciso (nessun indirizzo/collector nel Master
      // Context) — nessun invio finto. Appena esiste un endpoint, sostituire
      // questo blocco con un fetch() reale; il resto del form resta invariato.
      var SEND_ENDPOINT = "";
      var doneBox = form.parentElement.querySelector(".formdone");
      form.style.display = "none";
      if (doneBox) {
        var summary = doneBox.querySelector("[data-summary]");
        if (summary) {
          summary.textContent = steps
            .map(function (s) {
              var key = s.getAttribute("data-key");
              return key ? answers[key] : null;
            })
            .filter(Boolean)
            .join(" — ");
        }
        var note = doneBox.querySelector("[data-note]");
        if (note) {
          note.textContent = SEND_ENDPOINT
            ? "Ricevuto. Ti rispondiamo il prima possibile."
            : form.getAttribute("data-pending-note") ||
              "Il modulo non è ancora collegato a un sistema di invio automatico.";
        }
        doneBox.classList.add("is-active");
      }
    });

    paint();
  }

  // ---------------------------------------------------------------------
  // AREA PRIVATA — placeholder onesto. Nessuna autenticazione reale qui:
  // il Master Context (§5.2) prevede di ereditare l'infrastruttura (gate a
  // password + Postgres) dell'app "Building the Vision" esistente, non di
  // costruirne una nuova non funzionante che finga di essere sicura.
  // ---------------------------------------------------------------------
  function initGate() {
    var form = document.getElementById("gate-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = form.parentElement.querySelector(".gate__note");
      if (note) {
        note.textContent =
          "Integrazione con l'app Building the Vision in corso — l'accesso reale non è ancora collegato qui.";
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    markActiveNav();
    document.querySelectorAll("form.multistep").forEach(initMultistepForm);
    initGate();
  });
})();
