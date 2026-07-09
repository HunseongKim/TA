/* =====================================================
   1) 블랙홀 씬 — 1회만 그리는 정적 캔버스 (GPU 부하 0)
      구성: 별 + 은하수 띠 + 강착원반(뒤) + 광자 고리 +
            사건의 지평선 + 강착원반(앞)
   2) 목록 렌더링 — data/content.js
   ===================================================== */

/* ---------- 1. Black Hole ---------- */
(function blackHole() {
  const canvas = document.getElementById("hole");
  const ctx = canvas.getContext("2d");
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  function draw() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = w * DPR; canvas.height = h * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2, cy = h * 0.52;
    const R = Math.min(w, h) * 0.16;      // 사건의 지평선 반지름
    const FLAT = 0.24;                     // 원반의 납작한 정도
    const TILT = -0.06;                    // 원반 기울기(라디안)

    /* --- 별 --- */
    const NS = Math.min(700, Math.round((w * h) / 2400));
    for (let i = 0; i < NS; i++) {
      const x = Math.random() * w, y = Math.random() * h;
      const s = Math.random() < 0.9 ? Math.random() * 1.1 + 0.2 : Math.random() * 1.8 + 1.1;
      // 살짝 색 온도 섞기: 대부분 흰색, 가끔 따뜻한 별
      const warm = Math.random() < 0.25;
      const a = 0.2 + Math.random() * 0.7;
      ctx.fillStyle = warm
        ? `rgba(240, 200, 160, ${a.toFixed(2)})`
        : `rgba(236, 236, 236, ${a.toFixed(2)})`;
      ctx.beginPath(); ctx.arc(x, y, s / 2, 0, Math.PI * 2); ctx.fill();
    }

    /* --- 은하수 띠 (대각선, 아주 흐리게) --- */
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.5);
    for (let i = 0; i < 260; i++) {
      const x = (Math.random() - 0.5) * w * 1.6;
      const y = (Math.random() - 0.5) * h * 0.16 * (1 + Math.abs(x) / w);
      const a = 0.03 + Math.random() * 0.10;
      const s = 6 + Math.random() * 26;
      const g = ctx.createRadialGradient(x, y, 0, x, y, s);
      g.addColorStop(0, `rgba(220, 210, 200, ${a.toFixed(3)})`);
      g.addColorStop(1, "rgba(220, 210, 200, 0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();

    /* --- 원반 좌표 헬퍼 --- */
    const diskXY = (a, r) => {
      const ex = Math.cos(a) * r;
      const ey = Math.sin(a) * r * FLAT;
      return {
        x: cx + ex * Math.cos(TILT) - ey * Math.sin(TILT),
        y: cy + ex * Math.sin(TILT) + ey * Math.cos(TILT),
      };
    };

    /* --- 강착원반 스트릭 (뒤/앞 나눠 그리기) --- */
    const ND = Math.min(3200, Math.round(w * 4));
    const streaks = [];
    for (let i = 0; i < ND; i++) {
      const a = Math.random() * Math.PI * 2;
      // 안쪽에 밀도 집중
      const r = R * (1.25 + Math.pow(Math.random(), 2.2) * 2.4);
      streaks.push({ a, r });
    }
    // 안쪽일수록 밝고 하얗게, 바깥은 어둡고 주황
    function drawStreak(s) {
      const { a, r } = s;
      const p = diskXY(a, r);
      const near = 1 - (r - R * 1.25) / (R * 2.4); // 1=안쪽
      const alpha = 0.05 + Math.pow(near, 2.2) * 0.75 * (0.5 + Math.random() * 0.5);
      const len = 3 + near * 16 + Math.random() * 8;
      const th = 0.5 + near * 0.9;
      // 색: 안쪽 흰색 → 바깥 주황
      const cr = 255, cg = Math.round(200 + near * 55), cb = Math.round(140 + near * 115);
      ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha.toFixed(3)})`;
      ctx.lineWidth = th;
      ctx.lineCap = "round";
      // 접선 방향으로 짧은 호
      const a2 = a + len / r;
      const q = diskXY(a2, r);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(q.x, q.y);
      ctx.stroke();
    }

    // 뒤쪽 절반 (블랙홀 위로 지나가는 부분)
    for (const s of streaks) if (Math.sin(s.a) < 0) drawStreak(s);

    /* --- 렌즈된 빛의 고리 (블랙홀을 감싸는 세로 후광) --- */
    for (let i = 5; i >= 0; i--) {
      const rr = R * (1.06 + i * 0.035);
      const alpha = 0.5 / (i + 1);
      ctx.strokeStyle = `rgba(255, 230, 200, ${alpha.toFixed(3)})`;
      ctx.lineWidth = i === 0 ? 1.6 : 2 + i * 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rr, rr * 0.96, TILT, 0, Math.PI * 2);
      ctx.stroke();
    }
    // 위쪽 아치는 조금 더 밝게 (뒤 원반의 빛이 꺾여 올라온 것)
    ctx.strokeStyle = "rgba(255, 240, 215, 0.55)";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.ellipse(cx, cy, R * 1.12, R * 1.08, TILT, Math.PI * 1.05, Math.PI * 1.95);
    ctx.stroke();

    /* --- 사건의 지평선 --- */
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();

    /* --- 앞쪽 절반 원반 (블랙홀 앞을 가로지름) --- */
    for (const s of streaks) if (Math.sin(s.a) >= 0) drawStreak(s);

    /* --- 원반 전체의 은은한 글로우 --- */
    const glow = ctx.createRadialGradient(cx, cy, R, cx, cy, R * 4);
    glow.addColorStop(0, "rgba(255, 210, 160, 0.10)");
    glow.addColorStop(1, "rgba(255, 210, 160, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    /* --- 아래로 자연스럽게 어두워지며 본문에 합류 --- */
    const fade = ctx.createLinearGradient(0, h * 0.7, 0, h);
    fade.addColorStop(0, "rgba(5, 5, 5, 0)");
    fade.addColorStop(1, "rgba(5, 5, 5, 1)");
    ctx.fillStyle = fade;
    ctx.fillRect(0, 0, w, h);
  }

  draw();
  let t;
  window.addEventListener("resize", () => { clearTimeout(t); t = setTimeout(draw, 200); });
})();

/* ---------- 2. Lists ---------- */
(function renderLists() {
  const esc = (s) => String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const item = (it) => {
    const title = it.link
      ? `<a href="${esc(it.link)}" target="_blank" rel="noopener">${esc(it.title)}</a>`
      : esc(it.title);
    return `
      <li class="item">
        <div class="item-top">
          <span class="item-title">${title}</span>
          <span class="item-meta">${esc(it.meta || "")}</span>
        </div>
        ${it.desc ? `<p class="item-desc">${esc(it.desc)}</p>` : ""}
        ${it.tags && it.tags.length ? `<p class="item-tags">${it.tags.map(esc).join(" · ")}</p>` : ""}
      </li>`;
  };

  const pl = document.getElementById("projects-list");
  const sl = document.getElementById("study-list");
  if (pl && typeof PROJECTS !== "undefined") pl.innerHTML = PROJECTS.map(item).join("");
  if (sl && typeof STUDY !== "undefined") sl.innerHTML = STUDY.map(item).join("");
})();
