#!/usr/bin/env node

import { Command } from "commander";
import path from "path";
import chalk from "chalk";
import { findRouteFiles, generateRouteCode } from "@/core/core";
import { saveFile } from "@/lib/file-system";

interface RunAutoRoutingOptions {
  output: string;
}

/**
 * auto-routing CLI의 핵심 로직을 수행하는 메인 함수입니다.
 * @param options - CLI에서 전달된 옵션 객체
 */
async function runAutoRouting(options: RunAutoRoutingOptions) {
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

/**
 * CLI 애플리케이션의 메인 진입점 함수입니다.
 */
const main = async () => {
  const program = new Command();

  program
    .version("0.0.1", "-v, --version", "auto-routing 버전 출력")
    .command("generate")
    .description(
      "Next.js App Router 프로젝트의 라우팅 구조를 분석하여 Routing 파일을 생성합니다.",
    )
    .option(
      "-o, --output <path>",
      "생성된 파일의 저장 경로",
      "src/constants/routes.ts",
    )
    .action(runAutoRouting);

  await program.parseAsync(process.argv);
};

main();
