import express from "express";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const queries = (
  name: keyof typeof prisma,
  globalOptions?: { hide: { [field: string]: any } }
) => {
  const model = prisma[name] as any;

  const capitalName = name.charAt(0).toUpperCase() + name.slice(1);
  const names = name.endsWith("y") ? `${name.slice(0, -1)}ies` : `${name}s`;

  const globalSelect = Object.keys(
    Prisma[`${capitalName}ScalarFieldEnum` as keyof typeof Prisma]
  )
    .filter(
      (key) =>
        !Object.keys(globalOptions?.hide as Object).find(
          (hiddenKey) => key === hiddenKey
        )
    )
    .reduce((select, key) => ({ ...select, [key]: true }), {});

  const from = (
    options: { expose?: any; select?: any; where?: any } = {},
    req: Express.Request
  ) => {
    const { expose, select, where, ...rest } = options;
    return {
      select: {
        ...globalSelect,
        ...req.select,
        ...select,
        ...expose,
      },
      where: {
        ...req.query.where,
        ...req.where,
        ...options.where,
      },
      ...rest,
    };
  };

  const findAll =
    (options: any = {}) =>
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      req[names] = await model.findMany(from(options, req));

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

      options.where = { ...options.where, [key]: box[key] };

      req[name] = await model.findUnique(from(options, req));

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
      options.where = { ...options.where, id: req.validated.id ?? 0 };
      options.create = options.update = req.validated;

      try {
        req[name] = await model.upsert(from(options, req));

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
