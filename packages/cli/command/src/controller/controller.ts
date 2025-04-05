import { runGenerateApi } from "@mash-up-web-toolkit/generate-api";
import { initConfig as initializeConfig } from "@mash-up-web-toolkit/generate-config";
export class Controller {
  constructor() {}

  async genApi({ httpClientType }: { httpClientType: "fetch" | "axios" }) {
    await runGenerateApi({ httpClientType });
  }

  async initConfig() {
    initializeConfig();
  }
}
