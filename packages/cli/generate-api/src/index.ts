import path from "node:path";

import {
  generateSwaggerApi,
  writeGeneratedApi,
} from "@/generator/generator.js";
import { generateApi } from "swagger-typescript-api";
import { generateConfig } from "./configs/generate-config.js";

export type GenerateApiParamsType = {
  httpClientType: "fetch" | "axios";
  instancePath?: string;
  url: string;
  output: string;
} & Parameters<typeof generateApi>[0];

export const runGenerateApi = async (params: GenerateApiParamsType) => {
  const { instancePath, output } = params || {};
  const result = await generateSwaggerApi({
    ...params,
    typeSuffix: "Type",
    addReadonly: true,
    output: false,
    moduleNameFirstTag: false,
    silent: true,
    modular: true,
    httpClientType: params.httpClientType,
    templates:
      params.httpClientType === "axios"
        ? generateConfig["CUSTOM_TEMPLATE_AXIOS"]
        : generateConfig["CUSTOM_TEMPLATE_FETCH"],
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

  await writeGeneratedApi(result, path.resolve(process.cwd(), output))
    .then(() => {
      console.log("✅ API 생성 완료! 🌈✨");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ API 읽기/쓰기 실패:", error);
      process.exit(1);
    });
};
