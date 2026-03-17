import { Request, Response } from "express";
import { CategoryIdRequestParams } from "../../interfaces/requestParams.interface";
import { findCategoryById } from "./useCases/getCategoryById.useCase";

export const getCategoryByIdController = async (
  req: Request<CategoryIdRequestParams>,
  res: Response
) => {
  try {
    const categoryId = req.params.categoryId;

    const getCategoryResult = await findCategoryById(categoryId);

    if (getCategoryResult.error === "Category ID is required") {
      return res.status(400).send({
        success: false,
        message: getCategoryResult.error,
      });
    }

    if (getCategoryResult.error === "Category not found") {
      return res.status(404).send({
        success: false,
        message: getCategoryResult.error,
      });
    }

    return res.status(200).send({
      success: true,
      message: "Category fetched successfully",
      category: getCategoryResult.category,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};
