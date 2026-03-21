import prisma from "../../../configs/database";

export const findUserById = async (id: string) => {
  if (!id || id.trim() === "") {
    return { error: "User ID is required" };
  }

  const findUser = await prisma.profile.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  if (!findUser) {
    return { error: "User not found" };
  }

  return { user: findUser };
};
