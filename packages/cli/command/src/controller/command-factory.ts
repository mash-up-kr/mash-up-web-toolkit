import type { RunAutoRoutingOptions } from '@mash-up-web-toolkit/auto-routing';
import inquirer from 'inquirer';

import { Controller } from '@/controller/controller.js';

export interface CommandHandler {
  execute(controller: Controller): Promise<void>;
}

class CommandFactory {
  private handlers: Record<string, CommandHandler> = {};

  constructor() {
    this.register('gen:routes', new GenRoutesCommandHandler());
    this.register('gen:api', new GenApiCommandHandler());
    this.register('gen:config', new GenConfigCommandHandler());
    this.register('gen:api-config', new GenApiConfigCommandHandler());
    this.register('gen:svg-config', new GenSvgConfigCommandHandler());
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

class GenRoutesCommandHandler implements CommandHandler {
  async execute(controller: Controller): Promise<void> {
    const { output }: RunAutoRoutingOptions = await inquirer.prompt([
      {
        name: 'output',
        type: 'input',
        message: '파일의 저장 경로를 입력해주세요.',
        default: 'src/constants/routes.ts',
      },
    ]);
    await controller.genRoutes({ output });
  }
}

class GenApiConfigCommandHandler implements CommandHandler {
  async execute(controller: Controller): Promise<void> {
    const { command } = await inquirer.prompt([
      {
        name: 'command',
        type: 'list',
        message: 'HTTP 클라이언트를 선택해주세요',
        choices: ['fetch', 'axios'],
        default: 'fetch',
      },
    ]);
    const httpClientType = command as 'fetch' | 'axios';
    await controller.initApiConfig({ httpClientType });
  }
}

class GenApiCommandHandler implements CommandHandler {
  async execute(controller: Controller): Promise<void> {
    const { command } = await inquirer.prompt([
      {
        name: 'command',
        type: 'list',
        message: 'HTTP 클라이언트를 선택해주세요',
        choices: ['fetch', 'axios'],
        default: 'fetch',
      },
    ]);
    const httpClientType = command as 'fetch' | 'axios';
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

class GenSvgConfigCommandHandler implements CommandHandler {
  async execute(controller: Controller): Promise<void> {
    await controller.genSvgConfig();
  }
}

export const commandFactory = new CommandFactory();
