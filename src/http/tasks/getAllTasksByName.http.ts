import { Request, Response } from "express";
import Joi from "joi";
import { findAllTasksByName } from "./useCases/getAllTasksByName.userCase";

const nameSchema = Joi.string().required();

export const getAllTasksByNameController = async (
  req: Request,
  res: Response
) => {
  const name: string = req.body.name;

  const taskValidation: any = nameSchema.validate(name);

  if (taskValidation.error) {
    return res
      .status(400)
      .send({ message: taskValidation.error.details[0].message });
  }

  const getAllTasksResult = await findAllTasksByName(name);

  if (getAllTasksResult.error) {
    res.status(404).send({ message: getAllTasksResult.error });
  }

  return res
    .status(200)
    .send({ message: "OK", tasks: getAllTasksResult.tasks });
};
