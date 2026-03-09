import { Router } from "express";
import userRoutes from "./users.routes";
import authMiddleware from "../middlewares/auth.middleware";
import authRoutes from "./auth-v1.routes";

const routes = Router();

routes.use("/users", authMiddleware.checkToken, userRoutes);
routes.use("/auth/v1", authRoutes);

export default routes;
