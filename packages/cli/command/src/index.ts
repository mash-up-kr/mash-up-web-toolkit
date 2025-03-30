import figlet from "figlet";
import inquirer from "inquirer";
import { Command } from "commander";
import { Controller } from "./controller/controller";

console.log(figlet.textSync("Mash-Up Web CLI"));

const program = new Command();
const controller = new Controller();

program.version("0.0.1").description("Mash-Up Web CLI");

const choices = ["gen:api"];

inquirer
  .prompt([
    {
      name: "command",
      type: "list",
      message: "Select the command",
      choices,
      default: choices[0],
    },
  ])
  .then((answers) => {
    if (answers.command === "gen:api") {
      controller.genApi();
    }
  });

program.parse(process.argv);
