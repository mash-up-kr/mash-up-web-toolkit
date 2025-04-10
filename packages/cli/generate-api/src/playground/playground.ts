import fs from "node:fs";
import path from "node:path";
import { generateApi } from "swagger-typescript-api";
import { generateConfig } from "@/configs/generate-config.js";

async function playground() {
  const result = await generateApi({
    templates: generateConfig["CUSTOM_TEMPLATE_FOLDER"],
    modular: true,
    moduleNameFirstTag: false,
    typeSuffix: "Type",
    output: path.resolve(process.cwd(), "./src/generated"),
    url: "https://petstore.swagger.io/v2/swagger.json",
    httpClientType: "fetch",
    hooks: {
      onPrepareConfig: (currentConfiguration) => {
        return {
          ...currentConfiguration,
          myConfig: {
            // TODO: path 변경
            axiosInstancePath: "./src/generated/axios-instance.ts",
          },
        };
      },
    },
  });
}

playground();
