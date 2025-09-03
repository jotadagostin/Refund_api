import { Router } from "express";
import { usersRoutes } from "./user-routes";
import { refundsRoutes } from "./refunds-routes";
import { sessionsRoutes } from "./sessions-routes";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { uploadsRoutes } from "./uploads-routes";

const routes = Router();

//Rotas publicas
routes.use("/users", usersRoutes);
routes.use("/sessions", sessionsRoutes);

//Rotas privadas:
routes.use(ensureAuthenticated);
routes.use("/refunds", refundsRoutes);
routes.use("/uploads", uploadsRoutes);

export { routes };
