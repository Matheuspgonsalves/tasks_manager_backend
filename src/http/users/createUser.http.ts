import { Response } from "express";
import Joi from "joi";
import { Users } from "../../interfaces/users.interface";
import { createUserUseCase } from "./useCases/createUser.useCase";
import { AuthRequest } from "../../interfaces/AuthRequest.interface";

const registerSchema: Joi.Schema<Users> = Joi.object({
  name: Joi.string().required(),
});

export const createUserController = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id || !req.user?.email) {
      return res.status(401).send({
        success: false,
        message: "Authenticated Supabase user not found.",
      });
    }

    const body: Users = req.body;
    const userValidation: any = registerSchema.validate(body);

    if (userValidation.error) {
      return res.status(400).send({
        success: false,
        message: userValidation.error.details[0].message,
      });
    }

    const createUserResult = await createUserUseCase({
      id: req.user.id,
      email: req.user.email,
      name: body.name,
      role: req.user.role,
    });

    if (createUserResult.error) {
      return res.status(400).send({
        success: false,
        message: createUserResult.error,
      });
    }

    return res.status(200).send({
      success: true,
      message: "Profile successfully synchronized",
      user: createUserResult.user,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};
