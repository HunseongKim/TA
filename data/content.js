/* =====================================================
   사이트 내용은 이 파일 하나만 수정하면 됩니다.
   -----------------------------------------------------
   PROJECTS : 프로젝트 (완성도 있는 결과물)
   STUDY    : 공부한 내용 (스터디 로그, 짧은 실험)

   각 항목의 link 는 GitHub 저장소·데모·글 어디든 가능.
   비워두면("") 클릭되지 않는 행으로 표시됩니다.
   배열 맨 앞에 추가하면 위에 먼저 보입니다.
   ===================================================== */

const PROJECTS = [
  {
    title: "Fovea — 시선 반응형 셰이더 배경",
    desc: "커서를 중심시(fovea)로 삼아 주변시 영역의 디테일이 감쇠하는 WebGL 프래그먼트 셰이더. foveated rendering 개념의 웹 구현.",
    tags: ["WebGL", "GLSL", "Perception"],
    meta: "2026",
    link: "https://github.com/YOUR_GITHUB_ID/shader-study"
  },
  {
    title: "Voronoi 균열 디졸브 셰이더",
    desc: "Voronoi 셀 경계를 균열 패턴으로 사용해 가장자리부터 타들어가는 디졸브. smoothstep 소프트 엣지와 emissive 경계 처리.",
    tags: ["GLSL", "ShaderToy"],
    meta: "2026",
    link: "https://github.com/YOUR_GITHUB_ID/shader-study"
  }
];

const STUDY = [
  {
    title: "도메인 워핑과 fbm 노이즈",
    desc: "노이즈 출력을 좌표 입력으로 되먹이는 도메인 워핑. 옥타브 수와 프레임 비용의 트레이드오프 실험.",
    meta: "Week 02",
    link: "https://github.com/YOUR_GITHUB_ID/shader-study"
  },
  {
    title: "SDF 기초와 smooth minimum",
    desc: "원·사각형 SDF 정의, smin으로 메타볼처럼 붙는 결합. k값을 도형 반지름에 비례하도록 정규화.",
    meta: "Week 01",
    link: "https://github.com/YOUR_GITHUB_ID/shader-study"
  },
  {
    title: "The Book of Shaders 노트",
    desc: "shaping functions, 색 공간, 2D 행렬 변환 파트 정리.",
    meta: "ongoing",
    link: ""
  }
];
