import { Router } from "express";
import authorizationMiddleware from "../middlewares/authorization.middleware";
import {
  CategoryIdRequestParams,
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
// Category
import { createCategoryController } from "../http/categories/createCategory.http";
import { getAllCategoriesByUserIdController } from "../http/categories/getAllCategoriesByUserId.http";
import { getCategoryByIdController } from "../http/categories/getCategoryById.http";
import { updateCategoryByIdController } from "../http/categories/updateCategoryById.http";
import { deleteCategoryByIdController } from "../http/categories/deleteCategoryById.http";

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

// Categories
userRoutes.post(
  "/categories",
  authorizationMiddleware.authorizeCategoryBodyUser,
  createCategoryController
);
userRoutes.get<UserIdRequestParams>(
  "/:userId/categories",
  authorizationMiddleware.authorizeUserByParam("userId"),
  getAllCategoriesByUserIdController
);
userRoutes.get<CategoryIdRequestParams>(
  "/categories/:categoryId",
  authorizationMiddleware.authorizeCategoryByParam("categoryId"),
  getCategoryByIdController
);
userRoutes.put<CategoryIdRequestParams>(
  "/categories/:categoryId",
  authorizationMiddleware.authorizeCategoryByParam("categoryId"),
  authorizationMiddleware.authorizeCategoryBodyUser,
  updateCategoryByIdController
);
userRoutes.delete<CategoryIdRequestParams>(
  "/categories/:categoryId",
  authorizationMiddleware.authorizeCategoryByParam("categoryId"),
  deleteCategoryByIdController
);

export default userRoutes;
