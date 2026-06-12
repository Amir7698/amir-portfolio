(() => {
  let chip = null;
  let popup = null;
  let chipTimer = null;
  let pendingResult = null;

  function removeAll() {
    chip && chip.remove(); chip = null;
    popup && popup.remove(); popup = null;
    clearTimeout(chipTimer);
    pendingResult = null;
  }

  // ── Icon chip ─────────────────────────────────────────────────────────────
  function showChip(x, y, word) {
    removeAll();

    chip = document.createElement("div");
    chip.id = "abadis-chip";
    chip.title = `جستجوی "${word}" در آبادیس`;
    chip.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="#1a6bbd"/>
        <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle"
              font-family="Tahoma,Arial" font-size="22" fill="#fff" font-weight="bold">آ</text>
      </svg>
    `;

    document.body.appendChild(chip);

    // position near cursor
    const cx = Math.min(x + 14, window.scrollX + window.innerWidth - 48);
    const cy = Math.max(y - 36, window.scrollY + 8);
    chip.style.left = cx + "px";
    chip.style.top  = cy + "px";

    // animate in
    requestAnimationFrame(() => chip && chip.classList.add("abadis-chip-visible"));

    chip.addEventListener("click", e => {
      e.stopPropagation();
      openPopup(x, y, word);
    });

    // auto-hide chip after 5s
    chipTimer = setTimeout(() => { chip && chip.remove(); chip = null; }, 5000);
  }

  // ── Full popup ────────────────────────────────────────────────────────────
  function openPopup(x, y, word) {
    chip && chip.remove(); chip = null;
    clearTimeout(chipTimer);

    if (pendingResult) {
      renderPopup(x, y, word, pendingResult.results, pendingResult.url);
    } else {
      renderLoading(x, y, word);
    }
  }

  function renderLoading(x, y, word) {
    popup && popup.remove();
    popup = buildShell(word);
    const body = popup.querySelector(".abadis-body");
    body.innerHTML = `<div class="abadis-spinner-wrap"><div class="abadis-spinner"></div><span>در حال جستجو…</span></div>`;
    place(popup, x, y);
    document.body.appendChild(popup);

    // if result comes in later, swap
    const check = setInterval(() => {
      if (pendingResult) {
        clearInterval(check);
        renderPopup(x, y, word, pendingResult.results, pendingResult.url);
      }
    }, 100);
    setTimeout(() => clearInterval(check), 8000);
  }

  function renderPopup(x, y, word, results, url) {
    popup && popup.remove();
    popup = buildShell(word, url);
    const body = popup.querySelector(".abadis-body");

    if (results && results.length > 0) {
      results.forEach((r, i) => {
        const card = document.createElement("div");
        card.className = "abadis-card";

        const top = document.createElement("div");
        top.className = "abadis-card-top";

        if (r.author) {
          const auth = document.createElement("span");
          auth.className = "abadis-author";
          auth.textContent = r.author;
          top.appendChild(auth);
        }

        const idx = document.createElement("span");
        idx.className = "abadis-idx";
        idx.textContent = i + 1;
        top.appendChild(idx);

        const def = document.createElement("div");
        def.className = "abadis-def";
        def.textContent = r.definition;

        const bot = document.createElement("div");
        bot.className = "abadis-card-bot";

        if (r.likes || r.dislikes) {
          const votes = document.createElement("div");
          votes.className = "abadis-votes";
          votes.innerHTML = `
            <span class="abadis-like">👍 ${r.likes || 0}</span>
            <span class="abadis-sep">|</span>
            <span class="abadis-dislike">👎 ${r.dislikes || 0}</span>
          `;
          bot.appendChild(votes);
        }

        card.appendChild(top);
        card.appendChild(def);
        if (bot.children.length) card.appendChild(bot);
        body.appendChild(card);
      });
    } else {
      body.innerHTML = `<div class="abadis-empty">پیشنهادی یافت نشد</div>`;
    }

    place(popup, x, y);
    document.body.appendChild(popup);
  }

  function buildShell(word, url) {
    const p = document.createElement("div");
    p.id = "abadis-popup";
    p.dir = "rtl";

    p.innerHTML = `
      <div class="abadis-header">
        <div class="abadis-header-left">
          <svg class="abadis-logo-svg" width="22" height="22" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="20" fill="#1a6bbd"/>
            <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle"
                  font-family="Tahoma,Arial" font-size="22" fill="#fff" font-weight="bold">آ</text>
          </svg>
          <span class="abadis-brand">آبادیس</span>
        </div>
        <span class="abadis-word-title">${word}</span>
        <button class="abadis-close">✕</button>
      </div>
      <div class="abadis-section-label">پیشنهاد کاربران</div>
      <div class="abadis-body"></div>
      ${url ? `<div class="abadis-footer"><a href="${url}" target="_blank">مشاهده کامل در آبادیس ↗</a></div>` : ""}
    `;

    p.querySelector(".abadis-close").addEventListener("click", removeAll);
    makeDraggable(p, p.querySelector(".abadis-header"));
    return p;
  }

  function makeDraggable(el, handle) {
    let startX, startY, startLeft, startTop, dragging = false;

    handle.style.cursor = "grab";

    handle.addEventListener("mousedown", e => {
      if (e.target.closest(".abadis-close")) return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = parseInt(el.style.left) || 0;
      startTop  = parseInt(el.style.top)  || 0;
      handle.style.cursor = "grabbing";
      e.preventDefault();
    });

    document.addEventListener("mousemove", e => {
      if (!dragging) return;
      el.style.left = (startLeft + e.clientX - startX) + "px";
      el.style.top  = (startTop  + e.clientY - startY) + "px";
    });

    document.addEventListener("mouseup", () => {
      if (!dragging) return;
      dragging = false;
      handle.style.cursor = "grab";
    });
  }

  function place(el, x, y) {
    document.body.appendChild(el);
    const pw = 320;
    const ph = el.offsetHeight || 280;
    const vw = window.scrollX + window.innerWidth;
    const vh = window.scrollY + window.innerHeight;
    let left = x + 16;
    let top  = y + 16;
    if (left + pw > vw - 12) left = x - pw - 12;
    if (top + ph > vh - 12) top = y - ph - 12;
    el.style.left = Math.max(window.scrollX + 8, left) + "px";
    el.style.top  = Math.max(window.scrollY + 8, top)  + "px";
    el.remove(); // will be re-appended by caller
  }

  // ── Double-click handler ──────────────────────────────────────────────────
  document.addEventListener("dblclick", e => {
    if (e.target.closest("#abadis-chip") || e.target.closest("#abadis-popup")) return;

    const sel = window.getSelection();
    const word = sel ? sel.toString().trim() : "";
    if (!word || word.includes("\n") || word.length > 80) return;

    const x = e.pageX;
    const y = e.pageY;

    pendingResult = null;
    showChip(x, y, word);

    browser.runtime.sendMessage({ type: "fetch-abadis", word })
      .then(resp => { if (resp) pendingResult = resp; })
      .catch(() => { pendingResult = { results: [], url: `https://abadis.ir/entofa/${encodeURIComponent(word)}/` }; });
  });

  document.addEventListener("keydown", e => { if (e.key === "Escape") removeAll(); });
  document.addEventListener("mousedown", e => {
    if (chip  && !chip.contains(e.target))  { chip.remove();  chip  = null; }
    if (popup && !popup.contains(e.target)) { popup.remove(); popup = null; }
  });
})();
