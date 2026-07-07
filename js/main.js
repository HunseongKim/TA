/* =====================================================
   Edge of Vision — main.js
   1) Fovea Shader: 히어로 배경 (WebGL 프래그먼트 셰이더)
      커서 = 중심시(fovea). 커서 주변만 고주파 디테일이
      살아나고, 주변시 영역은 흐릿하고 어둡게 —
      인간 시각의 foveated rendering 개념을 그대로 재현.
   2) Works Gallery: data/works.js 를 카드로 렌더링
   ===================================================== */

/* ---------- 1. Fovea Shader ---------- */
(function heroShader() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) { document.body.classList.add("reduced-motion"); return; }

  const canvas = document.getElementById("fovea-canvas");
  const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
  if (!gl) { document.body.classList.add("no-webgl"); return; }

  const VERT = `
    attribute vec2 aPos;
    void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
  `;

  const FRAG = `
    precision highp float;
    uniform vec2  u_res;
    uniform float u_time;
    uniform vec2  u_mouse; // 픽셀 좌표, 원점 좌하단

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }
    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i),                 hash(i + vec2(1.0, 0.0)), f.x),
        mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0, 1.0)), f.x),
        f.y
      );
    }
    float fbm(vec2 p) {
      float v = 0.0, a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p *= 2.03; a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
      vec2 m  = (u_mouse       - 0.5 * u_res) / u_res.y;

      // fovea: 커서에서 멀어질수록 0으로 감쇠
      float d     = length(uv - m);
      float focus = smoothstep(0.5, 0.0, d);

      // 저주파 배경 흐름 (주변시 영역)
      vec2  q = uv * 2.1;
      float w = fbm(q + 0.12 * u_time);
      float n = fbm(q + 1.7 * w + vec2(0.0, 0.06 * u_time));

      // 고주파 디테일 — fovea 근처에서만 계산 가중
      float detail = fbm(q * 4.5 + n * 3.0 + 0.1 * u_time) * focus;

      float field = n * 0.85 + detail * 0.55;

      vec3 base    = vec3(0.043, 0.035, 0.094); // --ink-deep
      vec3 indigo  = vec3(0.24, 0.20, 0.56);
      vec3 cyan    = vec3(0.35, 0.85, 0.95);
      vec3 magenta = vec3(0.95, 0.35, 0.66);

      vec3 col = mix(base, indigo, field);
      col = mix(col, cyan,    smoothstep(0.55, 0.95, field) * (0.30 + 0.50 * focus));
      col = mix(col, magenta, smoothstep(0.72, 1.05, field + 0.12 * focus) * 0.35);

      // 주변시 감쇠: 화면 가장자리로 갈수록 어둡게 (지각의 비네트)
      float vig = smoothstep(1.3, 0.35, length(uv));
      col *= mix(0.5, 1.0, vig);

      // fovea 은은한 글로우
      col += cyan * 0.05 * focus;

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) { document.body.classList.add("no-webgl"); return; }

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.useProgram(prog);

  // 풀스크린 삼각형
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes   = gl.getUniformLocation(prog, "u_res");
  const uTime  = gl.getUniformLocation(prog, "u_time");
  const uMouse = gl.getUniformLocation(prog, "u_mouse");

  // 내장그래픽 배려: DPR 상한 1.5
  const DPR = Math.min(window.devicePixelRatio || 1, 1.5);

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width  = Math.round(w * DPR);
    canvas.height = Math.round(h * DPR);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  window.addEventListener("resize", resize);

  // 마우스: 부드럽게 따라오는 fovea (lerp)
  let target = { x: 0.5, y: 0.55 };
  let cur    = { x: 0.5, y: 0.55 };
  let interacted = false;

  window.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    target.x = (e.clientX - r.left) / r.width;
    target.y = 1.0 - (e.clientY - r.top) / r.height;
    interacted = true;
  }, { passive: true });

  // 히어로가 화면 밖이면 렌더 정지 (배터리/발열 배려)
  let visible = true;
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; })
    .observe(canvas);

  const t0 = performance.now();
  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible || document.hidden) return;

    const t = (now - t0) / 1000;

    // 상호작용 전에는 fovea가 스스로 천천히 배회
    if (!interacted) {
      target.x = 0.5 + 0.22 * Math.sin(t * 0.23);
      target.y = 0.55 + 0.16 * Math.cos(t * 0.17);
    }
    cur.x += (target.x - cur.x) * 0.06;
    cur.y += (target.y - cur.y) * 0.06;

    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, t);
    gl.uniform2f(uMouse, cur.x * canvas.width, cur.y * canvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  requestAnimationFrame(frame);
})();

/* ---------- 2. Works Gallery ---------- */
(function renderWorks() {
  const grid = document.getElementById("works-grid");
  if (!grid || typeof WORKS === "undefined") return;

  const esc = (s) => String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  grid.innerHTML = WORKS.map((w) => {
    const media = w.media
      ? (w.media.endsWith(".mp4")
          ? `<video src="${esc(w.media)}" autoplay muted loop playsinline></video>`
          : `<img src="${esc(w.media)}" alt="${esc(w.title)} 결과 미리보기" loading="lazy" />`)
      : `<div class="work-media-empty">GIF coming soon</div>`;

    return `
      <article class="work-card">
        <div class="work-media">${media}</div>
        <div class="work-body">
          <span class="work-week">${esc(w.week)}</span>
          <h3 class="work-title">${esc(w.title)}</h3>
          <p class="work-oneliner">${esc(w.oneliner)}</p>
          <p class="work-learned"><b>배운 점</b> — ${esc(w.learned)}</p>
          <div class="work-tags">${w.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
          <a class="work-link" href="${esc(w.link)}" target="_blank" rel="noopener">코드 보기 ↗</a>
        </div>
      </article>`;
  }).join("");
})();
