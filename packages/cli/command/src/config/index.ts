import { MashupConfig } from "@/types/types.js";

/**
 * 타입 안전성을 갖춘 설정 객체를 정의하는 헬퍼 함수
 *
 * @example
 * ```ts
 * // mashup.config.ts
 * import { defineConfig } from '@mash-up-web-toolkit/command';
 *
 * export default defineConfig({
 *   'gen:api': {
 *     output: './src/__generated__',
 *     url: 'https://example.com/api/swagger.json'
 *   }
 * });
 * ```
 */
export function defineConfig(config: MashupConfig): MashupConfig {
  return config;
}

// 설정 파일 로드 기능 (나중에 필요할 경우)
export async function loadConfig(configPath?: string): Promise<MashupConfig> {
  // 구현 예정
  return {} as MashupConfig;
}

// 설정 타입 내보내기 (다른 패키지에서 사용 가능)
export * from "../types/types.js";
