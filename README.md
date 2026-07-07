# Edge of Vision — TA 포트폴리오 사이트

인간의 지각(perception)을 주제로 한 테크니컬 아티스트 포트폴리오.
히어로 배경은 WebGL 프래그먼트 셰이더로 실시간 렌더링되며,
커서 위치를 중심시(fovea)로 삼아 주변시 영역은 디테일이 감쇠하는
**foveated rendering 컨셉**을 그대로 구현했습니다 — 사이트 자체가 0번 작품입니다.

## 폴더 구조

```
portfolio/
├── index.html          # 페이지 본문 (이름/링크 수정은 여기)
├── css/style.css       # 디자인 토큰과 스타일
├── js/main.js          # 히어로 셰이더 + 갤러리 렌더러
├── data/works.js       # ★ 셰이더 작품 목록 (평소엔 이 파일만 수정)
└── assets/works/       # 작품 GIF/MP4 저장 위치
```

## 1. 배포하기 (GitHub Pages)

1. GitHub에서 새 저장소 생성
   - 주소를 `https://아이디.github.io` 로 쓰고 싶다면 저장소 이름을 정확히 `아이디.github.io` 로
   - 아니면 아무 이름(예: `portfolio`)이어도 됨 → 주소는 `아이디.github.io/portfolio`
2. 이 폴더의 파일 전체를 저장소에 push

   ```bash
   cd portfolio
   git init
   git add .
   git commit -m "init: portfolio site"
   git branch -M main
   git remote add origin https://github.com/아이디/저장소이름.git
   git push -u origin main
   ```

3. 저장소 → **Settings → Pages** → Source를 `Deploy from a branch`,
   Branch를 `main` / `(root)` 로 설정 → Save
4. 1~2분 뒤 발급된 주소로 접속 확인

## 2. 처음 한 번 수정할 것 (`edit-me` 표시된 곳)

`index.html`에서 검색: `edit-me`

- 이름 (`홍길동`)
- GitHub 주소 (`YOUR_GITHUB_ID`) — 3곳
- 이메일, ArtStation 주소

`data/works.js`의 샘플 3개는 예시 형식이니, 실제 작품이 생기면 교체하세요.

## 3. 새 셰이더 작품 추가하는 법

1. ShaderToy 결과를 GIF(권장 5~10초 루프) 또는 MP4로 저장
   - OBS로 화면 녹화 후 [ezgif.com](https://ezgif.com) 등으로 변환하거나, ShaderToy 자체 export 사용
   - 용량은 GIF 기준 5MB 이하 권장 (페이지 로딩 속도)
2. 파일을 `assets/works/` 에 넣기 (예: `assets/works/week04-water.gif`)
3. `data/works.js` 배열 **맨 앞에** 항목 추가:

   ```js
   {
     week: "Week 04",
     title: "게르스트너 파도 물 셰이더",
     oneliner: "한 줄 요약",
     learned: "트러블슈팅/배운 점 한두 줄",
     tags: ["GLSL", "Water"],
     media: "assets/works/week04-water.gif",
     link: "https://github.com/아이디/shader-study"
   },
   ```

4. commit & push → 자동 반영

`media`를 빈 문자열 `""` 로 두면 "GIF coming soon" 플레이스홀더가 표시되므로,
영상 준비 전에 글부터 올려도 됩니다.

## 4. 로컬에서 미리보기

폴더에서 간단한 서버 실행 후 브라우저로 접속:

```bash
# Python이 있다면
python -m http.server 8000
# → http://localhost:8000
```

(그냥 index.html을 더블클릭해도 대부분 동작하지만, 서버 실행을 권장)

## 5. 성능/접근성 메모

- 히어로 셰이더는 내장그래픽(Iris Xe) 기준으로 가볍게 설계됨
  - DPR 상한 1.5, fbm 4옥타브, 화면 밖이면 렌더 정지
- `prefers-reduced-motion` 설정 시 셰이더 대신 정적 그라디언트 표시
- WebGL 미지원 브라우저에서도 정적 배경으로 폴백
