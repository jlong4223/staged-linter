#!/usr/bin/env node
"use strict";

const fs = require("fs");
const shell = require("shelljs");
const chalk = require("chalk");

const stagedFile = "staged.txt";
let args;
[, , ...args] = process.argv;

// Check for user provided file and provide confirmation of file name
if (args.length !== 0) {
  console.log(`Your provided file name is... ${args}`);
}

// If the user doesnt provide a file to check, then one will be created
if (args.length === 0) {
  console.log(
    `No file provided. Creating or using existing file: ${chalk.blue(
      stagedFile
    )}`
  );
  shell.exec(`git diff --cached --name-only > ${stagedFile}`);
  args = [stagedFile];
}

// remove the provided arguments from the array
const files = args.shift();
console.log(`Checking ${chalk.blue(files)} for staged changes...`);

const readFileLines = (filename) =>
  fs
    .readFileSync(filename)
    .toString("UTF8")
    .split("\n")
    .filter((file) => file.length > 0);

let arrOfFiles = readFileLines(files);

if (arrOfFiles.length !== 0) {
  console.log(`Staged Files Found: ${chalk.green(arrOfFiles)}`);

  let stringFilesToCheck = arrOfFiles.join(" ");
  console.log(
    chalk.blue(`Linting in progress >>>> 🕵️‍♂️ ${stringFilesToCheck} 👀`)
  );

  const executableScript = `npx eslint ${stringFilesToCheck}`;

  shell.exec(executableScript, (code, stdout, stderr) => {
    let exitCode = code;

    if (exitCode !== 0) console.log(`${chalk.red(stderr)}`);

    if (stdout) exitCode = 1;

    if (!stdout) console.log(`${chalk.green("No errors found 🏆")}`);

    shell.exit(exitCode);
  });

  console.log(chalk.green("Linting complete ✅"));
} else {
  console.log(chalk.red("No Staged Files Found - git add files and retry"));
}

// Remove the generated file - this will not remove a file created by the user if they passed one as an argument
if (files === stagedFile) {
  console.log(chalk.italic.green(`Removing generated file: ${stagedFile}`));
  shell.exec(`rm -rf ${stagedFile}`);
}
