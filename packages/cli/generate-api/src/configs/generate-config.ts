import { resolve } from "path";

export const generateConfig = {
  CUSTOM_TEMPLATE_FOLDER: resolve(
    process.cwd(),
    "src/templates/swagger/custom-templates"
  ),
};
