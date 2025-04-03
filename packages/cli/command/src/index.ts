import figlet from "figlet";
import inquirer from "inquirer";
import { Command } from "commander";
import { Controller } from "./controller/controller";

export const welcome = () => {
  console.log(figlet.textSync("Mash-Up Web CLI"));
};

export const main = async () => {
  welcome();

  const program = new Command();
  const controller = new Controller();
  const choices = ["gen:api"];

  program.version("0.0.1").description("Mash-Up Web CLI");

  inquirer
    .prompt([
      {
        name: "command",
        type: "list",
        message: "명령을 선택해주세요.",
        choices,
        default: choices[0],
      },
    ])
    .then((answers) => {
      if (answers.command === "gen:api") {
        inquirer
          .prompt([
            {
              name: "command",
              type: "list",
              message: "REST Client를 선택해주세요.",
              choices: ["fetch", "axios"],
              default: "fetch",
            },
          ])
          .then((answers) => {
            const httpClientType = answers.command as "fetch" | "axios";
            controller.genApi({ httpClientType });
          });
      }
    });

  program.parse(process.argv);
};

main();
