/* =====================================================
   Shader Study 목록
   -----------------------------------------------------
   새 작품을 추가할 때는 이 파일만 수정하면 됩니다.
   배열 맨 앞에 추가하면 최신작이 먼저 보입니다.

   media: assets/works/ 폴더에 gif/mp4 파일을 넣고 경로 지정.
          비워두면("") 자동으로 플레이스홀더가 표시됩니다.
   ===================================================== */
const WORKS = [
  {
    week: "Week 03",
    title: "Voronoi 균열 디졸브",
    oneliner: "Voronoi 노이즈의 셀 경계를 균열 패턴으로 사용해, 가장자리부터 타들어가는 디졸브 셰이더.",
    learned: "임계값 하나로 자르면 경계가 딱딱해지는 문제 → smoothstep으로 소프트 엣지 + 경계 부근에 emissive 컬러를 얹어 해결.",
    tags: ["GLSL", "Voronoi", "Dissolve"],
    media: "",
    link: "https://github.com/YOUR_GITHUB_ID/shader-study"
  },
  {
    week: "Week 02",
    title: "도메인 워핑 흐름장",
    oneliner: "fbm 노이즈의 출력을 다시 좌표 입력으로 넣는 도메인 워핑으로, 연기처럼 흐르는 유체 느낌의 패턴 구현.",
    learned: "워핑을 2회 중첩하면 디테일은 늘지만 프레임이 급락 → 옥타브 수를 5→4로 줄이고 저주파 워핑만 2회 적용해 절충.",
    tags: ["GLSL", "fbm", "Domain Warping"],
    media: "",
    link: "https://github.com/YOUR_GITHUB_ID/shader-study"
  },
  {
    week: "Week 01",
    title: "SDF 기초 도형과 부드러운 결합",
    oneliner: "원·사각형 SDF를 정의하고 smooth minimum으로 도형이 젤리처럼 붙는 메타볼 효과 구현.",
    learned: "smin의 k값이 하드코딩이면 도형 크기가 바뀔 때 결합감이 깨짐 → 도형 반지름에 비례하도록 k를 정규화.",
    tags: ["GLSL", "SDF", "smin"],
    media: "",
    link: "https://github.com/YOUR_GITHUB_ID/shader-study"
  }
];
