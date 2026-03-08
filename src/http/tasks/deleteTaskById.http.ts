import { Request, Response } from "express";
import { deleteTaskById } from "./useCases/deleteTaskById.useCase";

export const deleteTaskByIdController = async (req: Request, res: Response) => {
  const taskId: string = req.params.id;

  const deleteTaskResult = await deleteTaskById(taskId);

  if (deleteTaskResult.error === "Task ID is required") {
    return res.status(400).send({ message: deleteTaskResult.error });
  }

  if (deleteTaskResult.error === "Task not found") {
    return res.status(404).send({ message: deleteTaskResult.error });
  }

  if (deleteTaskResult.error === "Task deletion failed") {
    return res.status(500).send({ message: deleteTaskResult.error });
  }

  if (deleteTaskResult.error) {
    return res.status(400).send({ message: deleteTaskResult.error });
  }

  return res.status(200).send({ message: "OK", task: deleteTaskResult.task });
};
