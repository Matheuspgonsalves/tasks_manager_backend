import { Request, Response } from "express";
import Joi from "joi";
import { UserIdRequestParams } from "../../interfaces/requestParams.interface";
import { GetTasksByCategoryQuery } from "../../interfaces/taskFilters.interface";
import { getTasksByCategoryUseCase } from "./useCases/getTasksByCategory.useCase";

const getTasksByCategorySchema: Joi.Schema<GetTasksByCategoryQuery> = Joi.object({
  categoryId: Joi.string().required(),
});

export const getTasksByCategoryController = async (
  req: Request<UserIdRequestParams, unknown, unknown, GetTasksByCategoryQuery>,
  res: Response
) => {
  try {
    const userId = req.params.userId;
    const query = req.query;
    const validation = getTasksByCategorySchema.validate(query);

    if (validation.error) {
      return res.status(400).send({
        success: false,
        message: validation.error.details[0].message,
      });
    }

    const tasksByCategoryResult = await getTasksByCategoryUseCase(userId, query.categoryId as string);

    if (
      tasksByCategoryResult.error === "User ID required" ||
      tasksByCategoryResult.error === "Category ID is required"
    ) {
      return res.status(400).send({
        success: false,
        message: tasksByCategoryResult.error,
      });
    }

    if (tasksByCategoryResult.error === "Category not found for this user") {
      return res.status(404).send({
        success: false,
        message: tasksByCategoryResult.error,
      });
    }

    return res.status(200).send({
      success: true,
      message: "Tasks by category fetched successfully",
      tasks: tasksByCategoryResult.tasks,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};
