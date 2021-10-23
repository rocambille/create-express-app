import express from "express";
import Validator from "validatorjs";

Validator.useLang("{{language}}");

export const validate =
  (path: string, rules: Validator.Rules) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const [box, key] = req.parse(path);
    const validation = new Validator(box[key], rules);

    if (validation.passes()) {
      req.validated = box[key];

      next();
    } else {
      next({ message: validation.errors.all(), status: 400 });
    }
  };
