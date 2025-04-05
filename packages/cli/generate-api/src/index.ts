import { generateSwaggerApi } from "@/generator/generator.js";

export const runGenerateApi = async ({
  httpClientType,
}: {
  httpClientType: "fetch" | "axios";
}) => {
  generateSwaggerApi({
    url: "https://petstore.swagger.io/v2/swagger.json",
    httpClientType,
  });
};
