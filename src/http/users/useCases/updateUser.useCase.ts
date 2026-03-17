import prisma from "../../../configs/database";
import { Users } from "../../../interfaces/users.interface";
import bcrypt from "bcrypt";

export const updateUserUseCase = async (data: Users, id: string) => {
  const { name, email, password } = data;

  if (!id || id.trim() === "") {
    return { error: "User ID is required" };
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return { error: "User not found" };
  }

  if (email) {
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail && existingEmail.id !== id) {
      return { error: "Email already in use by another user" };
    }
  }

  const updateData: any = {};

  if (name !== undefined) updateData.name = name;
  if (email !== undefined) updateData.email = email;
  if (password !== undefined) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  const updateUser = await prisma.user.update({
    where: { id },
    data: updateData,
  });

  if (!updateUser?.id) {
    return { error: "User updated failed" };
  }

  const { password: _, ...updatedUserWithoutPassword } = updateUser;

  return { updated_user: updatedUserWithoutPassword };
};
