import express from "express";
import Validator from "validatorjs";

Validator.useLang("{{language}}");

export const validate =
  (rules: Validator.Rules, options?: { merge?: boolean }) =>
  (
    { trolley }: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const validation = new Validator(trolley.body, rules);

    if (validation.passes()) {
      trolley.validated = trolley.body;

      next();
    } else {
      next({ message: validation.errors.all(), status: 400 });
    }
  };
