import { Router } from "express";
import userRoutes from "./users.routes";
import tasksRoutes from "./tasks.routes";
import authMiddleware from "../middlewares/auth.middleware";
import authRoutes from "./auth-v1.routes";

const routes = Router();

routes.use("/users", userRoutes);
routes.use("/tasks", authMiddleware.checkToken, tasksRoutes);
routes.use("/auth/v1", authRoutes);

export default routes;
