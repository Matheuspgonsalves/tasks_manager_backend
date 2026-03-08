import { TaskStatus } from "@prisma/client";
import prisma from "../../../configs/database";
import { Tasks } from "../../../interfaces/tasks.interface";
import { error } from "console";

export const createTaskUseCase = async (data: Tasks) => {
  const { title, description, status, userId } = data;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return { error: "User not found" };
  }

  const existingTask = await prisma.tasks.findFirst({
    where: { title, userId },
  });

  if (existingTask) {
    return { error: "Task with same title already existis" };
  }

  const newTask = await prisma.tasks.create({
    data: {
      title,
      description,
      status: status as TaskStatus,
      userId,
    },
  });

  if (!newTask.id) {
    return { error: "Create task failed " };
  }

  return { task: newTask };
};
