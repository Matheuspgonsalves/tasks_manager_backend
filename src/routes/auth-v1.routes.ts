import { Router } from "express";
import { loginController } from "../http/auth/login.http";

const authRoutes = Router();

authRoutes.post("/", loginController);

export default authRoutes;
