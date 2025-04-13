import { loadConfig } from "@/config/index.js";
import { runGenerateApi } from "@mash-up-web-toolkit/generate-api";
import { initConfig as initializeConfig } from "@mash-up-web-toolkit/generate-config";

export type GenApiParams = {
  httpClientType: "fetch" | "axios";
};
export class Controller {
  constructor() {}

  async genApi(params: GenApiParams) {
    const result = await loadConfig();
    const genApiConfig = result["gen:api"];
    await runGenerateApi({
      httpClientType: params.httpClientType,
      ...genApiConfig,
    });
  }

  async initConfig() {
    initializeConfig();
  }
}
