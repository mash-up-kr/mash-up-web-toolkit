import { describe, it, expect } from "vitest";
import { generateRoutesCode } from "@/lib/codegen";
import type { RouteObject } from "@/lib/object";

describe("codegen 유틸리티 함수 테스트", () => {
  describe("generateRoutesCode", () => {
    it("중첩된 RouteObject를 올바른 TypeScript 코드로 변환해야 합니다.", () => {
      const routeObject: RouteObject = {
        ROOT: "/",
        DASHBOARD: {
          ROOT: "/dashboard",
          SETTINGS: "/dashboard/settings",
        },
        USER_PROFILE: "/user-profile",
      };

      const expectedCode = `export const ROUTES = {
  DASHBOARD: {
    ROOT: '/dashboard',
    SETTINGS: '/dashboard/settings'
  },
  ROOT: '/',
  USER_PROFILE: '/user-profile'
} as const;`;

      const result = generateRoutesCode(routeObject);
      expect(result).toBe(expectedCode);
    });

    it("빈 RouteObject가 주어지면 빈 객체 코드를 반환해야 합니다.", () => {
      const routeObject: RouteObject = {};
      const expectedCode = "export const ROUTES = {} as const;";
      const result = generateRoutesCode(routeObject);
      expect(result).toBe(expectedCode);
    });
  });
});
