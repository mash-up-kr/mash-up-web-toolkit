export type RouteObject = { [key: string]: string | RouteObject };

/**
 * URL 경로 세그먼트를 JS 객체 키로 사용하기에 안전한 형태로 변환합니다.
 * (e.g., 'user-profile' -> 'USER_PROFILE', '[id]' -> '_ID')
 * @param segment - 변환할 경로 세그먼트
 * @returns 변환된 객체 키
 */
function segmentToKey(segment: string) {
  let key = segment.toUpperCase().replace(/-/g, "_");

  if (key.startsWith("[") && key.endsWith("]")) {
    key = `_${key.slice(1, -1).replace("...", "")}`;
  }

  return key;
}

/**
 * URL 경로 배열을 길이와 알파벳 순서로 정렬합니다.
 * 짧은 경로가 먼저 오도록 하여 객체 생성 시 부모 경로가 먼저 처리되도록 보장합니다.
 * @param urlPaths - 정렬할 URL 경로 배열
 * @returns 정렬된 URL 경로 배열
 */
function sortPathsByLength(urlPaths: string[]) {
  return [...urlPaths].sort((a, b) => {
    return a.length - b.length || a.localeCompare(b);
  });
}

/**
 * 단일 URL 경로를 기존 경로 객체에 삽입하는 리듀서(reducer) 함수입니다.
 * 경로 세그먼트를 따라 객체를 탐색하며, 필요한 경우 새로운 중첩 객체를 생성합니다.
 * @param acc - 누적된 경로 객체 (accumulator)
 * @param urlPath - 삽입할 단일 URL 경로
 * @returns 업데이트된 경로 객체
 */
function insertPathIntoObject(acc: RouteObject, urlPath: string): RouteObject {
  if (urlPath === "/") {
    acc.ROOT = "/";
    return acc;
  }

  const segments = urlPath.split("/").filter(Boolean);

  segments.reduce((currentLevel, segment, index) => {
    const key = segmentToKey(segment);
    const isLastSegment = index === segments.length - 1;

    if (isLastSegment) {
      if (typeof currentLevel[key] === "object") {
        (currentLevel[key] as RouteObject).ROOT = urlPath;
      } else {
        currentLevel[key] = urlPath;
      }
    } else {
      if (typeof currentLevel[key] !== "object") {
        const existingValue = currentLevel[key] as string | undefined;
        currentLevel[key] = existingValue ? { ROOT: existingValue } : {};
      }
    }
    return currentLevel[key] as RouteObject;
  }, acc);

  return acc;
}

/**
 * URL 경로 배열을 받아 중첩된 경로 상수 객체로 변환합니다.
 * @param urlPaths - URL 경로 문자열의 배열
 * @returns 중첩된 경로 객체
 */
export function buildRouteObject(urlPaths: string[]): RouteObject {
  // 1. 경로를 정렬합니다.
  const sortedPaths = sortPathsByLength(urlPaths);

  // 2. 정렬된 경로를 순회하며 객체에 삽입합니다.
  return sortedPaths.reduce(insertPathIntoObject, {});
}
