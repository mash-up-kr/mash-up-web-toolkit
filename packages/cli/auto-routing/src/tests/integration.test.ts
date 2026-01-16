import { describe, it, expect } from "vitest";
import path from "path";
import { findAppDirectory, getAllFilePaths } from "@/lib/file-system";
import { createUrlPath, filterRouteFiles } from "@/lib/routing";
import { buildRouteObject } from "@/lib/object";
import { generateRoutesCode } from "@/lib/codegen";

describe("auto-routing 통합 테스트 (실제 파일 시스템)", () => {
  it("my-playground 프로젝트의 라우팅 구조를 올바르게 분석하고 코드를 생성해야 합니다.", async () => {
    // 1. 프로젝트 루트 경로 설정
    // vitest는 CWD를 패키지 루트로 설정하므로, 모노레포 루트까지 올라가야 합니다.
    const projectRoot = path.join(
      __dirname,
      "../../../../../",
      "apps/my-playground",
    );

    // 2. `app` 디렉토리 경로 찾기
    const appDir = await findAppDirectory(projectRoot);
    expect(appDir).toBe(path.join(projectRoot, "src", "app"));

    // 3. `app` 디렉토리 순회하여 모든 파일 경로 가져오기
    const allFiles = await getAllFilePaths(appDir);

    // 4. 라우트 파일 식별 (Private folder는 여기서 제외됨)
    const routeFiles = filterRouteFiles(allFiles, appDir);

    // 5. URL 경로 생성
    const urlPaths = routeFiles.map((file) => createUrlPath(file, appDir));

    // 생성된 URL 경로가 예상과 일치하는지 확인 (순서 무관)
    const expectedPaths = [
      "/",
      "/blog/[slug]",
      "/dashboard/settings",
      "/landing",
      "/profile",
    ];
    expect(urlPaths).toHaveLength(expectedPaths.length);
    expect(urlPaths.sort()).toEqual(expectedPaths.sort());

    // 6. 경로 데이터를 구조화된 객체로 변환
    const routeObject = buildRouteObject(urlPaths);

    // 7. TypeScript 코드 생성
    const generatedCode = generateRoutesCode(routeObject);

    // 최종 생성된 코드가 예상과 일치하는지 확인
    const expectedCode = `export const ROUTES = {
  BLOG: {
    _SLUG: '/blog/[slug]'
  },
  DASHBOARD: {
    SETTINGS: '/dashboard/settings'
  },
  LANDING: '/landing',
  PROFILE: '/profile',
  ROOT: '/'
} as const;`;

    // 공백/줄바꿈을 무시하고 비교하기 위해 정규화
    const normalize = (str: string) => str.replace(/\s/g, "");
    expect(normalize(generatedCode)).toBe(normalize(expectedCode));
  }, 30000); // 파일 I/O가 있으므로 타임아웃을 넉넉하게 설정
});
