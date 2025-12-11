import { describe, it, expect } from "vitest";
import { filterRouteFiles, createUrlPath } from "@/lib/routing";
import path from "path";

describe("routing 유틸리티 함수 테스트", () => {
  const appDir = "/project/src/app";

  describe("filterRouteFiles", () => {
    it("Next.js 라우트 파일(`page.tsx`, `route.ts` 등)만 필터링해야 합니다.", () => {
      const filePaths = [
        "/project/src/app/page.tsx",
        "/project/src/app/dashboard/page.jsx",
        "/project/src/app/api/health/route.ts",
        "/project/src/app/layout.tsx", // 라우트 파일이 아님
        "/project/src/app/components/Button.tsx", // 라우트 파일이 아님
        "/project/src/app/dashboard/template.js", // 라우트 파일이 아님
        "/project/src/app/_private/page.tsx", // Private Folder, 제외되어야 함
        "/project/src/app/not-a-page.ts",
      ];

      const expected = [
        "/project/src/app/page.tsx",
        "/project/src/app/dashboard/page.jsx",
        "/project/src/app/api/health/route.ts",
      ];

      const result = filterRouteFiles(filePaths, appDir);
      expect(result).toEqual(expected);
    });

    it("라우트 파일이 없는 경우 빈 배열을 반환해야 합니다.", () => {
      const filePaths = [
        "/project/src/app/layout.tsx",
        "/project/src/app/components/Button.tsx",
        "/project/src/app/dashboard/template.js",
      ];

      const result = filterRouteFiles(filePaths, appDir);
      expect(result).toEqual([]);
    });
  });

  describe("createUrlPath", () => {
    it("기본 경로를 올바르게 생성해야 합니다.", () => {
      const filePath = path.join(appDir, "dashboard", "settings", "page.tsx");
      expect(createUrlPath(filePath, appDir)).toBe("/dashboard/settings");
    });

    it('루트 경로 ("/")를 올바르게 생성해야 합니다.', () => {
      const filePath = path.join(appDir, "page.tsx");
      expect(createUrlPath(filePath, appDir)).toBe("/");
    });

    it("라우트 그룹 `(folder)`을 경로에서 제외해야 합니다.", () => {
      const filePath = path.join(appDir, "(marketing)", "about", "page.tsx");
      expect(createUrlPath(filePath, appDir)).toBe("/about");
    });

    it("중첩된 라우트 그룹을 경로에서 제외해야 합니다.", () => {
      const filePath = path.join(
        appDir,
        "(main)",
        "dashboard",
        "(overview)",
        "page.tsx",
      );
      expect(createUrlPath(filePath, appDir)).toBe("/dashboard");
    });

    it("동적 세그먼트 `[slug]`를 경로에 포함해야 합니다.", () => {
      const filePath = path.join(appDir, "blog", "[slug]", "page.tsx");
      expect(createUrlPath(filePath, appDir)).toBe("/blog/[slug]");
    });

    it("캐치-올 세그먼트 `[...slug]`를 경로에 포함해야 합니다.", () => {
      const filePath = path.join(appDir, "shop", "[...filters]", "page.tsx");
      expect(createUrlPath(filePath, appDir)).toBe("/shop/[...filters]");
    });
  });
});
