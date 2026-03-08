import prisma from "../../../configs/database";
import { Tasks } from "../../../interfaces/tasks.interface";

export const updateTaskUseCase = async (data: Tasks, id: string) => {
  const { title, description, status, userId } = data;

  if (!id || id.trim() === "") {
    return { error: "Task ID required" };
  }

  const existingTask = await prisma.tasks.findUnique({ where: { id } });
  if (!existingTask) {
    return { error: "Task not found" };
  }

  const userExists = await prisma.user.findUnique({ where: { id: userId } });
  if (!userExists) {
    return { error: "Associated user not found" };
  }

  const updateData: any = {};

  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (status !== undefined) updateData.status = status;
  if (userId !== undefined) updateData.userId = userId;

  const updateTask = await prisma.tasks.update({
    where: { id },
    data: updateData,
  });

  if (!updateTask?.id) {
    return { error: "Task updated failed" };
  }

  return { updated_task: updateTask };
};
