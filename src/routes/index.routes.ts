import { Router } from "express";

import userRoutes from "./users.routes";
import authMiddleware from "../middlewares/auth.middleware";
import authRoutes from "./auth-v1.routes";
import { healthCheckerController } from "../http/health/health.http";

const routes = Router();

routes.use("/users", authMiddleware.checkToken, userRoutes);
routes.use("/auth/v1", authRoutes);

//Health checker
routes.post("/health", healthCheckerController);

export default routes;
