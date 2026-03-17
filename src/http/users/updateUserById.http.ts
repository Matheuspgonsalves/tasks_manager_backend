import { Request, Response } from "express";
import Joi from "joi";
import { Users } from "../../interfaces/users.interface";
import { updateUserUseCase } from "./useCases/updateUser.useCase";
import { IdRequestParams } from "../../interfaces/requestParams.interface";

const registerSchema: Joi.Schema<Users> = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const updateUserByIdController = async (
  req: Request<IdRequestParams>,
  res: Response
) => {
  try {
    const body: Users = req.body;
    const userId: string = req.params.id;
    const userValidation: any = registerSchema.validate(body);

    if (userValidation.error) {
      return res.status(400).send({
        success: false,
        message: userValidation.error.details[0].message,
      });
    }

    const updateUserResult = await updateUserUseCase(body, userId);

    if (updateUserResult.error === "User ID is required")
      return res.status(400).send({
        success: false,
        message: updateUserResult.error,
      });

    if (updateUserResult.error === "User not found")
      return res.status(404).send({
        success: false,
        message: updateUserResult.error,
      });

    if (updateUserResult.error === "Email already in use by another user")
      return res.status(409).send({
        success: false,
        message: updateUserResult.error,
      });

    if (updateUserResult.error)
      return res.status(400).send({
        success: false,
        message: updateUserResult.error,
      });

    return res.status(201).send({
      success: true,
      message: "User successfully updated",
      user: updateUserResult,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};
