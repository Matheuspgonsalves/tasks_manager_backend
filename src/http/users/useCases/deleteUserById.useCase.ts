import prisma from "../../../configs/database";

export const deleteUserById = async (id: string) => {
  
  if (!id || id.trim() === "") {
    return { error: "User ID is required" };
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return { error: "User not found" };
  }

  const userDelete = await prisma.user.delete({ where: { id } });

  if (!userDelete?.id) {
    return { error: "User deletion failed" };
  }

  return {user: userDelete};
};
