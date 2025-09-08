import { runGenerateApi } from '@mash-up-web-toolkit/generate-api';
import { initHttpClientConfig } from '@mash-up-web-toolkit/generate-api-config';
import { initConfig as initializeConfig } from '@mash-up-web-toolkit/generate-config';

import { loadConfig } from '@/config/index.js';

export type GenApiParams = {
  httpClientType: 'fetch' | 'axios';
};
export class Controller {
  constructor() {}

  async genApi(params: GenApiParams) {
    const result = await loadConfig();
    const genApiConfig = result['gen:api'];
    await runGenerateApi({
      httpClientType: params.httpClientType,
      ...genApiConfig,
    });
  }

  async initConfig() {
    initializeConfig();
  }

  async initApiConfig(params: GenApiParams) {
    initHttpClientConfig(params.httpClientType);
  }
}
