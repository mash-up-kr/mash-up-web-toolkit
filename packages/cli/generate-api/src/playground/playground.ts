import fs from "node:fs";
import path from "node:path";
import { generateApi } from "swagger-typescript-api";

function playground() {
  generateApi({
    output: path.resolve(process.cwd(), "./src/generated"),
    url: "https://petstore.swagger.io/v2/swagger.json",
    httpClientType: "fetch",
  });
}

playground();
