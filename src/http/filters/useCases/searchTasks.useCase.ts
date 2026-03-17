import prisma from "../../../configs/database";

export const searchTasksUseCase = async (
  userId: string,
  search: string
) => {
  if (!userId || userId.trim() === "") {
    return { error: "User ID required" };
  }

  if (!search || search.trim() === "") {
    return { error: "Search term is required" };
  }

  const normalizedSearch = search.trim();

  const tasks = await prisma.tasks.findMany({
    where: {
      userId,
      OR: [
        {
          title: {
            contains: normalizedSearch,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: normalizedSearch,
            mode: "insensitive",
          },
        },
        {
          category: {
            name: {
              contains: normalizedSearch,
              mode: "insensitive",
            },
          },
        },
      ],
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
