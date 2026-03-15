import bcrypt from "bcrypt";
import prisma from "../../../configs/database";
import { Login } from "../../../interfaces/login.interface";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../../../interfaces/AuthRequest.interface";
import { createTimer, logObservation } from "../../../utils/observability.util";

export const loginUseCase = async (data: Login, requestId?: string) => {
  const timer = createTimer();

  try {
    const { email, password } = data;

    logObservation({ flow: "auth.login.usecase", requestId }, "started", {
      ...timer.checkpoint(),
      email,
    });

    const user = await prisma.user.findUnique({
      where: { email },
    });

    logObservation({ flow: "auth.login.usecase", requestId }, "user_lookup_finished", {
      ...timer.checkpoint(),
      userFound: Boolean(user),
    });

    if (!user) {
      logObservation({ flow: "auth.login.usecase", requestId }, "user_not_found", {
        ...timer.checkpoint(),
      });

      return { error: "Invalid email or password" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    logObservation({ flow: "auth.login.usecase", requestId }, "password_check_finished", {
      ...timer.checkpoint(),
      isPasswordValid,
    });

    if (!isPasswordValid) {
      logObservation({ flow: "auth.login.usecase", requestId }, "invalid_password", {
        ...timer.checkpoint(),
      });

      return { error: "Invalid email or password" };
    }

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      logObservation({ flow: "auth.login.usecase", requestId }, "jwt_secret_missing", {
        ...timer.checkpoint(),
      });

      throw new Error("JWT_SECRET not configured");
    }

    const newAccesToken: string = jwt.sign(payload, jwtSecret, {
      expiresIn: "7d",
    });

    logObservation({ flow: "auth.login.usecase", requestId }, "jwt_signed", {
      ...timer.checkpoint(),
      userId: user.id,
    });

    return {
      user: payload,
      newAccesToken,
    };
  } catch (error) {
    console.error("Login use case error:", error);
    logObservation({ flow: "auth.login.usecase", requestId }, "unexpected_error", {
      ...timer.checkpoint(),
      error: error instanceof Error ? error.message : "Unknown error",
    });
    throw error;
  }
};
