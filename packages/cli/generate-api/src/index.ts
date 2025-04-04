import path from "node:path";
import { generateApi } from "swagger-typescript-api";
import { generateSwaggerApi } from "./handler/handler.js";

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
