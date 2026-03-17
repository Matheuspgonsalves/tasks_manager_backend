import { Request, Response } from "express";
import Joi from "joi";
import { UserIdRequestParams } from "../../interfaces/requestParams.interface";
import { SearchTasksQuery } from "../../interfaces/taskFilters.interface";
import { searchTasksUseCase } from "./useCases/searchTasks.useCase";

const searchTasksSchema: Joi.Schema<SearchTasksQuery> = Joi.object({
  search: Joi.string().trim().required(),
});

export const searchTasksController = async (
  req: Request<UserIdRequestParams, unknown, unknown, SearchTasksQuery>,
  res: Response
) => {
  try {
    const userId = req.params.userId;
    const query = req.query;
    const validation = searchTasksSchema.validate(query);

    if (validation.error) {
      return res.status(400).send({
        success: false,
        message: validation.error.details[0].message,
      });
    }

    const searchTasksResult = await searchTasksUseCase(userId, query.search as string);

    if (
      searchTasksResult.error === "User ID required" ||
      searchTasksResult.error === "Search term is required"
    ) {
      return res.status(400).send({
        success: false,
        message: searchTasksResult.error,
      });
    }

    return res.status(200).send({
      success: true,
      message: "Tasks search fetched successfully",
      tasks: searchTasksResult.tasks,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};
