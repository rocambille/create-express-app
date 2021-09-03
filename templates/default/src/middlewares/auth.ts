import express from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

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
      req.payload = jwt.verify(
        authorization.split(" ")[1],
        process.env.APP_SECRET
      );

      next();
    } catch (err) {
      err.status = 401;

      next(err);
    }
  };

export const hash =
  (path: string) =>
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const [box, key] = req.parse(path);

    try {
      if (box[key] != null) {
        box[key] = await argon2.hash(box[key]);
      }
      next();
    } catch (err) {
      next(err);
    }
  };

export const sign =
  (options: jwt.SignOptions) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      if (process.env.APP_SECRET == null) {
        throw new Error("Unexpected error: Missing secret");
      }

      req.token = jwt.sign(
        { sub: req.user.id },
        process.env.APP_SECRET,
        options
      );

      next();
    } catch (err) {
      next(err);
    }
  };

export const verify =
  (path: string) =>
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const [box, key] = req.parse(path);
    const password = box[key];

    const hash = req.user.password;

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
