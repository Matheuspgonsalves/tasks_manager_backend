import { Router } from "express";
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
userRoutes.get("/:id", getUserByIdController);
userRoutes.put("/:id", updateUserByIdController);
userRoutes.delete("/:id", deleteUserByIdController);

// Tasks
userRoutes.post("/tasks", createTaskController);
userRoutes.get("/:userId/tasks", getAllTasksByUserIdController);
userRoutes.put("/tasks/:taskId", updateTaskByIdController);
userRoutes.delete("/task/:id", deleteTaskByIdController);

export default userRoutes;
