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

    return select ?? globalOptions?.public;
  };

  const findAll =
    (options: any = {}) =>
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      req[names] = await model.findMany({
        select: parse(options.select),
      });

      next();
    };

  const find =
    (path: string, options: any = {}) =>
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const [box, key] = req.parse(path);

      req[name] = await model.findUnique({
        where: {
          [key]: box[key],
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
        if (req[name] != null) {
          next();
        } else {
          next(404);
        }
      });
    };

  const persist =
    (options: any = {}) =>
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      try {
        req[name] = await model.upsert({
          create: req.validated,
          update: req.validated,
          where: { id: req.validated.id ?? 0 },
          select: parse(options.select),
        });
        next();
      } catch (err) {
        next(err);
      }
    };

  const destroy =
    (path: string) =>
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const [box, key] = req.parse(path);

      await model.delete({
        where: {
          [key]: box[key],
        },
      });

      next();
    };

  return {
    findAll,
    find,
    findOrFail,
    persist,
    destroy,
  };
};
