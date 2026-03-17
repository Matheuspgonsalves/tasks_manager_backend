import { Request, Response } from "express";
import { deleteTaskById } from "./useCases/deleteTaskById.useCase";
import { IdRequestParams } from "../../interfaces/requestParams.interface";

export const deleteTaskByIdController = async (
  req: Request<IdRequestParams>,
  res: Response
) => {
  try {
    const taskId: string = req.params.id;

    const deleteTaskResult = await deleteTaskById(taskId);

    if (deleteTaskResult.error === "Task ID is required") {
      return res.status(400).send({
        success: false,
        message: deleteTaskResult.error,
      });
    }

    if (deleteTaskResult.error === "Task not found") {
      return res.status(404).send({
        success: false,
        message: deleteTaskResult.error,
      });
    }

    if (deleteTaskResult.error === "Task deletion failed") {
      return res.status(500).send({
        success: false,
        message: deleteTaskResult.error,
      });
    }

    if (deleteTaskResult.error) {
      return res.status(400).send({
        success: false,
        message: deleteTaskResult.error,
      });
    }

    return res.status(200).send({
      success: true,
      message: "Task successfully deleted",
      task: deleteTaskResult.task,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};
