#!/usr/bin/env node
"use strict";

const fs = require("fs");
const shell = require("shelljs");
const chalk = require("chalk");
const { spawn } = require("child_process");

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

if (files === stagedFile) {
  console.log(chalk.italic.green(`Removing generated file: ${stagedFile}`));
  shell.exec(`rm -rf ${stagedFile}`);
}
