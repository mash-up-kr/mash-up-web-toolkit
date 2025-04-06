import path from "node:path";

import { generateSwaggerApi } from "@/generator/generator.js";
import { GenerateApiParams } from "swagger-typescript-api";

export type GenerateApiParamsType = GenerateApiParams;

export const runGenerateApi = async (params: GenerateApiParams) => {
  // @TODO: params mashup.config.ts 에서 가져오기
  generateSwaggerApi({
    url: "https://petstore.swagger.io/v2/swagger.json",
    output: path.resolve(process.cwd(), "./src/__generated__"),
    ...params,
  });
};
