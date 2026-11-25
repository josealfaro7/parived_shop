(() => {
  const LINEAS = [
    { id: "clasico", nombre: "Clásico" },
    { id: "gshock", nombre: "G-Shock" }
  ];

  const MODELOS = [
    { id: "azul-hielo", linea: "clasico", href: "index.html", nombre: "Azul hielo", color: "#a9d4ec", frames: "frames" },
    { id: "azul", linea: "clasico", href: "azul.html", nombre: "Azul", color: "#3f63b8", frames: "frames-azul" },
    { id: "verde", linea: "clasico", href: "verde.html", nombre: "Verde", color: "#2f6e47", frames: "frames-verde" },
    { id: "azul-noche", linea: "clasico", href: "azul-noche.html", nombre: "Azul noche", color: "linear-gradient(135deg,#1c2858 56%,#c9a04f 56%)", frames: "frames-noche" },
    { id: "gshock-lima", linea: "gshock", href: "gshock-lima.html", nombre: "Verde lima", color: "#b5d64a", frames: "frames-gshock-lima" }
  ];

  const KEY = "ommit-dir";
  const root = document.documentElement;
  const actual = Math.max(0, MODELOS.findIndex(m => m.id === root.dataset.modelo));
  const yo = MODELOS[actual];
  const crossDoc = "onpagereveal" in window;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const vecino = d => MODELOS[(actual + (d === "next" ? 1 : -1) + MODELOS.length) % MODELOS.length];
  const nombreLinea = id => (LINEAS.find(l => l.id === id) || {}).nombre || "";
  const etiqueta = m => m.linea === yo.linea ? m.nombre : `${nombreLinea(m.linea)} ${m.nombre.toLowerCase()}`;
  const dirHacia = m => MODELOS.indexOf(m) > actual ? "next" : "prev";

  addEventListener("pageswap", e => {
    const d = sessionStorage.getItem(KEY);
    if (e.viewTransition && d) e.viewTransition.types.add(d);
  });

  addEventListener("pagereveal", e => {
    const d = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    if (!d) return;
    if (e.viewTransition) e.viewTransition.types.add(d);
    else root.classList.add("llega");
  });

  if (!crossDoc && sessionStorage.getItem(KEY)) {
    sessionStorage.removeItem(KEY);
    root.classList.add("llega");
  }

  let yendo = false;

  function ir(d, destino) {
    const m = destino || vecino(d);
    if (yendo || m === yo) return;
    yendo = true;
    sessionStorage.setItem(KEY, d);
    if (crossDoc || reduce) { location.href = m.href; return; }
    root.classList.add("sale");
    setTimeout(() => { location.href = m.href; }, 220);
  }

  addEventListener("pageshow", e => {
    if (!e.persisted) return;
    yendo = false;
    root.classList.remove("sale", "llega");
    soltar();
  });

  const flechas = {};

  function tirar(dx, umbral) {
    const d = dx < 0 ? "next" : "prev";
    const f = Math.min(1, Math.abs(dx) / umbral);
    for (const k in flechas) {
      const el = flechas[k];
      if (k === d) {
        el.classList.add("tirando");
        el.classList.toggle("listo", f >= 1);
        el.style.setProperty("--tiro", f);
      } else {
        el.classList.remove("tirando", "listo");
        el.style.setProperty("--tiro", 0);
      }
    }
  }

  function soltar() {
    for (const k in flechas) {
      flechas[k].classList.remove("tirando", "listo");
      flechas[k].style.setProperty("--tiro", 0);
    }
  }

  function swatch(m) {
    const a = document.createElement("a");
    a.className = "swatch";
    a.href = m.href;
    a.title = m.nombre;
    a.setAttribute("aria-label", `${nombreLinea(m.linea)} ${m.nombre}`);
    a.style.setProperty("--c", m.color);
    if (m === yo) a.setAttribute("aria-current", "page");
    a.addEventListener("click", e => {
      e.preventDefault();
      if (m !== yo) ir(dirHacia(m), m);
    });
    return a;
  }

  function colores() {
    const box = document.createElement("div");
    box.className = "colores";
    box.setAttribute("role", "group");
    box.setAttribute("aria-label", `Colores de ${nombreLinea(yo.linea)}`);
    MODELOS.filter(m => m.linea === yo.linea).forEach(m => box.append(swatch(m)));
    return box;
  }

  function construir() {
    const slot = document.getElementById("modelos");
    if (slot) {
      slot.removeAttribute("role");
      slot.removeAttribute("aria-label");
      const lineas = document.createElement("nav");
      lineas.className = "lineas";
      lineas.setAttribute("aria-label", "Líneas de relojes");
      for (const l of LINEAS) {
        const destino = l.id === yo.linea ? yo : MODELOS.find(m => m.linea === l.id);
        if (!destino) continue;
        const a = document.createElement("a");
        a.href = destino.href;
        a.textContent = l.nombre;
        if (l.id === yo.linea) a.setAttribute("aria-current", "page");
        a.addEventListener("click", e => {
          e.preventDefault();
          if (destino !== yo) ir(dirHacia(destino), destino);
        });
        lineas.append(a);
      }
      slot.append(lineas, colores());
    }

    const precio = document.querySelector(".info .price");
    if (precio) {
      const picker = document.createElement("div");
      picker.className = "color-picker";
      const p = document.createElement("p");
      p.innerHTML = `Color: <b></b>`;
      p.querySelector("b").textContent = yo.nombre;
      picker.append(p, colores());
      precio.after(picker);
    }

    if (MODELOS.length < 2) return;

    for (const d of ["prev", "next"]) {
      const m = vecino(d);
      const b = document.createElement("button");
      b.type = "button";
      b.className = `flecha ${d}`;
      b.setAttribute("aria-label", `Ver ${nombreLinea(m.linea)} ${m.nombre}`);
      b.style.setProperty("--c", m.color);
      b.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d === "next" ? "M9 6l6 6-6 6" : "M15 6l-6 6 6 6"}"/></svg><span class="nombre" aria-hidden="true"></span><span class="punto" aria-hidden="true"></span>`;
      b.querySelector(".nombre").textContent = etiqueta(m);
      b.addEventListener("click", () => ir(d));
      document.body.append(b);
      flechas[d] = b;
    }

    const despiece = document.getElementById("despiece");
    const visibilidad = () => {
      const ver = !despiece || despiece.getBoundingClientRect().bottom > innerHeight * 0.6;
      root.classList.toggle("ver-flechas", ver);
    };
    addEventListener("scroll", visibilidad, { passive: true });
    addEventListener("resize", visibilidad);
    visibilidad();

    let t0 = null;
    const umbralTouch = () => Math.min(110, innerWidth * 0.25);

    addEventListener("touchstart", e => {
      if (e.touches.length !== 1 || yendo) { t0 = null; return; }
      const p = e.touches[0];
      t0 = { x: p.clientX, y: p.clientY, t: performance.now(), modo: null, dx: 0 };
    }, { passive: true });

    addEventListener("touchmove", e => {
      if (!t0 || e.touches.length !== 1) return;
      const p = e.touches[0];
      const dx = p.clientX - t0.x, dy = p.clientY - t0.y;
      if (!t0.modo) {
        if (Math.hypot(dx, dy) < 10) return;
        t0.modo = Math.abs(dx) > Math.abs(dy) * 1.3 ? "h" : "v";
      }
      if (t0.modo !== "h") return;
      t0.dx = dx;
      tirar(dx, umbralTouch());
    }, { passive: true });

    addEventListener("touchend", () => {
      if (!t0 || t0.modo !== "h") { t0 = null; return; }
      const dx = t0.dx, v = Math.abs(dx) / (performance.now() - t0.t);
      t0 = null;
      if (Math.abs(dx) > umbralTouch() || (Math.abs(dx) > 40 && v > 0.5)) ir(dx < 0 ? "next" : "prev");
      else soltar();
    });

    addEventListener("touchcancel", () => { t0 = null; soltar(); });

    let acc = 0, ultimo = 0, bloqueo = 0, tw = null;
    addEventListener("wheel", e => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) * 1.5) return;
      const now = performance.now();
      if (now < bloqueo || yendo) return;
      if (now - ultimo > 250) acc = 0;
      ultimo = now;
      acc += e.deltaX;
      tirar(-acc, 140);
      clearTimeout(tw);
      if (Math.abs(acc) > 140) {
        bloqueo = now + 1500;
        ir(acc > 0 ? "next" : "prev");
      } else {
        tw = setTimeout(soltar, 300);
      }
    }, { passive: true });

    addEventListener("keydown", e => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (e.target.closest("input,textarea,select,[contenteditable]")) return;
      if (e.key === "ArrowRight") ir("next");
      else if (e.key === "ArrowLeft") ir("prev");
    });

    addEventListener("load", () => {
      setTimeout(() => {
        const movil = matchMedia("(max-width: 860px)").matches;
        const vistos = new Set();
        for (const d of ["next", "prev"]) {
          const m = vecino(d);
          if (vistos.has(m.id)) continue;
          vistos.add(m.id);
          for (const href of [m.href, `${m.frames}${movil ? "-m" : ""}/001.webp`]) {
            const l = document.createElement("link");
            l.rel = "prefetch";
            l.href = href;
            document.head.append(l);
          }
        }
      }, 2000);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", construir);
  else construir();
})();
