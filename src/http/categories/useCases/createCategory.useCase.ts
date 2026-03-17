import prisma from "../../../configs/database";
import { Categories } from "../../../interfaces/categories.interface";

export const createCategoryUseCase = async (data: Categories) => {
  const { name, userId } = data;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return { error: "User not found" };
  }

  const existingCategory = await prisma.category.findFirst({
    where: {
      name,
      OR: [
        { isDefault: true },
        { ownerUserId: userId },
      ],
    },
  });

  if (existingCategory) {
    return { error: "Category with same name already exists" };
  }

  const category = await prisma.category.create({
    data: {
      name,
      ownerUserId: userId,
      isDefault: false,
    },
  });

  return { category };
};
