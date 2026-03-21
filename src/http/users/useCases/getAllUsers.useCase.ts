import prisma from "../../../configs/database";

export const findAllUsers = async () => {
  const getAllUsers = await prisma.profile.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return { users: getAllUsers };
};
