import { Router } from "express";
import { loginController } from "../http/auth/login.http";
import { createUserController } from "../http/users/createUser.http";
import { logoutController } from "../http/auth/logout.http";
import authMiddleware from "../middlewares/auth.middleware";

const authRoutes = Router();

authRoutes.post("/login", loginController);
authRoutes.post("/register", createUserController);
authRoutes.post("/logout", authMiddleware.checkToken, logoutController);

export default authRoutes;
