import path from "node:path";
import { generateApi } from "swagger-typescript-api";
import { generateConfig } from "@/configs/generate-config.js";

async function playground() {
  const result = await generateApi({
    templates: path.resolve(
      process.cwd(),
      "./src/templates/swagger/custom-templates"
    ),
    modular: true,
    moduleNameFirstTag: false,
    typeSuffix: "Type",
    // output: path.resolve(process.cwd(), "./src/generated"),
    url: "https://petstore.swagger.io/v2/swagger.json",
    httpClientType: "fetch",
    hooks: {
      onPrepareConfig: (currentConfiguration) => {
        return {
          ...currentConfiguration,
          myConfig: {
            // TODO: path 변경
            instancePath: "./src/generated/axios-instance.ts",
          },
        };
      },
    },
  });

  return result;
}

const result = await playground();

console.log("#result", result);
