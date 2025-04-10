import path from "node:path";

import { generateSwaggerApi } from "@/generator/generator.js";
import { GenerateApiParams } from "swagger-typescript-api";

export type GenerateApiParamsType = {
  httpClientType: "fetch" | "axios";
  instancePath: string;
};

export const runGenerateApi = async (params: GenerateApiParamsType) => {
  // @TODO: params mashup.config.ts 에서 가져오기
  const { httpClientType, instancePath } = params || {};

  generateSwaggerApi({
    modular: true,
    moduleNameFirstTag: false,
    typeSuffix: "Type",
    output: path.resolve(process.cwd(), "./src/__generated__"),
    url: "https://petstore.swagger.io/v2/swagger.json",
    httpClientType,
    hooks: {
      onPrepareConfig: (currentConfiguration) => {
        return {
          ...currentConfiguration,
          myConfig: {
            instancePath,
          },
        };
      },
    },
  });
};
