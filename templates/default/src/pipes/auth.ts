import { SignOptions } from "jsonwebtoken";
import Validator from "validatorjs";

import { hash, sign, verify } from "../middlewares/auth";
import { failIfExists, pipe, send } from "../middlewares/common";
import { User } from "../middlewares/queries";
import { validate } from "../middlewares/validate";

export const register = (rules: Validator.Rules) =>
  pipe(
    validate(rules),
    User.find("validated.email"),
    failIfExists("user"),
    hash("validated.password"),
    User.persist(),
    send("user", 201)
  );

export const login = (options: SignOptions) =>
  pipe(
    User.findOrFail("body.email", { expose: { password: true } }),
    verify("body.password"),
    sign(options),
    send("token")
  );
