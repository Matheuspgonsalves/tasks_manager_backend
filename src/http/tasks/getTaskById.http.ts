import { Request, Response } from "express";
import { findTasksById } from "./useCases/getTasksById.userCase";

export const getTaskByIdController = async (req: Request, res: Response) => {
  const taskId: string = req.params.id;

  const getTaskByIdResult = await findTasksById(taskId);

  if (getTaskByIdResult.error === "Task ID required")
    return res.status(400).send({ message: getTaskByIdResult.error });

  if (getTaskByIdResult.error === "Task not found")
    return res.status(404).send({ message: getTaskByIdResult.error });

  return res.status(200).send({ message: "OK", tasks: getTaskByIdResult.task });
};
