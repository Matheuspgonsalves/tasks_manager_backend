import { Request, Response } from "express";
import Joi from "joi";
import { Login } from "../../interfaces/login.interface";
import { loginUseCase } from "./useCases/login.useCase";
import { setAccessTokenCookie } from "../../utils/cookies.util";
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

    logObservation({ flow: "auth.login", requestId }, "payload_validated", {
      ...timer.checkpoint(),
      isValid: !loginValidation.error,
    });

    if (loginValidation.error) {
      logObservation({ flow: "auth.login", requestId }, "validation_failed", {
        ...timer.checkpoint(),
        error: loginValidation.error.details[0].message,
      });

      return res
        .status(400)
        .send({ message: loginValidation.error.details[0].message });
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
        statusCode: 401,
        error: loginResult.error,
      });

      return res.status(401).send({ message: `Error: ${loginResult.error}` });
    }

    if (!loginResult.newAccesToken) {
      logObservation({ flow: "auth.login", requestId }, "token_missing", {
        ...timer.checkpoint(),
        statusCode: 500,
      });

      return res.status(500).send({ message: "Token generation failed" });
    }

    logObservation({ flow: "auth.login", requestId }, "setting_auth_cookie", {
      ...timer.checkpoint(),
      origin: req.headers.origin,
      referer: req.headers.referer,
      userAgent: req.headers["user-agent"],
    });

    setAccessTokenCookie(res, loginResult.newAccesToken);

    logObservation({ flow: "auth.login", requestId }, "auth_cookie_set", {
      ...timer.checkpoint(),
      hasSetCookieHeader: Boolean(res.getHeader("set-cookie")),
      setCookieHeader: res.getHeader("set-cookie"),
    });

    logObservation({ flow: "auth.login", requestId }, "about_to_respond", {
      ...timer.checkpoint(),
      statusCode: 200,
      userId: loginResult.user?.id,
    });

    return res.status(200).send({
      success: true,
      message: "Login successfully completed",
      user: loginResult.user,
    });
  } catch (error) {
    console.error("Login route error:", error);
    logObservation({ flow: "auth.login", requestId }, "unexpected_error", {
      ...timer.checkpoint(),
      statusCode: 500,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return res.status(500).send({ message: "Internal server error" });
  }
};
