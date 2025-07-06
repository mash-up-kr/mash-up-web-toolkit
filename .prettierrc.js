/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  useTabs: false, // 탭 대신 공백 사용
  arrowParens: 'avoid', // 화살표 함수 매개변수 괄호 생략
  bracketSameLine: false, // JSX 태그의 > 를 다음 줄에 위치
  bracketSpacing: true, // 객체 리터럴 중괄호 안에 공백 추가
  endOfLine: 'lf', // 줄바꿈 문자 설정 (lf: Unix 스타일)
  jsxSingleQuote: false, // JSX에서 작은 따옴표 사용
  printWidth: 80, // 줄 길이 제한 (80자)
  proseWrap: 'preserve', // 코드 주석 맟 마크다운 파일의 원본 줄 바꿈 유지
  quoteProps: 'as-needed', // 객체 키에 필요할 때만 따옴표
  semi: true, // 세미콜론 사용 (일반적으로 JavaScript/TypeScript에서 권장)
  singleQuote: true, // 작은 따옴표 사용 (일반적으로 JavaScript/TypeScript에서 권장)
  tabWidth: 2, // 탭 너비 설정 (2칸 들여쓰기)
  trailingComma: 'es5', // 배열이나 객체 리터럴 끝에 콤마 추가
};

export default config;
