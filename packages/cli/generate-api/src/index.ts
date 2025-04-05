import path from "node:path";

import { generateSwaggerApi } from "@/generator/generator.js";

export const runGenerateApi = async ({
  httpClientType,
}: {
  httpClientType: "fetch" | "axios";
}) => {
  // @TODO: params mashup.config.ts 에서 가져오기
  generateSwaggerApi({
    url: "https://petstore.swagger.io/v2/swagger.json",
    httpClientType,
    output: path.resolve(process.cwd(), "./src/__generated__"),
  });
};
