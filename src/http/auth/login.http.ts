import { Request, Response } from "express";
import Joi from "joi";
import { Login } from "../../interfaces/login.interface";
import { loginUseCase } from "./useCases/login.useCase";
import { setAccessTokenCookie } from "../../utils/cookies.util";

const loginSchema: Joi.Schema<Login> = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const loginController = async (req: Request, res: Response) => {
  try {
    const body: Login = req.body;
    const loginValidation = loginSchema.validate(body);

    if (loginValidation.error) {
      return res
        .status(400)
        .send({ message: loginValidation.error.details[0].message });
    }

    const loginResult = await loginUseCase(body);

    if (loginResult.error) {
      return res.status(401).send({ message: `Error: ${loginResult.error}` });
    }

    if (!loginResult.newAccesToken) {
      return res.status(500).send({ message: "Token generation failed" });
    }

    setAccessTokenCookie(res, loginResult.newAccesToken);

    return res.status(200).send({
      success: true,
      message: "Login successfully completed",
      user: loginResult.user,
    });
  } catch (error) {
    console.error("Login route error:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
};
