import { Router } from "express";
import { loginController } from "../http/auth/login.http";
import { createUserController } from "../http/users/createUser.http";

const authRoutes = Router();

authRoutes.post("/login", loginController);
authRoutes.post("/register", createUserController);

export default authRoutes;
