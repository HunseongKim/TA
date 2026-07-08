# Edge of Vision — TA 포트폴리오 (새벽의 출발)

주변시까지 덮는 몰입형 렌더링이라는 목표를 담은 포트폴리오.
히어로는 "낯선 세계로 떠나기 직전의 새벽 들판" 씬입니다 —
별이 남은 밤하늘, 지평선의 새벽빛, 들풀 실루엣과 그 사이의 길,
떠다니는 반딧불. 마우스(시선)를 움직이면 하늘·노을·들판이
서로 다른 깊이로 따라 움직여 '풍경 안에 서 있는' 감각을 줍니다.

## 폴더 구조

```
portfolio/
├── index.html        # 페이지 골격 (링크 수정: edit-me 검색)
├── css/style.css     # 밤하늘/새벽빛 팔레트
├── js/main.js        # 별·들판·패럴랙스·반딧불·목록 렌더러
├── data/content.js   # ★ 평소엔 이 파일만 수정 (PROJECTS / STUDY)
└── assets/works/     # 이미지·영상이 필요해지면 여기에
```

## 배포 (GitHub Pages, 웹에서)

1. github.com → `+` → New repository (이름을 `아이디.github.io` 로 하면 주소가 깔끔)
2. 저장소 첫 화면의 "uploading an existing file" 클릭
   → 이 폴더 **안의 내용물**을 드래그해 업로드 → Commit changes
3. Settings → Pages → Source `Deploy from a branch`, Branch `main` / `(root)` → Save
4. 1~2분 뒤 발급된 주소로 접속

이미 이전 버전을 올렸다면: Add file → Upload files 로 새 파일을 올리면
같은 이름은 덮어써집니다.

## 내용 수정하는 법

- 항목 추가/수정: `data/content.js` 의 `PROJECTS`, `STUDY` 배열만 편집
  (맨 앞에 넣으면 위에 먼저 보임, `link: ""` 는 링크 없는 행)
- GitHub·이메일 주소: `index.html` 에서 `edit-me` 검색해 교체

## 성능/접근성

- 별·들판은 1회만 그리는 정적 캔버스, 움직이는 건 반딧불 14개와
  transform 패럴랙스뿐 — 내장그래픽에서 매우 가벼움
- 터치 기기에서는 패럴랙스 비활성(배터리 배려), 반딧불만 유지
- `prefers-reduced-motion` 설정 시 모든 움직임 정지
