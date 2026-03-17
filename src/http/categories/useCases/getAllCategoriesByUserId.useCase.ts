import prisma from "../../../configs/database";

export const findAllCategoriesByUserId = async (userId: string) => {
  if (!userId || userId.trim() === "") {
    return { error: "User ID required" };
  }

  const categories = await prisma.category.findMany({
    where: {
      OR: [
        {
          isDefault: true,
          hiddenByUsers: {
            none: {
              userId,
            },
          },
        },
        {
          ownerUserId: userId,
        },
      ],
    },
    orderBy: [{ isDefault: "desc" }, { name: "asc" }],
  });

  return { categories };
};
