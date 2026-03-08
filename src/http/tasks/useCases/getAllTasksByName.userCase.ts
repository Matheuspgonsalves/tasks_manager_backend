import prisma from "../../../configs/database";

export const findAllTasksByName = async (name: string) => {
  const getAlltasks = await prisma.tasks.findMany({
    where: {
      user: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!getAlltasks || getAlltasks.length === 0) {
    return { error: "No tasks found for the given user name" };
  }

  return { tasks: getAlltasks };
};
