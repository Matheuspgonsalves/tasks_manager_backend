import { Router } from "express";
import { getAllUsersController } from "../http/users/getAllUsers.http";
import { getUserByIdController } from "../http/users/getUserById.http";
import { updateUserByIdController } from "../http/users/updateUserById.http";
import { deleteUserByIdController } from "../http/users/deleteUserById.http";
import { createUserController } from "../http/users/createUser.http";

const userRoutes = Router();

userRoutes.post("/", createUserController);
userRoutes.get("/", getAllUsersController);
userRoutes.get("/:id", getUserByIdController);
userRoutes.put("/:id", updateUserByIdController);
userRoutes.delete("/:id", deleteUserByIdController);

export default userRoutes;
