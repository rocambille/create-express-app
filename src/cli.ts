#!/usr/bin/env node

import { AfterHookOptions, create } from "create-create-app";
import { resolve } from "path";
import { copyFile, rename } from "fs/promises";

const templateRoot = resolve(__dirname, "..", "templates");

const caveat = ({ name }: AfterHookOptions) => `
We suggest that you begin by typing:

  cd ${name}
  edit .env
  npx prisma migrate dev --name init
  npm run dev

Happy hacking!
`;

// See https://github.com/uetchy/create-create-app/blob/master/README.md for other options.

create("create-express-app", {
  templateRoot,
  extra: {
    language: {
      type: "input",
      describe: "which language should be used for human readable content?",
      default: "en",
      prompt: "if-no-arg",
    },
  },
  after: async ({ packageDir }: AfterHookOptions) => {
    await copyFile(`${packageDir}/.env`, `${packageDir}/.env.sample`);
    await rename(
      `${packageDir}/.template.gitignore`,
      `${packageDir}/.gitignore`
    );
  },
  caveat,
});
