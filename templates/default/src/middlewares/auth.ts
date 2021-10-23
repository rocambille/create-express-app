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
    const bearer = authorization.split(" ")[1];

    try {
      req.payload = jwt.verify(bearer, process.env.APP_SECRET);

      next();
    } catch ({ message }) {
      next({ message, status: 401 });
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

export const signToken =
  (payloadPath: string, options: jwt.SignOptions) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const [box, key] = req.parse(payloadPath);
    const payload = box[key];

    try {
      if (process.env.APP_SECRET == null) {
        throw new Error("Unexpected error: Missing secret");
      }

      req.token = jwt.sign(payload, process.env.APP_SECRET, options);

      next();
    } catch (err) {
      next(err);
    }
  };

export const verify =
  (hashPath: string, passwordPath: string) =>
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const [hashBox, hashKey] = req.parse(hashPath);
    const hash = hashBox[hashKey];

    const [passwordBox, passwordKey] = req.parse(passwordPath);
    const password = passwordBox[passwordKey];

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
