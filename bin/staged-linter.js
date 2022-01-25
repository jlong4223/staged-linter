#!/usr/bin/env node
"use strict";

const fs = require("fs");
const shell = require("shelljs");
const chalk = require("chalk");
const { spawn } = require("child_process");

const stagedFileName = "staged.txt";
let providedUserArgs;
[, , ...providedUserArgs] = process.argv;

// Check for user provided file and provide confirmation of file name
if (providedUserArgs.length !== 0) {
  providedUserArgs = providedUserArgs[0];
  console.log(`Your provided file name is... ${providedUserArgs}`);
}

// If the user doesnt provide a file to check, then one will be created
if (providedUserArgs.length === 0) {
  console.log(`Creating or using existing file: ${chalk.blue(stagedFileName)}`);
  shell.exec(`git diff --cached --name-only > ${stagedFileName}`);
  providedUserArgs = stagedFileName;
}

console.log(`Checking ${chalk.blue(providedUserArgs)} for staged changes...`);

const readFileLines = (filename) =>
  fs
    .readFileSync(filename)
    .toString("UTF8")
    .split("\n")
    .filter((file) => file.length > 0);

const arrayOfStagedFiles = readFileLines(providedUserArgs);

if (arrayOfStagedFiles.length !== 0) {
  console.log(`Staged Files Found: ${chalk.green(arrayOfStagedFiles)}`);

  let stringsOfStagedFiles = arrayOfStagedFiles.join(" ");
  console.log(
    chalk.blue(`Linting in progress >>>> 🕵️‍♂️ ${stringsOfStagedFiles} 👀`)
  );

  const executableScript = `npx eslint ${stringsOfStagedFiles}`;

  const eslint = spawn(executableScript, {
    shell: true,
    stdio: "inherit",
  });

  eslint.on("close", (code) => {
    if (code === 0) {
      console.log(chalk.green("✅  ESLint Passed  🏆"));
    } else {
      console.log(chalk.red("🚨  ESLint Failed"));
      shell.exit(1);
    }
  });

  eslint.on("error", (err) => {
    console.log(chalk.red(err));
    shell.exit(1);
  });
} else {
  console.log(chalk.red("No Staged Files Found - git add files and retry"));
}

console.log(chalk.green("Linting complete ✅"));

if (providedUserArgs === stagedFileName) {
  console.log(chalk.italic.green(`Removing generated file: ${stagedFileName}`));
  shell.exec(`rm -rf ${stagedFileName}`);
}
