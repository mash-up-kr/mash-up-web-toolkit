#!/usr/bin/env node

import path from "path";
import chalk from "chalk";
import { findRouteFiles, generateRouteCode } from "@/core/core";
import { saveFile } from "@/lib/file-system";

export interface RunAutoRoutingOptions {
  output: string;
}

/**
 * auto-routing CLI의 핵심 로직을 수행하는 메인 함수입니다.
 * @param options - CLI에서 전달된 옵션 객체
 */
export async function runAutoRouting(options: RunAutoRoutingOptions) {
  try {
    console.log(chalk.blue("🚀 auto-routing을 시작합니다..."));
    const projectRoot = process.cwd();

    // 1. Next.js app 파일 찾기
    const routeFiles = await findRouteFiles(projectRoot);

    // 2. 라우팅 코드 생성
    const generatedCode = await generateRouteCode(routeFiles, projectRoot);

    // 3. 저장할 파일 경로 생성
    const outputPath = path.resolve(projectRoot, options.output);

    // 4. 라우팅 코드 저장
    await saveFile(outputPath, generatedCode);

    console.log(
      chalk.green(`✅ 성공! 라우트 파일이 생성되었습니다: ${outputPath}`),
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        chalk.red(`❌ 실패! 오류가 발생했습니다: ${error.message}`),
      );
    } else {
      console.error(chalk.red(`❌ 실패! 오류가 발생했습니다.`));
    }

    process.exit(1);
  }
}
