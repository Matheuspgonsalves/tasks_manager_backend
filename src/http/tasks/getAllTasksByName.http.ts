import { Request, Response } from "express";
import Joi from "joi";
import { findAllTasksByName } from "./useCases/getAllTasksByName.userCase";

const nameSchema = Joi.string().required();

export const getAllTasksByNameController = async (
  req: Request,
  res: Response
) => {
  try {
    const name: string = req.body.name;

    const taskValidation: any = nameSchema.validate(name);

    if (taskValidation.error) {
      return res.status(400).send({
        success: false,
        message: taskValidation.error.details[0].message,
      });
    }

    const getAllTasksResult = await findAllTasksByName(name);

    if (getAllTasksResult.error) {
      return res.status(404).send({
        success: false,
        message: getAllTasksResult.error,
      });
    }

    return res.status(200).send({
      success: true,
      message: "Tasks fetched successfully",
      tasks: getAllTasksResult.tasks,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};
