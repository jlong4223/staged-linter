#!/usr/bin/env node

let fs = require("fs");
let shell = require("shelljs");
const chalk = require("chalk");

let args;
[, , ...args] = process.argv;

// Check for user provided file and provide confirmation of file name
if (args.length !== 0) {
  console.log("Your provided file name is...", args);
}

// If the user doesnt provide a file to check, then one will be created
if (args.length === 0) {
  console.log(
    `No file provided, creating or using existing file: ${chalk.blue(
      "staged.txt"
    )}`
  );
  shell.exec("git diff --cached --name-only > staged.txt");
  args = ["staged.txt"];
}

// remove the provided args from the array
const files = args.shift();

console.log(`Checking ${chalk.blue(files)} for staged changes...`);

// Intitializing the readFileLines with the file
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
  console.log(chalk.green(`Linting in progress ===> ${stringFilesToCheck}`));

  const executableScript = `npx eslint ${stringFilesToCheck}`;
  shell.exec(executableScript);
  console.log(chalk.green("Linting complete"));
} else {
  console.log(chalk.red("No Staged Files Found - git add files and retry"));
}

console.log(chalk.green("Removing staged.txt..."));
shell.exec("rm -rf staged.txt");
