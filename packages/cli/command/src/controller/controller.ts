import { generateApi } from "@mash-up-web-toolkit/generate-api";

export class Controller {
  constructor() {}

  async genApi() {
    await generateApi();
  }
}
