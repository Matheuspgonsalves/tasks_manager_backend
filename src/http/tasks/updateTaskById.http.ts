import { Request, Response } from "express";
import Joi from "joi";
import { Tasks } from "../../interfaces/tasks.interface";
import { TaskStatus } from "@prisma/client";
import { updateTaskUseCase } from "./useCases/updateTask.useCase";
import { TaskIdRequestParams } from "../../interfaces/requestParams.interface";

const taskUpdateSchema: Joi.Schema<Tasks> = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  status: Joi.string()
    .valid(...Object.values(TaskStatus))
    .required(),
  userId: Joi.string().required(),
  categoryId: Joi.string().required(),
});

export const updateTaskByIdController = async (
  req: Request<TaskIdRequestParams>,
  res: Response
) => {
  try {
    const body: Tasks = req.body;
    const taskId: string = req.params.taskId;
    const taskValidation: any = taskUpdateSchema.validate(body);

    if (taskValidation.error) {
      return res.status(400).send({
        success: false,
        message: taskValidation.error.details[0].message,
      });
    }

    const taskUpdate = await updateTaskUseCase(body, taskId);

    if (taskUpdate.error === "Task ID required") {
      return res.status(400).send({
        success: false,
        message: taskUpdate.error,
      });
    }

    if (taskUpdate.error === "Task not found") {
      return res.status(404).send({
        success: false,
        message: taskUpdate.error,
      });
    }

    if (taskUpdate.error === "Associated user not found") {
      return res.status(400).send({
        success: false,
        message: taskUpdate.error,
      });
    }

    if (taskUpdate.error === "Category not found for this user") {
      return res.status(404).send({
        success: false,
        message: taskUpdate.error,
      });
    }

    if (taskUpdate.error) {
      return res.status(400).send({
        success: false,
        message: taskUpdate.error,
      });
    }

    return res.status(201).send({
      success: true,
      message: "Task successfully updated",
      task: taskUpdate.updated_task,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};
