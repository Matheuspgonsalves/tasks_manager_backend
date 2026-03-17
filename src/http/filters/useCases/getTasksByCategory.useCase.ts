import prisma from "../../../configs/database";

export const getTasksByCategoryUseCase = async (
  userId: string,
  categoryId: string
) => {
  if (!userId || userId.trim() === "") {
    return { error: "User ID required" };
  }

  if (!categoryId || categoryId.trim() === "") {
    return { error: "Category ID is required" };
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
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

  const tasks = await prisma.tasks.findMany({
    where: {
      userId,
      categoryId,
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
