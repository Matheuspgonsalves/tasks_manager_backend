import { Request, Response } from "express";
import { findUserById } from "./useCases/getUserById.useCase";

export const getUserByIdController = async (req: Request, res: Response) => {
  const id: string = req.params.id;

  const getUserResult = await findUserById(id);

  if (getUserResult.error === "User ID is required")
    return res.status(400).send({ message: getUserResult.error });

  if (getUserResult.error === "User not found")
    return res.status(404).send({ message: getUserResult.error });

  return res.status(200).send({ message: "OK", user: getUserResult.user });
};
