import prisma from "../../../configs/database";

export const findAllUsers = async () => {
  const getAllUsers = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  return { users: getAllUsers };
};
