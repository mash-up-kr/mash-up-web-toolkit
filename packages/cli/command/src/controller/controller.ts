import {
  runAutoRouting,
  type RunAutoRoutingOptions,
} from '@mash-up-web-toolkit/auto-routing';
import { runGenerateApi } from '@mash-up-web-toolkit/generate-api';
import { initApiInstanceConfig } from '@mash-up-web-toolkit/generate-api-config';
import { initConfig as initializeConfig } from '@mash-up-web-toolkit/generate-config';
import { runGenerateSvgConfig } from '@mash-up-web-toolkit/generate-svg-config';

import { loadConfig } from '@/config/index.js';

export type GenApiParams = {
  httpClientType: 'fetch' | 'axios';
};

export class Controller {
  constructor() {}

  async genRoutes({ output }: RunAutoRoutingOptions) {
    await runAutoRouting({ output });
  }

  async genApi(params: GenApiParams) {
    const result = await loadConfig();
    const genApiConfig = result['gen:api'];
    await runGenerateApi({
      httpClientType: params.httpClientType,
      ...genApiConfig,
    });
  }

  async genSvgConfig() {
    await runGenerateSvgConfig();
  }

  async initConfig() {
    initializeConfig();
  }

  async initApiConfig(params: GenApiParams) {
    initApiInstanceConfig(params.httpClientType);
  }
}
