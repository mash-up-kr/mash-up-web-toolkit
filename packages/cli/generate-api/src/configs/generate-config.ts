import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateConfig = {
  CUSTOM_TEMPLATE_AXIOS: path.resolve(
    __dirname,
    "templates/swagger/custom-axios"
  ),
  CUSTOM_TEMPLATE_FETCH: path.resolve(
    __dirname,
    "templates/swagger/custom-fetch"
  ),
};
