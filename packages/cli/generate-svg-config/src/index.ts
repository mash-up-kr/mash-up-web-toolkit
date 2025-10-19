import { hasDependency } from "./utils/check-dependency.ts";
import { setupNextSvgr } from "./utils/next-config.ts";
import { setupViteSvgr } from "./utils/vite-config.ts";
import {
  createTypeDeclaration,
  updateTsConfigForNext,
} from "./utils/type-utils.ts";
import type { ProjectType } from "./types/project.ts";

const detectProjectType = (): ProjectType => {
  if (hasDependency("next")) {
    return "next";
  }
  if (hasDependency("vite")) {
    return "vite";
  }
  return "unknown";
};

const detectLang = (): "ts" | "js" => {
  if (hasDependency("typescript")) {
    return "ts";
  }
  return "js";
};

export const initSvgConfig = (): void => {
  console.log("🚀 SVG 설정을 시작합니다...");

  const projectType = detectProjectType();
  const lang = detectLang();

  if (projectType === "unknown") {
    console.error("❌ Next.js 또는 Vite 프로젝트가 아닙니다.");
    return;
  }

  console.log(`📦 ${projectType.toUpperCase()} 프로젝트가 감지되었습니다.`);

  switch (projectType) {
    case "next": {
      setupNextSvgr(true);
      updateTsConfigForNext();
      break;
    }
    case "vite": {
      setupViteSvgr(lang);
      break;
    }
  }

  if (lang === "ts") {
    createTypeDeclaration(projectType);
  }

  console.log("✅ SVG 설정이 완료되었습니다!");
};
