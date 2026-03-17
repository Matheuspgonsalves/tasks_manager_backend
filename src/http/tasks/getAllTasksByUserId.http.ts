import { Request, Response } from "express"
import { findAllTasksByUserId } from "./useCases/getAllTasksByUserId.useCase"
import { UserIdRequestParams } from "../../interfaces/requestParams.interface";

export const getAllTasksByUserIdController = async (
  req: Request<UserIdRequestParams>,
  res: Response
) => {
	try {
		const userId: string = req.params.userId

		const getAllTasksResult = await findAllTasksByUserId(userId);

		if (getAllTasksResult.error === "User ID required")
			return res.status(400).send({
				success: false,
				message: getAllTasksResult.error,
			});

		const tasks = getAllTasksResult.tasks;

		return res.status(200).send({
			success: true,
			message: "Tasks fetched successfully",
			tasks: tasks,
		})
	} catch (error) {
		return res.status(500).send({
			success: false,
			message: "Internal server error",
		});
	}
}
