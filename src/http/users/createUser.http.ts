import { Request, Response } from "express";
import Joi from "joi";
import { Users } from "../../interfaces/users.interface";
import { createUserUseCase } from "./useCases/createUser.useCase";

const registerSchema: Joi.Schema<Users> = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const createUserController = async (req: Request, res: Response) => {
  const body: Users = req.body;
  const userValidation: any = registerSchema.validate(body);

  if (userValidation.error) {
    return res
      .status(400)
      .send({ message: userValidation.error.details[0].message });
  }

  const createUserResult = await createUserUseCase(body);

  if (createUserResult.error) {
    return res.status(409).send({ message: createUserResult.error });
  }

  return res.status(201).send({
    message: "User successfully created",
    user: createUserResult.user,
  });
};
