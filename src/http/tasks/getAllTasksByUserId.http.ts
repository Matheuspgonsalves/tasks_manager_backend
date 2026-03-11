import { Request, Response } from "express"
import { findAllTasksByUserId } from "./useCases/getAllTasksByUserId.useCase"
import { UserIdRequestParams } from "../../interfaces/requestParams.interface";

export const getAllTasksByUserIdController = async (
  req: Request<UserIdRequestParams>,
  res: Response
) => {
	const userId: string = req.params.userId

	const getAllTasksResult = await findAllTasksByUserId(userId);

	if (getAllTasksResult.error === "User ID required")
		return res.status(400).send({ message: getAllTasksResult.error });

	const tasks = getAllTasksResult.tasks;

	return res.status(200).send({message: "OK", tasks: tasks})
}
