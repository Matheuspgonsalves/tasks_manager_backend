import { Request, Response } from "express";
import { findAllUsers } from "./useCases/getAllUsers.useCase";

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const allUsersResult = await findAllUsers();
    // sem validação porque caso não tenha usuarios, retorna uma lista vazia -> []
    return res.status(200).send({
      success: true,
      message: "Users fetched successfully",
      allUsersResult,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};
