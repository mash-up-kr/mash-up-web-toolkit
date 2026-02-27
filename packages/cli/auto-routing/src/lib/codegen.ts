import type { RouteObject } from "@/lib/object";

/**
 * RouteObject를 재귀적으로 순회하여 코드 문자열로 변환하는 헬퍼 함수입니다.
 * 생성된 코드는 일관성을 위해 키를 기준으로 알파벳순으로 정렬됩니다.
 * @param obj - 문자열로 변환할 RouteObject
 * @param indentLevel - 코드 들여쓰기 수준
 * @returns 객체의 내용을 나타내는 코드 문자열
 */
function objectToCodeString(obj: RouteObject, indentLevel: number): string {
  const indent = "  ".repeat(indentLevel);
  // 객체의 키를 알파벳순으로 정렬하여 항상 동일한 순서의 코드를 생성합니다.
  const entries = Object.entries(obj)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => {
      if (typeof value === "string") {
        return `${indent}${key}: '${value}'`;
      }
      return `${indent}${key}: {\n${objectToCodeString(
        value,
        indentLevel + 1,
      )}\n${indent}}`;
    });
  return entries.join(",\n");
}

/**
 * RouteObject를 `export const ROUTES = { ... } as const;` 형태의 TypeScript 코드로 변환합니다.
 * @param routeObject - 변환할 경로 객체
 * @returns 생성된 코드 문자열
 */
export function generateRoutesCode(routeObject: RouteObject): string {
  if (Object.keys(routeObject).length === 0) {
    return "export const ROUTES = {} as const;";
  }

  const objectContent = objectToCodeString(routeObject, 1);
  return `export const ROUTES = {\n${objectContent}\n} as const;`;
}
