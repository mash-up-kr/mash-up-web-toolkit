import { Command } from 'commander';
import figlet from 'figlet';
import inquirer from 'inquirer';

import { commandFactory } from '@/controller/command-factory.js';
import { Controller } from '@/controller/controller.js';

// config 모듈 내보내기
export type { MashupConfig } from './types/types.js';

const controller = new Controller();

export const main = async () => {
  welcome();

  const program = new Command();
  setupCliCommands(program);

  if (process.argv.length <= 2) {
    runInteractiveMode();
  } else {
    program.parse(process.argv);
  }
};

main();

export const setupCliCommands = (program: Command) => {
  program
    .name('mash-up')
    .description('Mash-Up Web Toolkit CLI')
    .version('0.0.1');

  program
    .command('gen:api')
    .description('API 코드를 생성합니다')
    .option(
      '-t, --type <type>',
      'HTTP 클라이언트 타입 (fetch 또는 axios)',
      'fetch'
    )
    .action(async options => {
      const httpClientType = options.type as 'fetch' | 'axios';
      await controller.genApi({ httpClientType });
    });

  program
    .command('gen:config')
    .description('설정 파일을 생성합니다')
    .action(async () => {
      await controller.initConfig();
    });

  program
    .command('gen:api-config')
    .description('API instance 파일을 생성합니다')
    .option(
      '-t, --type <type>',
      'HTTP 클라이언트 타입 (fetch 또는 axios)',
      'fetch'
    )
    .action(async options => {
      const httpClientType = options.type as 'fetch' | 'axios';
      await controller.initApiConfig({ httpClientType });
    });
};

export const runInteractiveMode = async () => {
  const choices = ['gen:config', 'gen:api-config', 'gen:api'];

  inquirer
    .prompt([
      {
        name: 'command',
        type: 'list',
        message: '명령을 선택해주세요.',
        choices,
        default: choices[0],
      },
    ])
    .then(answers => {
      commandFactory.executeCommand(answers.command, controller);
    });
};

export const welcome = () => {
  console.log(figlet.textSync('Mash-Up Web CLI'));
};
