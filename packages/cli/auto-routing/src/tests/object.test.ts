import { describe, it, expect } from "vitest";
import { buildRouteObject } from "@/lib/object";

describe("object 유틸리티 함수 테스트", () => {
  describe("buildRouteObject", () => {
    it("URL 경로 목록을 중첩된 객체로 올바르게 변환해야 합니다.", () => {
      const urlPaths = ["/", "/dashboard", "/dashboard/settings", "/users"];

      const expected = {
        ROOT: "/",
        DASHBOARD: {
          ROOT: "/dashboard",
          SETTINGS: "/dashboard/settings",
        },
        USERS: "/users",
      };

      const result = buildRouteObject(urlPaths);
      expect(result).toEqual(expected);
    });

    it("동적 경로 `[id]`와 캐치-올 `[...slug]`를 올바르게 처리해야 합니다.", () => {
      const urlPaths = ["/blog", "/blog/[slug]", "/shop", "/shop/[...filters]"];

      const expected = {
        BLOG: {
          ROOT: "/blog",
          _SLUG: "/blog/[slug]",
        },
        SHOP: {
          ROOT: "/shop",
          _FILTERS: "/shop/[...filters]",
        },
      };

      const result = buildRouteObject(urlPaths);
      expect(result).toEqual(expected);
    });

    it("케밥-케이스(kebab-case) 경로를 스네이크-케이스(SNAKE_CASE) 키로 변환해야 합니다.", () => {
      const urlPaths = ["/user-profile", "/user-profile/change-password"];

      const expected = {
        USER_PROFILE: {
          ROOT: "/user-profile",
          CHANGE_PASSWORD: "/user-profile/change-password",
        },
      };

      const result = buildRouteObject(urlPaths);
      expect(result).toEqual(expected);
    });

    it("빈 경로 목록이 주어지면 빈 객체를 반환해야 합니다.", () => {
      const result = buildRouteObject([]);
      expect(result).toEqual({});
    });
  });
});
