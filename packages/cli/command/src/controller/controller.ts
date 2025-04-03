import { runGenerateApi } from "@mash-up-web-toolkit/generate-api";

export class Controller {
  constructor() {}

  async genApi({ httpClientType }: { httpClientType: "fetch" | "axios" }) {
    await runGenerateApi({httpClientType});
  }
}
