import prisma from "../../../configs/database";

export const deleteCategoryById = async (id: string, userId: string) => {
  if (!id || id.trim() === "") {
    return { error: "Category ID is required" };
  }

  if (!userId || userId.trim() === "") {
    return { error: "User ID is required" };
  }

  const existingCategory = await prisma.category.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    return { error: "Category not found" };
  }

  if (existingCategory.isDefault) {
    const hiddenCategory = await prisma.hiddenCategory.upsert({
      where: {
        userId_categoryId: {
          userId,
          categoryId: id,
        },
      },
      update: {},
      create: {
        userId,
        categoryId: id,
      },
    });

    if (!hiddenCategory?.id) {
      return { error: "Category deletion failed" };
    }

    return { category: existingCategory };
  }

  if (existingCategory.ownerUserId !== userId) {
    return { error: "Category not found" };
  }

  const category = await prisma.category.delete({
    where: { id },
  });

  if (!category?.id) {
    return { error: "Category deletion failed" };
  }

  return { category };
};
