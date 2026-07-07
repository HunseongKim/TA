/* =====================================================
   Edge of Vision — main.js (모노크롬 리디자인)

   1) Void Field  : 보이드 주위로 소용돌이치는 점묘 성야.
                    한 번만 그리는 정적 캔버스 — GPU 부하 0.
   2) Anamorphic  : 타이틀 조각들이 서로 다른 3D 평면에 흩어져
                    있다가, 커서가 화면 정중앙(=올바른 시점)에
                    올 때만 한 문장으로 정렬됩니다.
   3) Index List  : data/content.js 를 목록으로 렌더링.
   ===================================================== */

/* ---------- 1. Void Field (정적, 1회 드로우) ---------- */
(function voidField() {
  const canvas = document.getElementById("void-field");
  const ctx = canvas.getContext("2d");
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  function draw() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = w * DPR;
    canvas.height = h * DPR;
    ctx.scale(DPR, DPR);
    ctx.clearRect(0, 0, w, h);

    // 보이드 중심: 화면 위쪽 약간 오른편
    const cx = w * 0.62, cy = h * 0.34;
    const voidR = Math.min(w, h) * 0.10;

    // 소용돌이 점묘: 보이드에 가까울수록 밀도·궤적 강화
    const N = Math.min(2200, Math.round((w * h) / 900));
    for (let i = 0; i < N; i++) {
      const a = Math.random() * Math.PI * 2;
      // 반경 분포: 보이드 바깥 고리에 몰리고 멀어질수록 희박
      const r = voidR * (1.15 + Math.pow(Math.random(), 0.45) * 9);
      // 소용돌이: 반경에 따라 각도를 비틀기
      const swirl = a + (voidR * 14) / r;
      const x = cx + Math.cos(swirl) * r;
      const y = cy + Math.sin(swirl) * r * 0.72; // 살짝 눌린 원반

      if (x < -4 || x > w + 4 || y < -4 || y > h + 4) continue;

      const near = Math.max(0, 1 - (r - voidR) / (voidR * 6));
      const alpha = 0.06 + near * 0.5 * Math.random();
      const size = 0.4 + near * 0.9 * Math.random();

      ctx.fillStyle = `rgba(234,234,234,${alpha.toFixed(3)})`;
      // 보이드 근처는 점을 살짝 궤적(짧은 호)으로
      if (near > 0.55 && Math.random() < 0.6) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(swirl + Math.PI / 2);
        ctx.fillRect(-size * 2.2, -size / 2, size * 4.4, size);
        ctx.restore();
      } else {
        ctx.fillRect(x, y, size, size);
      }
    }

    // 보이드: 완전한 검정 원 + 흐릿한 경계광
    const glow = ctx.createRadialGradient(cx, cy, voidR * 0.9, cx, cy, voidR * 2.6);
    glow.addColorStop(0, "rgba(234,234,234,0.10)");
    glow.addColorStop(1, "rgba(234,234,234,0)");
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(cx, cy, voidR * 2.6, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = "#060606";
    ctx.beginPath(); ctx.arc(cx, cy, voidR, 0, Math.PI * 2); ctx.fill();

    // 하단 비네트: 콘텐츠로 자연스럽게 잠기도록
    const fade = ctx.createLinearGradient(0, h * 0.55, 0, h);
    fade.addColorStop(0, "rgba(6,6,6,0)");
    fade.addColorStop(1, "rgba(6,6,6,0.92)");
    ctx.fillStyle = fade;
    ctx.fillRect(0, 0, w, h);
  }

  draw();
  let t;
  window.addEventListener("resize", () => { clearTimeout(t); t = setTimeout(draw, 200); });
})();

/* ---------- 2. Anamorphic Title ---------- */
(function anamorphic() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ana = document.getElementById("ana");
  const hint = document.getElementById("hint");
  const frags = Array.from(document.querySelectorAll(".ana-frag"));

  // data-p = "rotY, rotX, translateZ, translateX" (조각별 고유 평면)
  const planes = frags.map((el) =>
    el.dataset.p.split(",").map(Number)
  );

  if (reduced) {
    document.body.classList.add("reduced-motion");
    return; // 정렬된 상태로 정지
  }

  const fine = window.matchMedia("(pointer: fine)").matches;
  let target = 1;   // 1 = 완전 분절, 0 = 정렬
  let cur = 1;
  let auto = !fine; // 터치 기기: 스스로 천천히 숨쉬듯 정렬↔분절
  let alignedFlag = false;

  if (fine) {
    window.addEventListener("pointermove", (e) => {
      const dx = e.clientX / window.innerWidth - 0.5;
      const dy = e.clientY / window.innerHeight - 0.5;
      // 중앙에서의 거리 → 분절 강도
      target = Math.min(1, Math.hypot(dx, dy) * 3.2);
    }, { passive: true });
  }

  const t0 = performance.now();
  function frame(now) {
    requestAnimationFrame(frame);

    if (auto) {
      const t = (now - t0) / 1000;
      target = 0.5 + 0.5 * Math.sin(t * 0.45); // 0~1 왕복
    }

    cur += (target - cur) * 0.08;
    const f = cur;

    for (let i = 0; i < frags.length; i++) {
      const [ry, rx, tz, tx] = planes[i];
      frags[i].style.transform =
        `translateX(${tx * f}px) translateZ(${tz * f}px) ` +
        `rotateY(${ry * f}deg) rotateX(${rx * f}deg)`;
      frags[i].style.opacity = String(1 - f * 0.28);
    }

    const aligned = f < 0.1;
    if (aligned !== alignedFlag) {
      alignedFlag = aligned;
      ana.classList.toggle("is-aligned", aligned);
      hint.classList.toggle("is-aligned", aligned);
      hint.textContent = aligned
        ? "— 지금이 정면입니다"
        : "커서를 화면 정중앙으로 — 시점이 맞으면 글자가 정렬됩니다";
    }
  }
  requestAnimationFrame(frame);
})();

/* ---------- 3. Index Lists ---------- */
(function renderLists() {
  const esc = (s) => String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  // 제목을 두 조각으로 나눠 호버 시 분절 효과 부여
  const splitTitle = (t) => {
    const mid = Math.ceil(t.length / 2);
    return `<span class="t1">${esc(t.slice(0, mid))}</span><span class="t2">${esc(t.slice(mid))}</span>`;
  };

  const row = (item, i) => {
    const inner = `
      <span class="row-idx mono">${String(i + 1).padStart(2, "0")}</span>
      <h3 class="row-title">${splitTitle(item.title)}</h3>
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
  if (pl && typeof PROJECTS !== "undefined")
    pl.innerHTML = PROJECTS.map(row).join("");
  if (sl && typeof STUDY !== "undefined")
    sl.innerHTML = STUDY.map(row).join("");
})();
