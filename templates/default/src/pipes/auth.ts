import { SignOptions } from "jsonwebtoken";
import Validator from "validatorjs";

import { hash, signToken, verify } from "../middlewares/auth";
import { build, copy, failIfExists, pipe, send } from "../middlewares/common";
import { User } from "../middlewares/queries";
import { validate } from "../middlewares/validate";

export const register = ({ expect }: { expect: Validator.Rules }) =>
  pipe(
    validate("body", expect),
    User.find("validated.email"),
    failIfExists("user"),
    hash("validated.password"),
    User.persist("validated"),
    send("user", 201)
  );

export const login = ({
  expect,
  ...tokenOptions
}: { expect: Validator.Rules } & SignOptions) =>
  pipe(
    validate("body", expect),
    User.findOrFail("body.email", {
      expose: { password: true },
      statusOnFail: 401,
    }),
    verify("user.password", "body.password"),
    build("payload"),
    copy("user.id", "payload.sub"),
    signToken("payload", tokenOptions),
    send("token")
  );
