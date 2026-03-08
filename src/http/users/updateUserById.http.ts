import { Request, Response } from "express";
import Joi from "joi";
import { Users } from "../../interfaces/users.interface";
import { updateUserUseCase } from "./useCases/updateUser.useCase";

const registerSchema: Joi.Schema<Users> = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const updateUserByIdController = async (req: Request, res: Response) => {
  const body: Users = req.body;
  const userId: string = req.params.id;
  const userValidation: any = registerSchema.validate(body);

  if (userValidation.error) {
    return res
      .status(400)
      .send({ message: userValidation.error.details[0].message });
  }

  const updateUserResult = await updateUserUseCase(body, userId);

  if (updateUserResult.error === "User ID is required")
    return res.status(400).send({ message: updateUserResult.error });

  if (updateUserResult.error === "User not found")
    return res.status(404).send({ message: updateUserResult.error });

  if (updateUserResult.error === "Email already in use by another user")
    return res.status(409).send({ message: updateUserResult.error });

  if (updateUserResult.error)
    return res.status(400).send({ message: updateUserResult.error });

  return res.status(201).send({
    message: "User successfully updated",
    user: updateUserResult,
  });
};
