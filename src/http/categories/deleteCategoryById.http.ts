import { Response } from "express";
import { CategoryIdRequestParams } from "../../interfaces/requestParams.interface";
import { deleteCategoryById } from "./useCases/deleteCategoryById.useCase";
import { AuthRequest } from "../../interfaces/AuthRequest.interface";

export const deleteCategoryByIdController = async (
  req: AuthRequest<CategoryIdRequestParams>,
  res: Response
) => {
  try {
    const categoryId = req.params.categoryId;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).send({
        success: false,
        message: "Authentication required. Please provide a valid token.",
      });
    }

    const deleteCategoryResult = await deleteCategoryById(categoryId, userId);

    if (deleteCategoryResult.error === "Category ID is required") {
      return res.status(400).send({
        success: false,
        message: deleteCategoryResult.error,
      });
    }

    if (deleteCategoryResult.error === "User ID is required") {
      return res.status(400).send({
        success: false,
        message: deleteCategoryResult.error,
      });
    }

    if (deleteCategoryResult.error === "Category not found") {
      return res.status(404).send({
        success: false,
        message: deleteCategoryResult.error,
      });
    }

    if (deleteCategoryResult.error === "Category deletion failed") {
      return res.status(500).send({
        success: false,
        message: deleteCategoryResult.error,
      });
    }

    if (deleteCategoryResult.error) {
      return res.status(400).send({
        success: false,
        message: deleteCategoryResult.error,
      });
    }

    return res.status(200).send({
      success: true,
      message: "Category successfully deleted",
      category: deleteCategoryResult.category,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};
