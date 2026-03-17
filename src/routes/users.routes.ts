import { Router } from "express";
import authorizationMiddleware from "../middlewares/authorization.middleware";
import {
  IdRequestParams,
  TaskIdRequestParams,
  UserIdRequestParams,
} from "../interfaces/requestParams.interface";
// User
import { getUserByIdController } from "../http/users/getUserById.http";
import { updateUserByIdController } from "../http/users/updateUserById.http";
import { deleteUserByIdController } from "../http/users/deleteUserById.http";
// Task
import { createTaskController } from "../http/tasks/createTask.http";
import { updateTaskByIdController } from "../http/tasks/updateTaskById.http";
import { deleteTaskByIdController } from "../http/tasks/deleteTaskById.http";
import { getAllTasksByUserIdController } from "../http/tasks/getAllTasksByUserId.http";

const userRoutes = Router();

// User
userRoutes.get<IdRequestParams>("/:id", authorizationMiddleware.authorizeUserByParam("id"), getUserByIdController);
userRoutes.put<IdRequestParams>("/:id", authorizationMiddleware.authorizeUserByParam("id"), updateUserByIdController);
userRoutes.delete<IdRequestParams>("/:id", authorizationMiddleware.authorizeUserByParam("id"), deleteUserByIdController);

// Tasks
userRoutes.post("/tasks", authorizationMiddleware.authorizeTaskBodyUser, createTaskController);
userRoutes.get<UserIdRequestParams>(
  "/:userId/tasks",
  authorizationMiddleware.authorizeUserByParam("userId"),
  getAllTasksByUserIdController
);
userRoutes.put<TaskIdRequestParams>(
  "/tasks/:taskId",
  authorizationMiddleware.authorizeTaskByParam("taskId"),
  authorizationMiddleware.authorizeTaskBodyUser,
  updateTaskByIdController
);
userRoutes.delete<IdRequestParams>(
  "/task/:id",
  authorizationMiddleware.authorizeTaskByParam("id"),
  deleteTaskByIdController
);

export default userRoutes;
