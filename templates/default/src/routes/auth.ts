import { Router } from "express";

import { login, register } from "../series/auth";

const router = Router();

router.post("/login", login({ expiresIn: "15m" }));

router.post(
  "/register",
  register({ email: "email|required", password: "required" })
);

export default router;
