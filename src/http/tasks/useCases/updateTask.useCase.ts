import prisma from "../../../configs/database";
import { Tasks } from "../../../interfaces/tasks.interface";

export const updateTaskUseCase = async (data: Tasks, id: string) => {
  const { title, description, status, userId, categoryId } = data;
  const normalizedCategoryId = categoryId.trim();

  if (!id || id.trim() === "") {
    return { error: "Task ID required" };
  }

  const existingTask = await prisma.tasks.findUnique({ where: { id } });
  if (!existingTask) {
    return { error: "Task not found" };
  }

  const userExists = await prisma.profile.findUnique({ where: { id: userId } });
  if (!userExists) {
    return { error: "Associated user not found" };
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

  const updateData: any = {};

  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (status !== undefined) updateData.status = status;
  if (userId !== undefined) updateData.userId = userId;
  updateData.categoryId = normalizedCategoryId;

  const updateTask = await prisma.tasks.update({
    where: { id },
    data: updateData,
  });

  if (!updateTask?.id) {
    return { error: "Task updated failed" };
  }

  return { updated_task: updateTask };
};
