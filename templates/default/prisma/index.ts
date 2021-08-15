import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const queries = (
  name: string,
  globalOptions?: { public?: { [field: string]: boolean } }
) => {
  const model = Object(prisma)[name];

  const names = name.endsWith("y") ? `${name.slice(0, -1)}ies` : `${name}s`;

  const parse = (select?: { [field: string]: boolean } | string) => {
    if (select === "*") {
      return null;
    }

    if (select == null) {
      return globalOptions?.public ?? {};
    }

    return select;
  };

  const findAll =
    (options: any = {}) =>
    async (
      { trolley }: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      trolley[names] = await model.findMany({
        select: parse(options.select),
      });

      next();
    };

  const find =
    (path: string, options: any = {}) =>
    async (
      { trolley }: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const [source, field] = trolley.parse(path);

      trolley[name] = await model.findUnique({
        where: {
          [field]: source[field],
        },
        select: parse(options.select),
      });

      next();
    };

  const findOrFail =
    (path: string, options: any = {}) =>
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      await find(path, options)(req, res, () => {
        if (req.trolley[name] != null) {
          next();
        } else {
          next(404);
        }
      });
    };

  const persist =
    (options: any = {}) =>
    async (
      { trolley }: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      try {
        trolley[name] = await model.upsert({
          create: trolley.validated,
          update: trolley.validated,
          where: { id: trolley.validated.id ?? 0 },
          select: parse(options.select),
        });
        next();
      } catch (err) {
        next(err);
      }
    };

  return {
    findAll,
    find,
    findOrFail,
    persist,
  };
};
