import { Request, Response } from "express";
import Joi from "joi";
import { Categories } from "../../interfaces/categories.interface";
import { createCategoryUseCase } from "./useCases/createCategory.useCase";

const createCategorySchema: Joi.Schema<Categories> = Joi.object({
  name: Joi.string().required(),
  userId: Joi.string().required(),
});

export const createCategoryController = async (req: Request, res: Response) => {
  try {
    const body: Categories = req.body;
    const categoryValidation = createCategorySchema.validate(body);

    if (categoryValidation.error) {
      return res.status(400).send({
        success: false,
        message: categoryValidation.error.details[0].message,
      });
    }

    const createCategoryResult = await createCategoryUseCase(body);

    if (createCategoryResult.error === "User not found") {
      return res.status(404).send({
        success: false,
        message: createCategoryResult.error,
      });
    }

    if (createCategoryResult.error === "Category with same name already exists") {
      return res.status(409).send({
        success: false,
        message: createCategoryResult.error,
      });
    }

    if (createCategoryResult.error) {
      return res.status(400).send({
        success: false,
        message: createCategoryResult.error,
      });
    }

    return res.status(201).send({
      success: true,
      message: "Category successfully created",
      category: createCategoryResult.category,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};
