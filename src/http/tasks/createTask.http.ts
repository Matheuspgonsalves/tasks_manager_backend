import { Request, Response } from "express";
import Joi from "joi";
import { Tasks } from "../../interfaces/tasks.interface";
import { createTaskUseCase } from "./useCases/createTask.useCase";
import { TaskStatus } from "@prisma/client";

const taskRegisterSchema: Joi.Schema<Tasks> = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  status: Joi.string()
    .valid(...Object.values(TaskStatus))
    .required(),
  userId: Joi.string().required(),
  categoryId: Joi.string().required(),
});

export const createTaskController = async (req: Request, res: Response) => {
  try {
    const body: Tasks = req.body;
    const taskValidation: any = taskRegisterSchema.validate(body);

    if (taskValidation.error) {
      return res.status(400).send({
        success: false,
        message: taskValidation.error.details[0].message,
      });
    }

    const createTaskResult = await createTaskUseCase(body);

    if (createTaskResult.error === "User not found")
      return res.status(404).send({
        success: false,
        message: createTaskResult.error,
      });

    if (createTaskResult.error === "Task with same title already existis")
      return res.status(409).send({
        success: false,
        message: createTaskResult.error,
      });

    if (createTaskResult.error === "Category not found for this user")
      return res.status(404).send({
        success: false,
        message: createTaskResult.error,
      });

    if (createTaskResult.error)
      return res.status(400).send({
        success: false,
        message: createTaskResult.error,
      });

    return res.status(201).send({
      success: true,
      message: "Task successfully created",
      task: createTaskResult.task,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};
