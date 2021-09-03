import { SignOptions } from "jsonwebtoken";
import Validator from "validatorjs";

import { hash, sign, verify } from "../middlewares/auth";
import { failIfExists, send, use } from "../middlewares/common";
import { User } from "../middlewares/queries";
import { validate } from "../middlewares/validate";

export const register = (rules: Validator.Rules) =>
  use(
    validate(rules),
    User.find("validated.email"),
    failIfExists("user"),
    hash("validated.password"),
    User.persist(),
    send("user", 201)
  );

export const login = (options: SignOptions) =>
  use(
    User.findOrFail("body.email", { expose: { password: true } }),
    verify("body.password"),
    sign(options),
    send("token")
  );
