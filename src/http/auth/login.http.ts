import { Request, Response } from "express";
import Joi from "joi";
import { Login } from "../../interfaces/login.interface";
import { loginUseCase } from "./useCases/login.useCase";

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

    return res.status(200).send({
      message: "Login successfully completed",
      ...loginResult,
    });
  } catch (error) {
    console.error("Login route error:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
};
