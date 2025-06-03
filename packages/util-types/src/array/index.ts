/**
 * @title 비어있지 않은 배열
 * 
 * @description 비어있지 않은 배열을 나타내는 타입
 *
 * @example
 * const arr: NonEmptyArray<string> = ["test"]; // OK
 * const arr: NonEmptyArray<number> = []; // Error: 빈 배열은 허용되지 않음
 */
export type NonEmptyArray<T> = [T, ...T[]];
