import bcrypt from "bcrypt";
import prisma from "../../../configs/database";
import { Login } from "../../../interfaces/login.interface";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../../../interfaces/AuthRequest.interface";

export const loginUseCase = async (data: Login) => {
  try {
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

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET not configured");
    }

    const newAccesToken: string = jwt.sign(payload, jwtSecret, {
      expiresIn: "7d",
    });

    return {
      user: payload,
      newAccesToken,
    };
  } catch (error) {
    console.error("Login use case error:", error);
    throw error;
  }
};
