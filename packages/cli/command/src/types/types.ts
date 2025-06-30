export interface GenApiConfig {
  /**
   * @description 생성될 파일의 경로
   */
  output: string;

  /**
   * @description 생성할 API의 주소
   */
  url: string;

  /**
   * @description 생성할 API의 입력 파일
   */
  input?: string;

  /**
   * @description fetch 또는 axios 인스턴스 경로
   */
  instancePath?: string;

  /**
   * @description httpClient 덮어쓰기 여부 (true: 덮어쓰기, false: 기존 파일 사용)
   */
  httpClientRewrite?: boolean;
}

export interface MashupConfig {
  "gen:api": GenApiConfig;
  [key: string]: any;
}
