#! /usr/bin/env node
import { exec, execSync } from "child_process";
import meow from "meow";
import chalk from "chalk";
import inquirer from "inquirer";

const cli = meow(
  `
        Usage
            $ gris

        Options
            --yes, -y      Automatically accept warning
            --remote, -r   Change the origin remote to https://github.com/{options}

        Examples
          $ gris -y
          $ gris wheredidhugo/gris -r
    `,
  {
    importMeta: import.meta,
    flags: {
      yes: {
        type: "boolean",
        alias: "y",
      },
      remote: {
        type: "string",
        alias: "r",
      },
    },
  }
);

function remove() {
  exec("rm -rf .git");
  console.log(chalk.bold.white("Removed .git repository."));
  exec("git init");
  console.log(chalk.bold.white("Initialized git repository."));
}

function remote(link) {
  try {
    execSync(`git remote add origin https://github.com/${link}`);
  } catch (err) {
    execSync(`git remote set-url origin https://github.com/${link}`);
  }
  console.log(
    chalk.bold.white(
      `Changed the link of the remote git repository link to ${link}.`
    )
  );
}

if (cli.flags.remote !== "") {
  remote(cli.flags.remote);
} else if (cli.flags.yes) {
  remove();
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
      } else remove();
    });
}
