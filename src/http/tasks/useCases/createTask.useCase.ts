import { TaskStatus } from "@prisma/client";
import prisma from "../../../configs/database";
import { Tasks } from "../../../interfaces/tasks.interface";

export const createTaskUseCase = async (data: Tasks) => {
  const { title, description, status, userId, categoryId } = data;
  const normalizedCategoryId = categoryId.trim();

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

  const category = await prisma.category.findUnique({
    where: { id: normalizedCategoryId },
    include: {
      hiddenByUsers: {
        where: {
          userId,
        },
      },
    },
  });

  const categoryIsAccessible =
    category !== null &&
    (
      category.isDefault
        ? category.hiddenByUsers.length === 0
        : category.ownerUserId === userId
    );

  if (!categoryIsAccessible) {
    return { error: "Category not found for this user" };
  }

  const newTask = await prisma.tasks.create({
    data: {
      title,
      description,
      status: status as TaskStatus,
      userId,
      categoryId: normalizedCategoryId,
    },
  });

  if (!newTask.id) {
    return { error: "Create task failed " };
  }

  return { task: newTask };
};
