import {
  GenerateApiParamsType,
  runGenerateApi,
} from "@mash-up-web-toolkit/generate-api";
import { initConfig as initializeConfig } from "@mash-up-web-toolkit/generate-config";
export class Controller {
  constructor() {}

  async genApi(params: GenerateApiParamsType) {
    await runGenerateApi(params);
  }

  async initConfig() {
    initializeConfig();
  }
}
