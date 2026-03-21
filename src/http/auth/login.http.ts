import { Request, Response } from "express";
import Joi from "joi";
import { Login } from "../../interfaces/login.interface";
import { loginUseCase } from "./useCases/login.useCase";
import {
  createRequestId,
  createTimer,
  logObservation,
} from "../../utils/observability.util";

const loginSchema: Joi.Schema<Login> = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const loginController = async (req: Request, res: Response) => {
  const requestId = createRequestId();
  const timer = createTimer();

  try {
    logObservation({ flow: "auth.login", requestId }, "request_received", {
      method: req.method,
      path: req.originalUrl,
      ...timer.checkpoint(),
    });

    const body: Login = req.body;

    logObservation({ flow: "auth.login", requestId }, "payload_loaded", {
      ...timer.checkpoint(),
      email: body.email,
    });

    const loginValidation = loginSchema.validate(body);

    if (loginValidation.error) {
      return res.status(400).send({
        success: false,
        message: loginValidation.error.details[0].message,
      });
    }

    logObservation({ flow: "auth.login", requestId }, "use_case_started", {
      ...timer.checkpoint(),
    });

    const loginResult = await loginUseCase(body, requestId);

    logObservation({ flow: "auth.login", requestId }, "use_case_finished", {
      ...timer.checkpoint(),
      hasError: Boolean(loginResult.error),
    });

    if (loginResult.error) {
      logObservation({ flow: "auth.login", requestId }, "request_failed", {
        ...timer.checkpoint(),
        statusCode: loginResult.statusCode ?? 401,
        error: loginResult.error,
      });

      return res.status(loginResult.statusCode ?? 401).send({
        success: false,
        message: loginResult.error,
      });
    }

    return res.status(200).send({
      success: true,
      message: "Login successfully completed",
      user: loginResult.user,
      session: loginResult.session,
    });
  } catch (error) {
    console.error("Login route error:", error);
    logObservation({ flow: "auth.login", requestId }, "unexpected_error", {
      ...timer.checkpoint(),
      statusCode: 500,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};
