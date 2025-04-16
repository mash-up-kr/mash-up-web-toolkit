import path from "node:path";

import { generateSwaggerApi } from "@/generator/generator.js";
import { GenerateApiParams } from "swagger-typescript-api";
import { generateConfig } from "./configs/generate-config.js";

export type GenerateApiParamsType = {
  httpClientType: "fetch" | "axios";
  instancePath?: string;
  url: string;
} & GenerateApiParams;

// @TODO: generate 이후 파일 쓰기 추가하기
export const runGenerateApi = async (params: GenerateApiParamsType) => {
  const { instancePath } = params || {};
  const result = await generateSwaggerApi({
    ...params,
    templates:
      params.httpClientType === "axios"
        ? generateConfig["CUSTOM_TEMPLATE_AXIOS"]
        : generateConfig["CUSTOM_TEMPLATE_FETCH"],
    addReadonly: true,
    modular: true,
    moduleNameFirstTag: false,
    typeSuffix: "Type",
    output: path.resolve(process.cwd(), "./src/__generated__"),
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
