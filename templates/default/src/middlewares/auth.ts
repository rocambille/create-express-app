import express from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

export const hash =
  (path: string) =>
  async (
    { trolley }: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const [source, field] = trolley.parse(path);

    try {
      if (source[field] != null) {
        source[field] = await argon2.hash(source[field]);
      }
      next();
    } catch (err) {
      next(err);
    }
  };

export const verify =
  (path: string) =>
  async (
    { trolley }: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const [source, field] = trolley.parse(path);
    const password = source[field];
    const hash = trolley.user.password;

    try {
      if (await argon2.verify(hash, password)) {
        next();
      } else {
        next(401);
      }
    } catch (err) {
      next(err);
    }
  };

export const authenticate =
  () =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      if (process.env.APP_SECRET == null) {
        throw new Error("Unexpected error: Missing secret");
      }
    } catch (err) {
      return next(err);
    }

    const authorization = req.get("Authorization") ?? "";

    try {
      req.trolley.payload = jwt.verify(
        authorization.split(" ")[1],
        process.env.APP_SECRET
      );

      next();
    } catch (err) {
      err.status = 401;

      next(err);
    }
  };

export const sign =
  (options: jwt.SignOptions) =>
  (
    { trolley }: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      if (process.env.APP_SECRET == null) {
        throw new Error("Unexpected error: Missing secret");
      }

      trolley.token = jwt.sign(
        { sub: trolley.user.id },
        process.env.APP_SECRET,
        options
      );

      next();
    } catch (err) {
      next(err);
    }
  };
