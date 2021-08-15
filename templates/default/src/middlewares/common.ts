import express from "express";

export const assertEquals =
  (path1: string, path2: string, statusOnFail: number = 500) =>
  (
    { trolley }: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const [source1, key1] = trolley.parse(path1);
    const [source2, key2] = trolley.parse(path2);

    if (source1[key1] === source2[key2]) {
      next();
    } else {
      next(statusOnFail);
    }
  };

export const carriage =
  (...middlewares: Function[]) =>
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    let failed = false;

    for (let i = 0; !failed && i < middlewares.length; ++i) {
      await middlewares[i](req, res, (err: any) => {
        if (err) {
          failed = true;
          next(err);
        }
      });
    }

    if (!failed) {
      next();
    }
  };

export const failIfExists =
  (path: string, status: number = 400) =>
  (
    { trolley }: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const [source, key] = trolley.parse(path);

    if (source[key] != null) {
      next(status);
    } else {
      next();
    }
  };

export const merge =
  (sourcePaths: string[], options?: { into?: string }) =>
  (
    { trolley }: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const [dest, destKey] = trolley.parse(options?.into ?? sourcePaths[0]);

    dest[destKey] = sourcePaths.reduce((acc, sourcePath) => {
      const [source, sourceKey] = trolley.parse(sourcePath);

      if (typeof source[sourceKey] === "object") {
        return { ...acc, ...source[sourceKey] };
      } else {
        return { ...acc, [sourceKey]: source[sourceKey] };
      }
    }, dest[destKey] ?? {});

    next();
  };

export const parseInt =
  (path: string) =>
  (
    { trolley }: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const [source, key] = trolley.parse(path);

    source[key] = global.parseInt(source[key]);

    next();
  };

export const send =
  (path: string, status: number = 200) =>
  ({ trolley }: express.Request, res: express.Response) => {
    const [source, key] = trolley.parse(path);

    const value = source[key];

    if (Array.isArray(value) || typeof value === "object") {
      res.status(status).json(value);
    } else {
      res.status(status).json({ [key]: value });
    }
  };

export const sendStatus =
  (status: number) => (req: express.Request, res: express.Response) => {
    res.sendStatus(status);
  };
