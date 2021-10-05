
# Getting Started with Create Express App

Set up a modern express app by running one command.

[create-create-app](https://github.com/uetchy/create-create-app)

## Installation

Install my-project with npm

```bash
  npx @rocambille/create-express-app@latest <name>
  cd <name>
```

![Alt text](bashScreen.png)

    
## Directory Structure

```
.
├── .env                    #Declare default environment variables, auomatically added on git ignore.
├── index.ts 
├── prisma
│     ├── index.ts          #Wrote functions that we will use on other files
│     └── schema.prisma
|
└── src
|   ├── app.ts              #App configuration
|
├── middlewares
|     ├── auth.ts           #Auth config with middleware functions
│     ├── common.ts
│     ├── queries.ts
│     └── validate.ts
|
├── routes                  #Routes for login and registration.
│     ├── auth.ts
│     └── index.ts
|
└── series
      └ ── auth.ts          #Register (failIfExists) and login (findOrFail) functions
```

  
## Tech Stack

**Server:** Typescript, Prisma, Node, Express
**Packages npm:** express, prisma, ts-node, argon2, jsonwebtoken, validatorjs, nodemon.

  
## Deployment

To deploy this project run

```bash
  npm run dev #Creates a source map and doesn't minify your js/css which makes it easier to debug and find errors out
```

```bash
  npm run build  #Runs the build field from the .package.json scripts field.
```

## Running Tests

To run tests, run the following command

```bash
  npm run test
```

## License

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://choosealicense.com/licenses/mit/)