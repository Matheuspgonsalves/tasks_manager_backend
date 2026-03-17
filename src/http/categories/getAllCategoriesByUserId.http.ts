import { Request, Response } from "express";
import { findAllCategoriesByUserId } from "./useCases/getAllCategoriesByUserId.useCase";
import { UserIdRequestParams } from "../../interfaces/requestParams.interface";

export const getAllCategoriesByUserIdController = async (
  req: Request<UserIdRequestParams>,
  res: Response
) => {
  try {
    const userId = req.params.userId;

    const getCategoriesResult = await findAllCategoriesByUserId(userId);

    if (getCategoriesResult.error === "User ID required") {
      return res.status(400).send({
        success: false,
        message: getCategoriesResult.error,
      });
    }

    return res.status(200).send({
      success: true,
      message: "Categories fetched successfully",
      categories: getCategoriesResult.categories,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};
