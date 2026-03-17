import { Request, Response } from "express";
import { deleteUserById } from "./useCases/deleteUserById.useCase";
import { IdRequestParams } from "../../interfaces/requestParams.interface";

export const deleteUserByIdController = async (
  req: Request<IdRequestParams>,
  res: Response
) => {
  try {
    const id: string = req.params.id;

    const deleteUserResult = await deleteUserById(id);

    if (deleteUserResult.error === "User ID is required")
      return res.status(400).send({
        success: false,
        message: deleteUserResult.error,
      });

    if (deleteUserResult.error === "User not found")
      return res.status(404).send({
        success: false,
        message: deleteUserResult.error,
      });

    if (deleteUserResult.error)
      return res.status(500).send({
        success: false,
        message: deleteUserResult.error,
      });

    return res.status(200).send({
      success: true,
      message: "User successfully deleted",
      deleteUserResult,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};
