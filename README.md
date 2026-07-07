# Edge of Vision — TA 포트폴리오 (모노크롬)

지각(perception)을 주제로 한 테크니컬 아트 포트폴리오.
히어로 타이틀은 **아나모픽 타이포그래피**로, 글자 조각들이 서로 다른
3D 평면에 흩어져 있다가 커서가 화면 정중앙(=올바른 시점)에 올 때만
한 문장으로 정렬됩니다. 배경의 점묘 성야는 1회만 그리는 정적 캔버스라
GPU 부하가 없습니다.

## 폴더 구조

```
portfolio/
├── index.html        # 페이지 골격 (이름/링크 수정: edit-me 검색)
├── css/style.css     # 모노크롬 디자인
├── js/main.js        # 성야 / 아나모픽 타이틀 / 목록 렌더러
├── data/content.js   # ★ 평소엔 이 파일만 수정 (PROJECTS / STUDY)
└── assets/works/     # 이미지·영상 쓸 일이 생기면 여기에
```

## 배포 (GitHub Pages, 웹에서)

1. github.com → `+` → New repository
   - 이름을 `아이디.github.io` 로 하면 주소가 깔끔
2. 저장소 첫 화면의 "uploading an existing file" 클릭
   → 이 폴더 **안의 내용물**을 드래그해 업로드 → Commit changes
3. Settings → Pages → Source `Deploy from a branch`,
   Branch `main` / `(root)` → Save
4. 1~2분 뒤 발급된 주소로 접속

## 내용 수정하는 법

- 항목 추가/수정: `data/content.js` 의 `PROJECTS`, `STUDY` 배열만 편집
  - 배열 맨 앞에 넣으면 위에 먼저 보임
  - `link` 를 `""` 로 두면 링크 없는 행으로 표시
- 이름·GitHub·이메일: `index.html` 에서 `edit-me` 검색해 교체
- 깃허브 웹에서도 파일 열어 연필 아이콘(Edit)으로 바로 수정 가능

## 성능/접근성

- 애니메이션은 CSS transform + rAF 하나뿐 (내장그래픽에서 매우 가벼움)
- `prefers-reduced-motion` 설정 시 타이틀이 정렬된 상태로 정지
- 터치 기기에서는 타이틀이 스스로 천천히 정렬↔분절을 반복
