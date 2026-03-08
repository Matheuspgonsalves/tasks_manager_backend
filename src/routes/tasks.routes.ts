import { Router } from "express";
import { createTaskController } from "../http/tasks/createTask.http";
import { getAllTasksByNameController } from "../http/tasks/getAllTasksByName.http";
import { getTaskByIdController } from "../http/tasks/getTaskById.http";
import { updateTaskByIdController } from "../http/tasks/updateTaskById.http";
import { deleteTaskByIdController } from "../http/tasks/deleteTaskById.http";

const tasksRoutes = Router();

tasksRoutes.post("/", createTaskController);
tasksRoutes.get("/", getAllTasksByNameController);
tasksRoutes.get("/:id", getTaskByIdController);
tasksRoutes.put("/:id", updateTaskByIdController);
tasksRoutes.delete("/:id", deleteTaskByIdController);

export default tasksRoutes;
