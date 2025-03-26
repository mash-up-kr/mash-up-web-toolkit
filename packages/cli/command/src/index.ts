import { Command } from "commander";
const figlet = require("figlet");

// 아스키 아트로 CLI 제목 출력
console.log(figlet.textSync("Mash-Up Web CLI"));

const program = new Command();

program.version("0.0.1").description("Mash-Up Web CLI");

// gen:api 명령어 추가
program
  .command("gen:api")
  .description("Generate API")
  .action(() => {
    console.log("Generating API...");
    // API 생성 로직 추가
  });

program.parse(process.argv);
