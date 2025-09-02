import { Router } from "express";
import { usersRoutes } from "./user-routes";

const routes = Router();

//Rotas publicas
routes.use("/users", usersRoutes);

export { routes };
