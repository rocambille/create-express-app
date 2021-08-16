import express from "express";
import Validator from "validatorjs";

Validator.useLang("en");

export const validate =
  (rules: Validator.Rules, options?: { merge?: boolean }) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const validation = new Validator(req.body, rules);

    if (validation.passes()) {
      req.validated = req.body;

      next();
    } else {
      next({ message: validation.errors.all(), status: 400 });
    }
  };
