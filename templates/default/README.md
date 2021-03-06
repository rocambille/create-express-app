# {{name}}

{{description}}

> crafted using [create-express-app](https://github.com/rocambille/create-express-app).

## Quick Overview

Here is a non-exhaustive view of the directory structure:

```
.
├── .env                    # Environment variables (ignored by git)
├── prisma                  # See https://www.prisma.io/docs/concepts if you're unfamiliar with prisma
│   ├── client.ts           # Prisma client (use it only for custom queries, see src/middlewares/queries.ts for common queries)
│   └── schema.prisma       # Database schema
└── src
    ├── app.ts              # App configuration
    ├── middlewares
    │   ├── common.ts
    │   ├── queries.ts      # ORM configuration
    │   └── validate.ts     # Data validation using [validatorjs](https://www.npmjs.com/package/validatorjs)
    ├── pipes               # Middleware sequences
    │   └── auth.ts         # Auth configuration
    └── routes
        ├── auth.ts
        └── index.ts
```

## Built-in commands

```bash
npm run dev # Runs the app in development mode
```

```bash
npm run build  # Builds the app for production
```
