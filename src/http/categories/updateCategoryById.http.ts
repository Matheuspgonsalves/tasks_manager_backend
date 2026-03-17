import { Request, Response } from "express";
import Joi from "joi";
import { Categories } from "../../interfaces/categories.interface";
import { CategoryIdRequestParams } from "../../interfaces/requestParams.interface";
import { updateCategoryUseCase } from "./useCases/updateCategory.useCase";

const updateCategorySchema: Joi.Schema<Categories> = Joi.object({
  name: Joi.string().required(),
  userId: Joi.string().required(),
});

export const updateCategoryByIdController = async (
  req: Request<CategoryIdRequestParams>,
  res: Response
) => {
  try {
    const body: Categories = req.body;
    const categoryId = req.params.categoryId;
    const categoryValidation = updateCategorySchema.validate(body);

    if (categoryValidation.error) {
      return res.status(400).send({
        success: false,
        message: categoryValidation.error.details[0].message,
      });
    }

    const updateCategoryResult = await updateCategoryUseCase(body, categoryId);

    if (updateCategoryResult.error === "Category ID is required") {
      return res.status(400).send({
        success: false,
        message: updateCategoryResult.error,
      });
    }

    if (updateCategoryResult.error === "Category not found") {
      return res.status(404).send({
        success: false,
        message: updateCategoryResult.error,
      });
    }

    if (updateCategoryResult.error === "User not found") {
      return res.status(404).send({
        success: false,
        message: updateCategoryResult.error,
      });
    }

    if (updateCategoryResult.error === "Category with same name already exists") {
      return res.status(409).send({
        success: false,
        message: updateCategoryResult.error,
      });
    }

    if (updateCategoryResult.error === "Default categories cannot be updated") {
      return res.status(400).send({
        success: false,
        message: updateCategoryResult.error,
      });
    }

    if (updateCategoryResult.error) {
      return res.status(400).send({
        success: false,
        message: updateCategoryResult.error,
      });
    }

    return res.status(200).send({
      success: true,
      message: "Category successfully updated",
      category: updateCategoryResult.updated_category,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};
