(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // ── safe storage ──────────────────────────────────────────
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  };

  // ── theme ─────────────────────────────────────────────────
  const root = document.documentElement;
  $("#theme").addEventListener("click", () => {
    const current = root.getAttribute("data-theme") ||
      (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    const next = current === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    store.set("dh-theme", next);
  });

  // ── progress ──────────────────────────────────────────────
  const steps = $$(".step");
  const core = steps.filter((s) => !s.hasAttribute("data-optional"));
  let done = {};
  try { done = JSON.parse(store.get("dh-done") || "{}"); } catch (e) { done = {}; }

  function paintProgress() {
    const n = core.filter((s) => done[s.dataset.id]).length;
    $("#pLabel").textContent = `${n} / ${core.length} core done`;
    $("#pBar").style.width = `${(n / core.length) * 100}%`;
  }
  steps.forEach((s) => {
    const box = $("input[type=checkbox]", s);
    if (!box) return;
    const id = s.dataset.id;
    box.checked = !!done[id];
    s.classList.toggle("done", box.checked);
    box.addEventListener("change", () => {
      done[id] = box.checked;
      s.classList.toggle("done", box.checked);
      store.set("dh-done", JSON.stringify(done));
      paintProgress();
    });
  });
  $("#reset").addEventListener("click", () => {
    done = {};
    store.set("dh-done", "{}");
    steps.forEach((s) => {
      const box = $("input[type=checkbox]", s);
      if (box) box.checked = false;
      s.classList.remove("done");
    });
    paintProgress();
  });
  paintProgress();

  // ── filters ───────────────────────────────────────────────
  let typeFilter = "all";
  let coreOnly = false;
  function applyFilters() {
    steps.forEach((s) => {
      const okType = typeFilter === "all" || s.dataset.type === typeFilter ||
        // the IMOQ card contains both games and OVA episodes
        (typeFilter === "film" && s.dataset.id === "imoq");
      const okCore = !coreOnly || !s.hasAttribute("data-optional");
      s.classList.toggle("is-hidden", !(okType && okCore));
    });
    $$("[data-era]").forEach((era) => {
      const any = $$(".step", era).some((s) => !s.classList.contains("is-hidden"));
      era.classList.toggle("is-hidden", !any);
    });
  }
  $$("#filters [data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      typeFilter = btn.dataset.filter;
      $$("#filters [data-filter]").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      applyFilters();
    });
  });
  $("#coreOnly").addEventListener("click", (e) => {
    coreOnly = !coreOnly;
    e.currentTarget.setAttribute("aria-pressed", String(coreOnly));
    applyFilters();
  });

  // ── reveal on scroll ──────────────────────────────────────
  const items = $$(".reveal");
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add("in"));
  }
})();
