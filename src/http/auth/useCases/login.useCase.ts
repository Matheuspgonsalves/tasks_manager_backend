import bcrypt from "bcrypt";
import prisma from "../../../configs/database";
import { Login } from "../../../interfaces/login.interface";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../../../interfaces/AuthRequest.interface";
import authMiddleware from "../../../middlewares/auth.middleware";

export const loginUseCase = async (data: Login) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: "Invalid email or password" };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return { error: "Invalid email or password" };
  }

  const payload: JwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const newAccesToken: string = jwt.sign(payload, authMiddleware.MySecretWord, { expiresIn: "24h" });

  return { 
    user: payload,
    newAccesToken, 
  };
};
