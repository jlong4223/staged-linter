# staged-linter

## Installation

    $ npm install staged-linter --save-dev

### package.json script

    "scripts": {
        "slintr": "staged-linter"
    }

### Usage

Eslint must be installed within you project. After you run `git add` on any of your files and before running `git commit`, you can run this package against your staged files. This pairs well with husky to automatically run `staged-linter` before you commit.

### Overview

This package will run eslint against all staged files.

It will quickly generate a `.txt` file with all of your staged files. This file will be read to obtain the list of files to lint, then eslint will be run against each file, and the results will be displayed in the terminal. The `.txt` file will be deleted after the linting is complete like it was never there to begin with.

![staged-linter](https://i.imgur.com/9H3Lnj8.png)
