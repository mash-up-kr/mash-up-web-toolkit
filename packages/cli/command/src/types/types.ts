export interface GenApiConfig {
  output: string;
  url: string;
  input?: string;
  httpClientType?: "axios" | "fetch";
}

export interface MashupConfig {
  "gen:api": GenApiConfig;

  [key: string]: any;
}

export type DefineConfigFn = (config: MashupConfig) => MashupConfig;
