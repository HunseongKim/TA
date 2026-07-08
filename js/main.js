/* =====================================================
   Edge of Vision — main.js (맑은 날의 출발)

   1) Clouds   : 뭉게구름. 1회만 그리는 정적 캔버스
                 (흐름은 CSS 애니메이션이 담당).
   2) Land     : 초록 언덕 3겹 + 굽이치는 강 + 나무 실루엣.
                 역시 1회 드로우.
   3) Parallax : 마우스(시선)에 따라 해·구름·언덕이 서로
                 다른 깊이로 움직임. transform만 사용.
   4) Sparkles : 햇빛에 떠다니는 반짝임(꽃씨처럼).
   5) Lists    : data/content.js 렌더링.
   ===================================================== */

const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const DPR = Math.min(window.devicePixelRatio || 1, 2);

/* ---------- 1. Clouds (정적 드로우) ---------- */
(function clouds() {
  const canvas = document.getElementById("clouds");
  const ctx = canvas.getContext("2d");

  // 뭉게구름 하나: 원 여러 개를 겹쳐 부드럽게
  function puff(cx, cy, s, alpha) {
    const lobes = 6 + Math.floor(Math.random() * 4);
    for (let i = 0; i < lobes; i++) {
      const a = (i / lobes) * Math.PI;              // 위쪽 반원으로 몽글몽글
      const px = cx + Math.cos(a) * s * (0.5 + Math.random() * 0.55) * 1.6;
      const py = cy - Math.abs(Math.sin(a)) * s * (0.35 + Math.random() * 0.4);
      const pr = s * (0.38 + Math.random() * 0.4);
      const g = ctx.createRadialGradient(px, py, pr * 0.2, px, py, pr);
      g.addColorStop(0, `rgba(255,255,255,${alpha})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(px, py, pr, 0, Math.PI * 2); ctx.fill();
    }
    // 평평한 밑면
    const base = ctx.createRadialGradient(cx, cy, s * 0.3, cx, cy, s * 1.9);
    base.addColorStop(0, `rgba(255,255,255,${alpha * 0.9})`);
    base.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = base;
    ctx.beginPath();
    ctx.ellipse(cx, cy, s * 1.9, s * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function draw() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = w * DPR; canvas.height = h * DPR;
    ctx.scale(DPR, DPR);
    ctx.clearRect(0, 0, w, h);

    // 큰 구름 4~5개 (하늘 위~중간), 멀리 작은 구름 몇 개
    const big = 4 + Math.round(Math.random());
    for (let i = 0; i < big; i++) {
      const cx = (0.08 + 0.84 * (i / (big - 1)) + (Math.random() - 0.5) * 0.08) * w;
      const cy = (0.12 + Math.random() * 0.28) * h;
      puff(cx, cy, w * (0.045 + Math.random() * 0.035), 0.85);
    }
    for (let i = 0; i < 5; i++) {
      puff(Math.random() * w, (0.38 + Math.random() * 0.14) * h,
           w * (0.015 + Math.random() * 0.015), 0.55);
    }

    // 먼 새 두어 마리 (작은 V자)
    ctx.strokeStyle = "rgba(30, 70, 95, 0.5)";
    ctx.lineWidth = 1.2;
    ctx.lineCap = "round";
    for (let i = 0; i < 3; i++) {
      const bx = (0.2 + Math.random() * 0.6) * w;
      const by = (0.16 + Math.random() * 0.2) * h;
      const s = 4 + Math.random() * 3;
      ctx.beginPath();
      ctx.moveTo(bx - s, by);
      ctx.quadraticCurveTo(bx - s * 0.4, by - s * 0.7, bx, by);
      ctx.quadraticCurveTo(bx + s * 0.4, by - s * 0.7, bx + s, by);
      ctx.stroke();
    }
  }
  draw();
  let t; window.addEventListener("resize", () => { clearTimeout(t); t = setTimeout(draw, 200); });
})();

/* ---------- 2. Land (정적 드로우) ---------- */
(function land() {
  const canvas = document.getElementById("land");
  const ctx = canvas.getContext("2d");

  // 부드러운 능선 하나 그리기
  function ridge(baseY, amp, color, w, h) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-10, h + 10);
    ctx.lineTo(-10, baseY);
    const bumps = 3 + Math.floor(Math.random() * 2);
    let x = -10;
    for (let i = 0; i < bumps; i++) {
      const nx = ((i + 1) / bumps) * (w + 20) - 10;
      const cxp = (x + nx) / 2;
      const cy = baseY + (Math.random() - 0.62) * amp;
      ctx.quadraticCurveTo(cxp, cy, nx, baseY + (Math.random() - 0.5) * amp * 0.5);
      x = nx;
    }
    ctx.lineTo(w + 10, h + 10);
    ctx.closePath();
    ctx.fill();
  }

  // 굽이치는 강: 지평선의 소실점에서 아래로 내려오며 넓어짐
  function river(w, h, topY) {
    const pts = [];
    const S = 26;
    for (let i = 0; i <= S; i++) {
      const t = i / S;                               // 0=지평선, 1=화면 아래
      const y = topY + (h - topY) * Math.pow(t, 1.35);
      const wind = Math.sin(t * Math.PI * 2.4) * w * 0.13 * t; // 아래로 올수록 크게 굽이침
      pts.push({ x: w * 0.5 + wind, y, half: (0.8 + t * t * w * 0.045) });
    }
    // 좌우 가장자리를 이어 하나의 리본으로
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (const p of pts) ctx.lineTo(p.x - p.half, p.y);
    for (let i = pts.length - 1; i >= 0; i--) ctx.lineTo(pts[i].x + pts[i].half, pts[i].y);
    ctx.closePath();
    const g = ctx.createLinearGradient(0, topY, 0, h);
    g.addColorStop(0, "#bfe9f5");
    g.addColorStop(1, "#5fc4e8");
    ctx.fillStyle = g;
    ctx.fill();
    // 물빛 반짝임
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.lineWidth = 1;
    ctx.stroke();
    return pts;
  }

  // 몽글한 나무 한 그루
  function tree(x, y, s, dark) {
    ctx.fillStyle = dark ? "#2c7a4b" : "#3f9a5d";
    ctx.beginPath(); ctx.arc(x, y - s * 1.1, s * 0.75, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x - s * 0.55, y - s * 0.7, s * 0.55, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + s * 0.55, y - s * 0.7, s * 0.55, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#6b4a2e";
    ctx.fillRect(x - s * 0.08, y - s * 0.35, s * 0.16, s * 0.4);
  }

  function draw() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = w * DPR; canvas.height = h * DPR;
    ctx.scale(DPR, DPR);
    ctx.clearRect(0, 0, w, h);

    const horizon = h * 0.60;

    // 가장 먼 산: 하늘색이 낀 청록
    ridge(horizon, h * 0.05, "#a9d3c3", w, h);
    // 중간 언덕: 밝은 초록
    ridge(h * 0.68, h * 0.06, "#8ecb7f", w, h);
    // 강 (중간 언덕 위로 흐르게)
    const pts = river(w, h, horizon + h * 0.015);
    // 가까운 언덕: 진한 초록, 좌우에서 감싸듯
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, w * 0.34, h); ctx.rect(w * 0.66, 0, w * 0.34, h);
    ctx.clip();
    ridge(h * 0.8, h * 0.07, "#5cb168", w, h);
    ctx.restore();
    // 맨 앞 능선: 화면 하단을 든든하게
    ridge(h * 0.93, h * 0.045, "#469a58", w, h);

    // 나무들: 강가와 언덕에 듬성듬성
    for (let i = 0; i < 9; i++) {
      const t = 0.25 + Math.random() * 0.7;
      const p = pts[Math.floor(t * (pts.length - 1))];
      const side = Math.random() < 0.5 ? -1 : 1;
      const x = p.x + side * (p.half + 14 + Math.random() * w * 0.16);
      if (x < 8 || x > w - 8) continue;
      tree(x, p.y + 2, 5 + t * 13, Math.random() < 0.4);
    }
    for (let i = 0; i < 5; i++) {
      tree((0.05 + Math.random() * 0.9) * w, h * (0.9 + Math.random() * 0.06),
           14 + Math.random() * 9, Math.random() < 0.5);
    }
  }
  draw();
  let t; window.addEventListener("resize", () => { clearTimeout(t); t = setTimeout(draw, 200); });
})();

/* ---------- 3. Gaze Parallax ---------- */
(function parallax() {
  if (REDUCED) return;
  if (!window.matchMedia("(pointer: fine)").matches) return; // 터치 기기는 정적

  const sun    = document.querySelector(".layer-sun");
  const clouds = document.querySelector(".layer-clouds");
  const land   = document.querySelector(".layer-land");

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
    sun.style.transform    = `translate(${cx * -7}px,  ${cy * -4}px)`;
    clouds.style.transform = `translate(${cx * -15}px, ${cy * -8}px)`;
    land.style.transform   = `translate(${cx * -28}px, ${cy * -13}px)`;
  })();
})();

/* ---------- 4. Sun Sparkles ---------- */
(function sparkles() {
  if (REDUCED) { document.body.classList.add("no-anim"); return; }

  const canvas = document.getElementById("sparkles");
  const ctx = canvas.getContext("2d");
  let w, h;

  function resize() {
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * DPR; canvas.height = h * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  // 햇빛 속을 떠다니는 반짝임 16개 (꽃씨/윤슬 느낌)
  const N = 16;
  const motes = Array.from({ length: N }, () => ({
    x: Math.random(),
    y: Math.random() * 0.85,
    r: 0.7 + Math.random() * 1.5,
    sp: 0.25 + Math.random() * 0.7,
    ph: Math.random() * Math.PI * 2,
    ph2: Math.random() * Math.PI * 2,
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

    for (const m of motes) {
      // 천천히 위로 떠오르며 좌우로 살랑임
      const y = ((m.y - t * 0.008 * m.sp) % 1 + 1) % 1;
      const x = (m.x + Math.sin(t * 0.16 * m.sp + m.ph) * 0.03) * w;
      const blink = 0.3 + 0.7 * Math.pow(0.5 + 0.5 * Math.sin(t * 0.8 * m.sp + m.ph2), 2);

      const g = ctx.createRadialGradient(x, y * h, 0, x, y * h, m.r * 6);
      g.addColorStop(0, `rgba(255, 252, 235, ${(0.85 * blink).toFixed(2)})`);
      g.addColorStop(0.4, `rgba(255, 236, 170, ${(0.30 * blink).toFixed(2)})`);
      g.addColorStop(1, "rgba(255, 236, 170, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y * h, m.r * 6, 0, Math.PI * 2);
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
