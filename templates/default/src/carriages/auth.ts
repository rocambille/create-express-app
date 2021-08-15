import { SignOptions } from "jsonwebtoken";
import Validator from "validatorjs";

import { hash, sign, verify } from "../middlewares/auth";
import { carriage, failIfExists, send } from "../middlewares/common";
import { User } from "../middlewares/queries";
import { validate } from "../middlewares/validate";

export const register = (rules: Validator.Rules) =>
  carriage(
    validate(rules),
    User.find("validated.email"),
    failIfExists("user"),
    hash("validated.password"),
    User.persist(),
    send("user", 201)
  );

export const login = (options: SignOptions) =>
  carriage(
    User.findOrFail("body.email", { select: { id: true, password: true } }),
    verify("body.password"),
    sign(options),
    send("token")
  );
