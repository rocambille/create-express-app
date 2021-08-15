import { Router } from "express";

import { login, register } from "../carriages/auth";

const routes = Router();

routes.post("/login", login({ expiresIn: "15m" }));

routes.post(
  "/register",
  register({ email: "email|required", password: "required" })
);

export default routes;
