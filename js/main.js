/* =====================================================
   Edge of Vision — main.js (새벽의 출발)

   1) Stars    : 밤하늘 별. 1회만 그리는 정적 캔버스.
   2) Land     : 들판 실루엣 + 지평선으로 향하는 희미한 길.
                 역시 1회 드로우.
   3) Parallax : 마우스(시선)에 따라 하늘·노을·들판이
                 서로 다른 깊이로 움직임 — '풍경 안에
                 서 있는' 감각. transform만 사용해 가벼움.
   4) Fireflies: 들판 위를 떠다니는 반딧불 몇 마리.
   5) Lists    : data/content.js 렌더링.
   ===================================================== */

const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const DPR = Math.min(window.devicePixelRatio || 1, 2);

/* ---------- 1. Stars (정적) ---------- */
(function stars() {
  const canvas = document.getElementById("stars");
  const ctx = canvas.getContext("2d");

  function draw() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = w * DPR; canvas.height = h * DPR;
    ctx.scale(DPR, DPR);

    const N = Math.min(420, Math.round((w * h) / 4200));
    for (let i = 0; i < N; i++) {
      const x = Math.random() * w;
      // 지평선(아래) 근처엔 별을 줄여 새벽빛에 잠기게
      const y = Math.pow(Math.random(), 1.5) * h * 0.85;
      const size = Math.random() < 0.92 ? Math.random() * 1.3 + 0.3 : Math.random() * 2 + 1.4;
      const a = 0.25 + Math.random() * 0.65;
      ctx.fillStyle = `rgba(243, 239, 230, ${a.toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fill();
      // 큰 별에는 십자 반짝임
      if (size > 1.6) {
        ctx.fillStyle = `rgba(243, 239, 230, ${(a * 0.35).toFixed(2)})`;
        ctx.fillRect(x - size * 2.4, y - 0.4, size * 4.8, 0.8);
        ctx.fillRect(x - 0.4, y - size * 2.4, 0.8, size * 4.8);
      }
    }
  }
  draw();
  let t; window.addEventListener("resize", () => { clearTimeout(t); t = setTimeout(draw, 200); });
})();

/* ---------- 2. Land (정적) ---------- */
(function land() {
  const canvas = document.getElementById("land");
  const ctx = canvas.getContext("2d");

  function draw() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = w * DPR; canvas.height = h * DPR;
    ctx.scale(DPR, DPR);
    ctx.clearRect(0, 0, w, h);

    const ridgeY = h * 0.86;           // 능선 높이
    const cx = w / 2;

    // --- 완만하게 굽은 언덕 실루엣 (돔 안쪽 같은 곡률) ---
    ctx.fillStyle = "#04060d";
    ctx.beginPath();
    ctx.moveTo(-10, h + 10);
    ctx.lineTo(-10, ridgeY + h * 0.05);
    ctx.quadraticCurveTo(cx, ridgeY - h * 0.055, w + 10, ridgeY + h * 0.05);
    ctx.lineTo(w + 10, h + 10);
    ctx.closePath();
    ctx.fill();

    const ridgeAt = (x) => {
      // 위 곡선과 동일한 능선 y값
      const t = x / w;
      const edge = ridgeY + h * 0.05, top = ridgeY - h * 0.055;
      return edge + (top - edge) * (1 - Math.pow(2 * t - 1, 2));
    };

    // --- 지평선으로 이어지는 희미한 길 ---
    const grad = ctx.createLinearGradient(0, h, 0, ridgeY - h * 0.05);
    grad.addColorStop(0, "rgba(255, 178, 107, 0.14)");
    grad.addColorStop(1, "rgba(255, 178, 107, 0.02)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.055, h + 10);
    ctx.quadraticCurveTo(cx - w * 0.012, ridgeY, cx - w * 0.004, ridgeAt(cx));
    ctx.lineTo(cx + w * 0.004, ridgeAt(cx));
    ctx.quadraticCurveTo(cx + w * 0.012, ridgeY, cx + w * 0.055, h + 10);
    ctx.closePath();
    ctx.fill();

    // --- 능선 위 들풀 실루엣 ---
    ctx.strokeStyle = "#04060d";
    ctx.lineCap = "round";
    const blades = Math.round(w / 5);
    for (let i = 0; i < blades; i++) {
      const x = Math.random() * w;
      // 길 위에는 풀을 심지 않는다
      if (Math.abs(x - cx) < w * 0.012) continue;
      const y = ridgeAt(x) + 1;
      const tall = 4 + Math.random() * 13;
      const lean = (Math.random() - 0.5) * 7;
      ctx.lineWidth = 0.6 + Math.random() * 0.9;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + lean * 0.4, y - tall * 0.6, x + lean, y - tall);
      ctx.stroke();
    }
  }
  draw();
  let t; window.addEventListener("resize", () => { clearTimeout(t); t = setTimeout(draw, 200); });
})();

/* ---------- 3. Gaze Parallax ---------- */
(function parallax() {
  if (REDUCED) return;
  const fine = window.matchMedia("(pointer: fine)").matches;
  if (!fine) return; // 터치 기기는 정적 (배터리 배려)

  const sky  = document.querySelector(".layer-sky");
  const glow = document.querySelector(".layer-glow");
  const land = document.querySelector(".layer-land");

  let tx = 0, ty = 0, cx = 0, cy = 0;
  window.addEventListener("pointermove", (e) => {
    tx = e.clientX / window.innerWidth - 0.5;
    ty = e.clientY / window.innerHeight - 0.5;
  }, { passive: true });

  let visible = true;
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; })
    .observe(document.querySelector(".hero"));

  (function frame() {
    requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    cx += (tx - cx) * 0.05;
    cy += (ty - cy) * 0.05;
    // 시선과 반대로 밀리는 깊이감: 먼 것일수록 적게 움직임
    sky.style.transform  = `translate(${cx * -8}px,  ${cy * -5}px)`;
    glow.style.transform = `translate(${cx * -16}px, ${cy * -9}px)`;
    land.style.transform = `translate(${cx * -30}px, ${cy * -14}px)`;
  })();
})();

/* ---------- 4. Fireflies ---------- */
(function fireflies() {
  if (REDUCED) { document.body.classList.add("no-anim"); return; }

  const canvas = document.getElementById("sparks");
  const ctx = canvas.getContext("2d");
  let w, h;

  function resize() {
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * DPR; canvas.height = h * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  // 들판(하단 30%) 위에 반딧불 14마리
  const N = 14;
  const flies = Array.from({ length: N }, () => ({
    x: Math.random(),
    y: 0.72 + Math.random() * 0.24,
    r: 0.8 + Math.random() * 1.4,
    sp: 0.3 + Math.random() * 0.7,     // 속도 계수
    ph: Math.random() * Math.PI * 2,   // 위상
    ph2: Math.random() * Math.PI * 2,  // 깜빡임 위상
  }));

  let visible = true;
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; })
    .observe(canvas);

  const t0 = performance.now();
  (function frame(now) {
    requestAnimationFrame(frame);
    if (!visible || document.hidden) return;

    const t = (now - t0) / 1000;
    ctx.clearRect(0, 0, w, h);

    for (const f of flies) {
      const x = (f.x + Math.sin(t * 0.11 * f.sp + f.ph) * 0.05) * w;
      const y = (f.y + Math.sin(t * 0.23 * f.sp + f.ph * 1.7) * 0.03) * h;
      // 숨쉬듯 깜빡임
      const blink = 0.35 + 0.65 * Math.pow(0.5 + 0.5 * Math.sin(t * 0.9 * f.sp + f.ph2), 2);

      const g = ctx.createRadialGradient(x, y, 0, x, y, f.r * 7);
      g.addColorStop(0, `rgba(255, 205, 130, ${(0.75 * blink).toFixed(2)})`);
      g.addColorStop(0.35, `rgba(255, 178, 107, ${(0.28 * blink).toFixed(2)})`);
      g.addColorStop(1, "rgba(255, 178, 107, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, f.r * 7, 0, Math.PI * 2);
      ctx.fill();
    }
  })(t0);
})();

/* ---------- 5. Index Lists ---------- */
(function renderLists() {
  const esc = (s) => String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const row = (item, i) => {
    const inner = `
      <span class="row-idx mono">${String(i + 1).padStart(2, "0")}</span>
      <h3 class="row-title">${esc(item.title)}</h3>
      <span class="row-meta">${esc(item.meta || "")}</span>
      ${item.desc ? `<p class="row-desc">${esc(item.desc)}</p>` : ""}
      ${item.tags && item.tags.length
        ? `<div class="row-tags">${item.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>`
        : ""}
    `;
    return item.link
      ? `<li class="row"><a class="row-link" href="${esc(item.link)}" target="_blank" rel="noopener">${inner}</a></li>`
      : `<li class="row">${inner}</li>`;
  };

  const pl = document.getElementById("projects-list");
  const sl = document.getElementById("study-list");
  if (pl && typeof PROJECTS !== "undefined") pl.innerHTML = PROJECTS.map(row).join("");
  if (sl && typeof STUDY !== "undefined") sl.innerHTML = STUDY.map(row).join("");
})();
