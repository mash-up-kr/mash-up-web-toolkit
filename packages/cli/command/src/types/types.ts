export interface ApiSourceConfig {}

export interface ApiConfig {}

export interface MashupConfig {
  api: ApiConfig;
}

export type DefineConfigFn = (config: MashupConfig) => MashupConfig;
