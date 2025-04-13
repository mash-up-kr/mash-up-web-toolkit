import inquirer from "inquirer";
import { Controller } from "@/controller/controller.js";

export interface CommandHandler {
  execute(controller: Controller): Promise<void>;
}

class CommandFactory {
  private handlers: Record<string, CommandHandler> = {};

  constructor() {
    this.register("gen:api", new GenApiCommandHandler());
    this.register("gen:config", new GenConfigCommandHandler());
  }

  register(command: string, handler: CommandHandler) {
    this.handlers[command] = handler;
  }

  async executeCommand(commandName: string, controller: Controller) {
    const handler = this.handlers[commandName];

    if (!handler) {
      console.error(`❌ 명령어를 찾을 수 없습니다: ${commandName}`);
      return;
    }

    await handler.execute(controller);
  }
}

class GenApiCommandHandler implements CommandHandler {
  async execute(controller: Controller): Promise<void> {
    const { command } = await inquirer.prompt([
      {
        name: "command",
        type: "list",
        message: "HTTP 클라이언트를 선택해주세요",
        choices: ["fetch", "axios"],
        default: "fetch",
      },
    ]);
    const httpClientType = command as "fetch" | "axios";
    await controller.genApi({
      httpClientType,
    });
  }
}

class GenConfigCommandHandler implements CommandHandler {
  async execute(controller: Controller): Promise<void> {
    await controller.initConfig();
  }
}

export const commandFactory = new CommandFactory();
