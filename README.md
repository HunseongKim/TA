# Edge of Vision — TA 포트폴리오 (맑은 날의 출발)

밝고 희망찬 "모험 시작" 무드의 포트폴리오.
히어로는 한여름 오전의 초록 골짜기 씬입니다 — 파란 하늘과
뭉게구름, 굽이치며 내려오는 강, 언덕 위의 나무들, 햇빛 속을
떠다니는 반짝임. 마우스(시선)를 움직이면 해·구름·언덕이
서로 다른 깊이로 따라 움직여 '풍경 안에 서 있는' 감각을 줍니다.

## 폴더 구조

```
portfolio/
├── index.html        # 페이지 골격 (링크 수정: edit-me 검색)
├── css/style.css     # 하늘/초원 라이트 팔레트
├── js/main.js        # 구름·골짜기·패럴랙스·반짝임·목록 렌더러
├── data/content.js   # ★ 평소엔 이 파일만 수정 (PROJECTS / STUDY)
└── assets/works/     # 이미지·영상이 필요해지면 여기에
```

## 배포 / 업데이트 (GitHub Pages)

- 처음: 저장소 만들기 → "uploading an existing file"로 이 폴더 **안의
  내용물** 업로드 → Settings → Pages → Branch `main` `(root)` → Save
- 갱신: Add file → Upload files 로 새 파일을 올리면 같은 이름은 덮어써짐
- 반영까지 1~3분. 안 바뀐 것 같으면 Ctrl+F5(강력 새로고침) 또는 시크릿 창 확인

## 내용 수정하는 법

- 항목 추가/수정: `data/content.js` 의 `PROJECTS`, `STUDY` 배열만 편집
  (맨 앞에 넣으면 위에 먼저 보임, `link: ""` 는 링크 없는 행)
- GitHub·이메일 주소: `index.html` 에서 `edit-me` 검색해 교체

## 성능/접근성

- 구름·골짜기는 1회만 그리는 정적 캔버스. 움직이는 것은
  반짝임 16개, 구름의 느린 CSS 드리프트, transform 패럴랙스뿐
- 터치 기기에서는 패럴랙스 비활성(배터리 배려)
- `prefers-reduced-motion` 설정 시 모든 움직임 정지
