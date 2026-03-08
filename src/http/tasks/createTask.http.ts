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
});

export const createTaskController = async (req: Request, res: Response) => {
  const body: Tasks = req.body;
  const taskValidation: any = taskRegisterSchema.validate(body);

  if (taskValidation.error) {
    return res
      .status(400)
      .send({ message: taskValidation.error.details[0].message });
  }

  const createTaskResult = await createTaskUseCase(body);

  if (createTaskResult.error === "User not found")
    return res
      .status(404)
      .send({ message: `Error: ${createTaskResult.error}` });

  if (createTaskResult.error === "Task with same title already existis")
    return res
      .status(409)
      .send({ message: `Error: ${createTaskResult.error}` });

  if (createTaskResult.error)
    return res
      .status(400)
      .send({ message: `Error: ${createTaskResult.error}` });

  return res.status(201).send({
    message: "Task successfully created",
    task: createTaskResult.task,
  });
};
