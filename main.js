const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");

if (burger && navLinks) {
  burger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
  });

  navLinks.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    })
  );
}

const siteHeader = document.getElementById("siteHeader");

if (siteHeader) {
  const onScroll = () => {
    siteHeader.classList.toggle("scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

const cats = document.querySelectorAll("#modCats .cat");
const modRows = document.querySelectorAll("#modList .mod-row");

cats.forEach((btn) =>
  btn.addEventListener("click", () => {
    cats.forEach((c) => c.classList.remove("active"));
    btn.classList.add("active");
    const cat = btn.dataset.cat;
    modRows.forEach((row) => {
      row.style.display = cat === "all" || row.dataset.cat === cat ? "" : "none";
    });
  })
);

document.querySelectorAll(".chip-row").forEach((row) => {
  row.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    row.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    const media = row.closest(".clip-card").querySelector(".clip-media");
    media.querySelectorAll(".art").forEach((art) => {
      art.classList.toggle("active", art.dataset.art === chip.dataset.art);
    });
    media.querySelector(".clip-tag-label").textContent = chip.textContent;
  });
});

const heroCanvas = document.getElementById("waterFx");

if (heroCanvas) {
  const ctx = heroCanvas.getContext("2d");
  const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
  let W = 0;
  let H = 0;
  let t = 8;
  const layers = [
    { base: 0.58, amp: 15, freq: 0.0062, speed: 0.85, alpha: 0.14 },
    { base: 0.66, amp: 21, freq: 0.0078, speed: -0.66, alpha: 0.12 },
    { base: 0.74, amp: 27, freq: 0.0052, speed: 0.52, alpha: 0.10 },
    { base: 0.83, amp: 33, freq: 0.0041, speed: -0.42, alpha: 0.08 },
    { base: 0.92, amp: 39, freq: 0.0033, speed: 0.32, alpha: 0.06 }
  ];

  function sizeCanvas() {
    const rect = heroCanvas.parentElement.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    heroCanvas.width = W * DPR;
    heroCanvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  sizeCanvas();
  window.addEventListener("resize", sizeCanvas);

  function wavePoints(L, li) {
    const pts = [];
    for (let x = 0; x <= W + 6; x += 6) {
      const y =
        H * L.base +
        Math.sin(x * L.freq + t * L.speed + li * 2.2) * L.amp +
        Math.sin(x * L.freq * 2.6 + t * L.speed * 1.7 + li * 1.3) * L.amp * 0.4;
      pts.push([x, y]);
    }
    return pts;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    layers.forEach((L, li) => {
      const pts = wavePoints(L, li);

      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      pts.forEach((p) => ctx.lineTo(p[0], p[1]));
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, H * L.base - L.amp, 0, H);
      grad.addColorStop(0, "rgba(226,177,85," + L.alpha + ")");
      grad.addColorStop(1, "rgba(226,177,85,0)");
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      pts.forEach((p) => ctx.lineTo(p[0], p[1]));
      ctx.strokeStyle = "rgba(233,193,116," + Math.min(L.alpha + 0.1, 0.26) + ")";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  }

  if (REDUCED) {
    draw();
  } else {
    (function loop() {
      t += 0.022;
      draw();
      requestAnimationFrame(loop);
    })();
  }
}
