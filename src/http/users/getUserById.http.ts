import { Request, Response } from "express";
import { findUserById } from "./useCases/getUserById.useCase";
import { IdRequestParams } from "../../interfaces/requestParams.interface";

export const getUserByIdController = async (
  req: Request<IdRequestParams>,
  res: Response
) => {
  try {
    const id: string = req.params.id;

    const getUserResult = await findUserById(id);

    if (getUserResult.error === "User ID is required")
      return res.status(400).send({
        success: false,
        message: getUserResult.error,
      });

    if (getUserResult.error === "User not found")
      return res.status(404).send({
        success: false,
        message: getUserResult.error,
      });

    return res.status(200).send({
      success: true,
      message: "User fetched successfully",
      user: getUserResult.user,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};
