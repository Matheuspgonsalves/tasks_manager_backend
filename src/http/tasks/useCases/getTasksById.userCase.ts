import prisma from "../../../configs/database";

export const findTasksById = async (id: string) => {
  if (!id || id.trim() === "") {
    return { error: "Task ID required" };
  }

  const getTaskById = await prisma.tasks.findUnique({
    where: { id },
  });

  if (!getTaskById) {
    return { error: "Task not found" };
  }

  return { task: getTaskById };
};
