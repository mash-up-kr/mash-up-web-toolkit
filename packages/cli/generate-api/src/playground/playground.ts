import path from "node:path";
import { generateApi } from "swagger-typescript-api";
import { generateConfig } from "@/configs/generate-config.js";
import { writeGeneratedApi } from "@/generator/generator.js";

async function playground() {
  const result = await generateApi({
    templates: path.resolve(
      process.cwd(),
      "./src/templates/swagger/custom-axios"
    ),
    modular: true,
    // moduleNameFirstTag: true,
    typeSuffix: "Type",
    // output: path.resolve(process.cwd(), "./src/generated"),
    url: "https://petstore.swagger.io/v2/swagger.json",
    // url: "https://api.doongdoong.org/v3/api-docs",
    // httpClientType: "fetch",
    httpClientType: "axios",
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
await writeGeneratedApi(result, path.resolve(process.cwd(), "./src/generated"));

// console.log("#result", result);
