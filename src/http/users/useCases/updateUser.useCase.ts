import prisma from "../../../configs/database";
import { Users } from "../../../interfaces/users.interface";

export const updateUserUseCase = async (data: Users, id: string) => {
  const { name, email } = data;

  if (!id || id.trim() === "") {
    return { error: "User ID is required" };
  }

  const user = await prisma.profile.findUnique({ where: { id } });
  if (!user) {
    return { error: "User not found" };
  }

  if (email) {
    const existingEmail = await prisma.profile.findUnique({ where: { email } });
    if (existingEmail && existingEmail.id !== id) {
      return { error: "Email already in use by another user" };
    }
  }

  const updateData: any = {};

  if (name !== undefined) updateData.name = name;
  if (email !== undefined) updateData.email = email;

  const updateUser = await prisma.profile.update({
    where: { id },
    data: updateData,
  });

  if (!updateUser?.id) {
    return { error: "User updated failed" };
  }

  return { updated_user: updateUser };
};
