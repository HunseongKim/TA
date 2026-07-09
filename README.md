# 미니멀 포트폴리오

흰 배경, 검은 글씨, 얇은 구분선만 있는 한 페이지 포트폴리오.
구성: 이름/소개/링크 → 프로젝트 → 공부한 내용.

## 폴더 구조

```
portfolio/
├── index.html        # 이름·소개·링크 수정 (edit-me 검색)
├── css/style.css
├── js/main.js
└── data/content.js   # ★ 평소엔 이 파일만 수정 (PROJECTS / STUDY)
```

## 배포 / 업데이트 (GitHub Pages)

- 처음: 저장소 만들기 → "uploading an existing file"로 이 폴더 **안의
  내용물** 업로드 → Settings → Pages → Branch `main` `(root)` → Save
- 갱신: Add file → Upload files 로 올리면 같은 이름은 덮어써짐
- 반영까지 1~3분. 안 바뀐 것 같으면 Ctrl+F5 또는 시크릿 창으로 확인

## 내용 수정

- 항목 추가/수정: `data/content.js` 의 `PROJECTS`, `STUDY` 배열만 편집
  - 맨 앞에 넣으면 위에 먼저 보임
  - `link: ""` 로 두면 링크 없는 항목
- 이름·소개·GitHub·이메일: `index.html` 에서 `edit-me` 검색해 교체
