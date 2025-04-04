import figlet from "figlet";
import inquirer from "inquirer";
import { Command } from "commander";
import { Controller } from "./controller/controller";
import { commandFactory } from "./controller/command-factory";

export const welcome = () => {
  console.log(figlet.textSync("Mash-Up Web CLI"));
};

export const runPrompt = async () => {
  const choices = ["gen:config", "gen:api"];
  const controller = new Controller();

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
      commandFactory.executeCommand(answers.command, controller);
    });
};

export const main = async () => {
  welcome();

  const program = new Command();
  program
    .name("mash-up")
    .description("Mash-Up Web Toolkit CLI")
    .version("0.0.1");

  runPrompt();
  program.parse(process.argv);
};

main();
