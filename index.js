#! /usr/bin/env node
import { exec } from "child_process";
import meow from "meow";
import chalk from "chalk";
import inquirer from "inquirer";

const cli = meow(
  `
        Usage
            $ gris

        Options
            --yes, -y      Automatically accept warning
    `,
  {
    importMeta: import.meta,
    flags: {
      yes: {
        type: "boolean",
        alias: "y",
      },
    },
  }
);

function gris() {
  exec("rm -rf .git");
  console.log(chalk.bold.white("Removed .git repository."));
  exec("git init");
  console.log(chalk.bold.white("Initialized git repository."));
}

if (cli.flags.yes) {
  gris();
} else {
  await inquirer
    .prompt({
      name: "danger",
      type: "confirm",
      message:
        "WARNING: This tool will remove the .git repository. Are you sure to proceed?",
      default: false,
    })
    .then((answer) => {
      if (!answer.danger) {
        process.exit(1);
      } else gris();
    });
}
