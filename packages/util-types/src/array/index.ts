/**
 * @title 비어있지 않은 배열
 * @description 비어있지 않은 배열을 나타내는 타입
 * @example
 * const arr: NonEmptyArray<string> = ["test"]; // OK
 * const arr: NonEmptyArray<number> = []; // Error
 */
export type NonEmptyArray<T> = [T, ...T[]];
