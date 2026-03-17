import prisma from "../../../configs/database";

export const findCategoryById = async (id: string) => {
  if (!id || id.trim() === "") {
    return { error: "Category ID is required" };
  }

  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    return { error: "Category not found" };
  }

  return { category };
};
