(() => {
  const CONTENT = (window.SITE_CONTENT && window.SITE_CONTENT.cards) || {};
  const SUPPORTS_VT = typeof document.startViewTransition === "function";
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  let expandedCard = null;

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[c]);

  const buildCardHTML = (id, data, eyebrowText) => {
    const detailId = `${id}-detail`;
    const word = esc(data.word);
    const teaser = esc(data.teaser);
    const heading = esc(eyebrowText);
    const bodyHTML = data.bodyHTML || "";
    return `
      <li>
        <article class="card" id="${id}" style="view-transition-name: card-${id}">
          <div class="card__inner">
            <div class="card__face card__face--front">
              <span class="card__word">${word}</span>
              <span class="card__teaser card__teaser--mobile">${teaser}</span>
            </div>
            <div class="card__face card__face--back">
              <span class="card__teaser">${teaser}</span>
              <span class="card__cta">Open →</span>
            </div>
          </div>
          <button class="card__toggle" type="button" aria-expanded="false" aria-controls="${detailId}">
            <span class="visually-hidden">Open ${word}</span>
          </button>
          <div class="card__detail" id="${detailId}">
            <div class="card__detail-inner">
              <h3 class="card__detail-title" tabindex="-1">${heading}</h3>
              <div class="card__detail-body">${bodyHTML}</div>
              <button class="card__close" type="button">Close</button>
            </div>
          </div>
        </article>
      </li>
    `;
  };

  const renderAll = () => {
    document.querySelectorAll("ul.cards[data-card-ids]").forEach((ul) => {
      const sectionLabel = ul.dataset.sectionLabel || "";
      const ids = ul.dataset.cardIds.split(",").map((s) => s.trim()).filter(Boolean);
      for (const id of ids) {
        const data = CONTENT[id];
        if (!data) continue;
        const heading = [sectionLabel, data.word].filter(Boolean).join(" · ");
        ul.insertAdjacentHTML("beforeend", buildCardHTML(id, data, heading));
      }
    });
  };

  const run = (fn) => {
    if (SUPPORTS_VT && !prefersReduced.matches) {
      try {
        const t = document.startViewTransition(fn);
        t.ready.catch(() => {});
      } catch {
        fn();
      }
    } else {
      fn();
    }
  };

  const setState = (card, isExpanded) => {
    card.dataset.expanded = isExpanded ? "true" : "false";
    const btn = card.querySelector(".card__toggle");
    if (btn) btn.setAttribute("aria-expanded", String(isExpanded));
  };

  const expand = (card, { focus = true } = {}) => {
    run(() => {
      if (expandedCard && expandedCard !== card) {
        setState(expandedCard, false);
      }
      setState(card, true);
      expandedCard = card;
      if (focus) {
        const h = card.querySelector(".card__detail-title");
        if (h) h.focus({ preventScroll: true });
      }
    });
  };

  const collapse = (card, { focusToggle = false } = {}) => {
    run(() => {
      setState(card, false);
      if (expandedCard === card) expandedCard = null;
      if (focusToggle) {
        const btn = card.querySelector(".card__toggle");
        if (btn) btn.focus();
      }
    });
  };

  const bind = () => {
    document.querySelectorAll(".card").forEach((card) => {
      const toggle = card.querySelector(".card__toggle");
      if (toggle) {
        toggle.addEventListener("click", (e) => {
          e.preventDefault();
          if (card.dataset.expanded === "true") {
            collapse(card, { focusToggle: true });
          } else {
            expand(card);
          }
        });
      }
      const close = card.querySelector(".card__close");
      if (close) {
        close.addEventListener("click", (e) => {
          e.preventDefault();
          collapse(card, { focusToggle: true });
        });
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && expandedCard) {
        collapse(expandedCard, { focusToggle: true });
      }
    });
  };

  renderAll();
  bind();
})();
