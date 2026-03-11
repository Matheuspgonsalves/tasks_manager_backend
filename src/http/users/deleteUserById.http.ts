import { Request, Response } from "express";
import { deleteUserById } from "./useCases/deleteUserById.useCase";
import { IdRequestParams } from "../../interfaces/requestParams.interface";

export const deleteUserByIdController = async (
  req: Request<IdRequestParams>,
  res: Response
) => {
  const id: string = req.params.id;

  const deleteUserResult = await deleteUserById(id);

  if (deleteUserResult.error === "User ID is required")
    return res.status(400).send({ message: deleteUserResult.error });

  if (deleteUserResult.error === "User not found")
    return res.status(404).send({ message: deleteUserResult.error });

  if (deleteUserResult.error)
    return res.status(500).send({ message: deleteUserResult.error });

  return res.status(200).send({ message: "OK", deleteUserResult });
};
