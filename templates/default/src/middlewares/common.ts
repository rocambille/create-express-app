import express from "express";

export const assertEquals =
  (path1: string, path2: string, statusOnFail: number = 500) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const [box1, key1] = req.parse(path1);
    const [box2, key2] = req.parse(path2);

    if (box1[key1] === box2[key2]) {
      next();
    } else {
      next(statusOnFail);
    }
  };

export const failIfExists =
  (path: string, status: number = 400) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const [box, key] = req.parse(path);

    if (box[key] != null) {
      next(status);
    } else {
      next();
    }
  };

export const log =
  (path: string) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const [box, key] = req.parse(path);

    console.log(box[key]);

    next();
  };

export const merge =
  (paths: string[], options?: { into?: string }) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const [inbox, inkey] = req.parse(options?.into ?? paths[0]);

    inbox[inkey] = paths.reduce((acc, path) => {
      const [outbox, outkey] = req.parse(path);

      if (typeof outbox[outkey] === "object") {
        return { ...acc, ...outbox[outkey] };
      } else {
        return { ...acc, [outkey]: outbox[outkey] };
      }
    }, inbox[inkey] ?? {});

    next();
  };

export const parseInt =
  (path: string) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const [box, key] = req.parse(path);

    box[key] = global.parseInt(box[key]);

    next();
  };

export const send =
  (path: string, status: number = 200) =>
  (req: express.Request, res: express.Response) => {
    const [box, key] = req.parse(path);

    const value = box[key];

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

export const use =
  (...middlewares: Function[]) =>
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    let goNext = true;

    for (let i = 0; goNext && i < middlewares.length; ++i) {
      goNext = false;

      await middlewares[i](req, res, (err: any) => {
        if (err) {
          goNext = false;
          return next(err);
        }

        goNext = true;
      });
    }

    if (goNext) {
      next();
    }
  };
