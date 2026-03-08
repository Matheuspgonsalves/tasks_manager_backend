import prisma from "../../../configs/database";

export const deleteTaskById = async (id: string) => {
  if (!id || id.trim() === "") {
    return { error: "Task ID is required" };
  }

  const existingTask = await prisma.tasks.findUnique({
    where: { id },
  });

  if (!existingTask) {
    return { error: "Task not found" };
  }

  const deletedTask = await prisma.tasks.delete({
    where: { id },
  });

  if (!deletedTask?.id) {
    return { error: "Task deletion failed" };
  }

  return { task: deletedTask };
};
