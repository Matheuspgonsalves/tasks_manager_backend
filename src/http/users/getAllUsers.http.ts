import { Request, Response } from "express";
import { findAllUsers } from "./useCases/getAllUsers.useCase";

export const getAllUsersController = async (req: Request, res: Response) => {
  const allUsersResult = await findAllUsers();
  // sem validação porque caso não tenha usuarios, retorna uma lista vazia -> []
  return res.status(200).send({ message: "OK", allUsersResult });
};
