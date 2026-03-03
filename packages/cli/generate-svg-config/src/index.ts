import { hasDependency } from "./utils/check-dependency.ts";
import { setupNextSvgr } from "./utils/next-config.ts";
import { setupViteSvgr } from "./utils/vite-config.ts";
import {
  createTypeDeclaration,
  updateTsConfigForNext,
} from "./utils/type-utils.ts";
import type { ProjectType } from "./types/project.ts";
import {
  installSvgrForNext,
  installVitePluginSvgr,
} from "./utils/pk-install.ts";

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

const completeMessage = (projectType: ProjectType) => {
  console.log("✅ SVG 설정이 완료되었습니다!");
  if (projectType === "vite") {
    console.log(
      "src 폴더 아래에 svg 파일을 추가한 후, import 시 파일 확장자 뒤에 ?react를 추가해주세요."
    );
    console.log("예시: import ReactLogo from './assets/react.svg?react';");
  } else {
    console.log(
      "src 폴더 혹은 app 폴더 아래에 svg 파일을 추가한 후 사용해주세요."
    );
    console.log("예시: import NextLogo from './next.svg';");
  }
};

export const runGenerateSvgConfig = async (): Promise<void> => {
  console.log("🚀 SVG 설정을 시작합니다...");

  const projectType = detectProjectType();
  const lang = detectLang();

  if (projectType === "unknown") {
    console.error("❌ Next.js 또는 Vite 프로젝트가 아닙니다.");
    return;
  }

  console.log(`📦 ${projectType.toUpperCase()} 프로젝트가 감지되었습니다.`);

  // 타입 선언 파일 생성
  if (lang === "ts") {
    createTypeDeclaration(projectType);
  }

  switch (projectType) {
    case "next": {
      await installSvgrForNext();
      console.log("✅ @svgr/webpack 설치 완료");
      setupNextSvgr(true);
      updateTsConfigForNext();
      completeMessage(projectType);
      break;
    }
    case "vite": {
      await installVitePluginSvgr();
      console.log("✅ vite-plugin-svgr 설치 완료");
      setupViteSvgr(lang);
      completeMessage(projectType);
      break;
    }
  }
};
