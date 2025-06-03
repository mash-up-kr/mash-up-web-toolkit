
/**
 * @title 배열 병합
 * @description 두 배열을 병합하여 새로운 배열을 반환합니다.
 * @param a 병합할 첫 번째 배열
 * @param b 병합할 두 번째 배열
 * @returns 병합된 배열
 * 
 * @example
 * const a = [1, 2, 3];
 * const b = [4, 5, 6];
 * const result = merge(a, b);
 * console.log(result); // [1, 2, 3, 4, 5, 6]
 */

export function merge<T>(a: T[], b: T[]): T[] {
  return [...a, ...b];
}
