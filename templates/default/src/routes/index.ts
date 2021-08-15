import { Router } from "express";

import auth from "./auth";

const routes = Router();

routes.use(auth);

export default routes;
