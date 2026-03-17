import prisma from "../../../configs/database";
import { Categories } from "../../../interfaces/categories.interface";

export const updateCategoryUseCase = async (data: Categories, id: string) => {
  const { name, userId } = data;

  if (!id || id.trim() === "") {
    return { error: "Category ID is required" };
  }

  const existingCategory = await prisma.category.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    return { error: "Category not found" };
  }

  if (existingCategory.isDefault) {
    return { error: "Default categories cannot be updated" };
  }

  if (existingCategory.ownerUserId !== userId) {
    return { error: "Category not found" };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return { error: "User not found" };
  }

  const duplicateCategory = await prisma.category.findFirst({
    where: {
      name,
      OR: [
        { isDefault: true },
        { ownerUserId: userId },
      ],
      NOT: {
        id,
      },
    },
  });

  if (duplicateCategory) {
    return { error: "Category with same name already exists" };
  }

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: {
      name,
      ownerUserId: userId,
    },
  });

  return { updated_category: updatedCategory };
};
