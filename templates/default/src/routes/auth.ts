import { Router } from "express";

import { login, register } from "../pipes/auth";

const router = Router();

router.post(
  "/login",
  login({
    expect: { email: "email|required", password: "required" },
    expiresIn: "15m",
  })
);

router.post(
  "/register",
  register({
    expect: { email: "email|required", password: "required" },
  })
);

export default router;
