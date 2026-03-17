import { TaskStatus } from "@prisma/client";
import prisma from "../../../configs/database";

export const getTasksByStatusUseCase = async (
  userId: string,
  status: TaskStatus
) => {
  if (!userId || userId.trim() === "") {
    return { error: "User ID required" };
  }

  const tasks = await prisma.tasks.findMany({
    where: {
      userId,
      status,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { tasks };
};
