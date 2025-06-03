/**
 * @title 깊은 부분 타입
 * @description 객체의 모든 프로퍼티를 부분 타입으로 변환하는 타입
 * 
 * @example
 * // 정상: 모든 필드가 optional
 * const obj1: DeepPartial<{ a: { b: string } }> = { a: { b: "test" } }; // OK
 * const obj2: DeepPartial<{ a: { b: string } }> = {}; // OK
 * const obj3: DeepPartial<{ a: { b: string } }> = { a: {} }; // OK
 * // 에러: 타입이 맞지 않는 경우
 * const obj4: DeepPartial<{ a: { b: string } }> = { a: { b: 123 } }; // Error
 * const obj5: DeepPartial<{ a: { b: string } }> = { a: 123 }; // Error
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
