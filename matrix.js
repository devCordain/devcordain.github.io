(() => {
  const canvas = document.getElementById("matrix");
  const toggle = document.getElementById("motionToggle");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: false });
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  const GLYPHS =
    "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンｱｲｳｴｵｶｷｸｹｺｻ0123456789ABCDEF<>/\\[]{}*+=".split("");

  const FONT_SIZE = 16;
  const SPEED_MS = 55;

  let width = 0;
  let height = 0;
  let columns = 0;
  let drops = [];
  let running = true;
  let lastFrame = 0;
  let rafId = 0;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = `${FONT_SIZE}px ui-monospace, Menlo, Consolas, monospace`;
    ctx.textBaseline = "top";

    columns = Math.ceil(width / FONT_SIZE);
    drops = Array.from({ length: columns }, () => ({
      y: Math.random() * -height,
      speed: 0.5 + Math.random() * 1.2,
    }));

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);
  };

  const draw = (timestamp) => {
    rafId = requestAnimationFrame(draw);
    if (!running) return;
    if (timestamp - lastFrame < SPEED_MS) return;
    lastFrame = timestamp;

    ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < columns; i++) {
      const drop = drops[i];
      const x = i * FONT_SIZE;
      const glyph = GLYPHS[(Math.random() * GLYPHS.length) | 0];

      ctx.fillStyle = "#b6ffcf";
      ctx.fillText(glyph, x, drop.y);

      ctx.fillStyle = "#00ff66";
      ctx.fillText(glyph, x, drop.y - FONT_SIZE);

      drop.y += FONT_SIZE * drop.speed;

      if (drop.y > height && Math.random() > 0.975) {
        drop.y = Math.random() * -200;
        drop.speed = 0.5 + Math.random() * 1.2;
      }
    }
  };

  const drawStatic = () => {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#00883a";
    for (let i = 0; i < columns; i++) {
      const x = i * FONT_SIZE;
      for (let y = 0; y < height; y += FONT_SIZE * 3) {
        if (Math.random() < 0.25) {
          const glyph = GLYPHS[(Math.random() * GLYPHS.length) | 0];
          ctx.fillText(glyph, x, y);
        }
      }
    }
  };

  const setRunning = (next) => {
    running = next;
    if (toggle) {
      toggle.textContent = running ? "Pause rain" : "Resume rain";
      toggle.setAttribute("aria-pressed", String(running));
    }
    if (!running) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    } else if (!rafId) {
      lastFrame = 0;
      rafId = requestAnimationFrame(draw);
    }
  };

  const applyMotionPreference = () => {
    if (prefersReduced.matches) {
      cancelAnimationFrame(rafId);
      rafId = 0;
      drawStatic();
      if (toggle) {
        toggle.textContent = "Resume rain";
        toggle.setAttribute("aria-pressed", "false");
      }
      running = false;
    } else {
      running = true;
      if (!rafId) rafId = requestAnimationFrame(draw);
      if (toggle) {
        toggle.textContent = "Pause rain";
        toggle.setAttribute("aria-pressed", "true");
      }
    }
  };

  resize();
  window.addEventListener("resize", () => {
    resize();
    if (prefersReduced.matches) drawStatic();
  });

  if (toggle) {
    toggle.addEventListener("click", () => setRunning(!running));
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    } else if (running && !prefersReduced.matches) {
      lastFrame = 0;
      rafId = requestAnimationFrame(draw);
    }
  });

  prefersReduced.addEventListener("change", applyMotionPreference);
  applyMotionPreference();
})();
