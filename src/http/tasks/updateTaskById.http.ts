import { Request, Response } from "express";
import Joi from "joi";
import { Tasks } from "../../interfaces/tasks.interface";
import { TaskStatus } from "@prisma/client";
import { updateTaskUseCase } from "./useCases/updateTask.useCase";

const taskUpdateSchema: Joi.Schema<Tasks> = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  status: Joi.string()
    .valid(...Object.values(TaskStatus))
    .required(),
  userId: Joi.string().required(),
});

export const updateTaskByIdController = async (req: Request, res: Response) => {
  const body: Tasks = req.body;
  const taskId: string = req.params.id;
  const taskValidation: any = taskUpdateSchema.validate(body);

  if (taskValidation.error) {
    return res
      .status(400)
      .send({ message: taskValidation.error.details[0].message });
  }

  const taskUpdate = await updateTaskUseCase(body, taskId);

  if (taskUpdate.error === "Task ID required") {
    return res.status(400).send({ message: taskUpdate.error });
  }

  if (taskUpdate.error === "Task not found") {
    return res.status(404).send({ message: taskUpdate.error });
  }

  if (taskUpdate.error === "Associated user not found") {
    return res.status(400).send({ message: taskUpdate.error });
  }

  if (taskUpdate.error) {
    return res.status(400).send({ message: taskUpdate.error });
  }

  return res.status(201).send({
    message: "User successfully updated",
    task: taskUpdate.updated_task,
  });
};
