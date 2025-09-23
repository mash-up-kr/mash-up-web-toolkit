import path from "path";

const ROUTE_FILE_NAMES = [
  "page.js",
  "page.jsx",
  "page.ts",
  "page.tsx",
  "route.js",
  "route.jsx",
  "route.ts",
  "route.tsx",
];

/**
 * 전체 파일 경로 목록에서 Next.js 라우트 파일만 필터링합니다. (private 파일은 걸러냄)
 * @param filePaths - 절대 파일 경로의 배열
 * @param appDir - `app` 디렉토리의 절대 경로
 * @returns Next.js 라우트 파일만 포함된 경로 배열
 */
export function filterRouteFiles(
  filePaths: string[],
  appDir: string,
): string[] {
  return filePaths.filter((filePath) => {
    const fileName = path.basename(filePath);
    if (!ROUTE_FILE_NAMES.includes(fileName)) {
      return false;
    }

    // _로 시작하는 Private Folder는 경로에서 제외함.
    const relativePath = path.relative(appDir, filePath);
    const segments = relativePath.split(path.sep);

    return !segments.some((segment) => segment.startsWith("_"));
  });
}

/**
 * 파일 경로를 기반으로 웹 URL 경로를 생성합니다.
 * Next.js App Router의 규칙을 따릅니다.
 *
 * @param filePath - 변환할 라우트 파일의 절대 경로
 * @param appDir - `app` 디렉토리의 절대 경로
 * @returns 생성된 URL 경로 (예: /dashboard/settings)
 */
export function createUrlPath(filePath: string, appDir: string): string {
  // `app` 디렉토리로부터의 상대 경로를 구합니다. (예: dashboard/settings/page.tsx)
  const relativePath = path.relative(appDir, filePath);

  // 파일명을 제외한 디렉토리 경로를 구합니다. (예: dashboard/settings)
  const dirPath = path.dirname(relativePath);

  // Next.js는 `.` 디렉토리를 루트 `/`로 취급합니다.
  if (dirPath === ".") {
    return "/";
  }

  // 경로 세그먼트를 분리하고, 라우트 그룹 `(group)`을 필터링합니다.
  const segments = dirPath
    .split(path.sep)
    .filter((segment) => !/^\(.*\)$/.test(segment));

  return `/${segments.join("/")}`;
}
