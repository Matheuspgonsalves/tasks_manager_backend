import { Request, Response } from "express";
import Joi from "joi";
import { TaskStatus } from "@prisma/client";
import { UserIdRequestParams } from "../../interfaces/requestParams.interface";
import { GetTasksByStatusQuery } from "../../interfaces/taskFilters.interface";
import { getTasksByStatusUseCase } from "./useCases/getTasksByStatus.useCase";

const getTasksByStatusSchema: Joi.Schema<GetTasksByStatusQuery> = Joi.object({
  status: Joi.string()
    .valid(...Object.values(TaskStatus))
    .required(),
});

export const getTasksByStatusController = async (
  req: Request<UserIdRequestParams, unknown, unknown, GetTasksByStatusQuery>,
  res: Response
) => {
  try {
    const userId = req.params.userId;
    const query = req.query;
    const validation = getTasksByStatusSchema.validate(query);

    if (validation.error) {
      return res.status(400).send({
        success: false,
        message: validation.error.details[0].message,
      });
    }

    const tasksByStatusResult = await getTasksByStatusUseCase(userId, query.status as TaskStatus);

    if (tasksByStatusResult.error === "User ID required") {
      return res.status(400).send({
        success: false,
        message: tasksByStatusResult.error,
      });
    }

    return res.status(200).send({
      success: true,
      message: "Tasks by status fetched successfully",
      tasks: tasksByStatusResult.tasks,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};
