import { Request, Response } from "express";
import Joi from "joi";
import { Register } from "../../interfaces/register.interface";
import { registerUseCase } from "./useCases/register.useCase";

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}$).+$/;

const registerSchema: Joi.Schema<Register> = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(strongPasswordRegex)
    .required()
    .messages({
      "string.empty": "Password is required.",
      "string.pattern.base":
        "Password must be at least 8 characters long and include uppercase, lowercase, and special characters.",
      "any.required": "Password is required.",
    }),
});

export const registerController = async (req: Request, res: Response) => {
  try {
    const body: Register = req.body;
    const registerValidation = registerSchema.validate(body);

    if (registerValidation.error) {
      return res.status(400).send({
        success: false,
        message: registerValidation.error.details[0].message,
      });
    }

    const registerResult = await registerUseCase(body);

    if (registerResult.error) {
      return res.status(registerResult.statusCode ?? 400).send({
        success: false,
        message: registerResult.error,
      });
    }

    return res.status(201).send({
      success: true,
      message: "User successfully registered",
      user: registerResult.user,
      session: registerResult.session,
    });
  } catch (_error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};
