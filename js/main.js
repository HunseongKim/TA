/* data/content.js 의 PROJECTS / STUDY 를 목록으로 렌더링 */
(function () {
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
