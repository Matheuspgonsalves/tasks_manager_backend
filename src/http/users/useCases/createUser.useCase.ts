import prisma from "../../../configs/database";
import { Users } from "../../../interfaces/users.interface";

export const createUserUseCase = async (data: Users) => {
  const { id, name, email } = data;

  if (!id) {
    return { error: "User ID is required" };
  }

  const existingUser = await prisma.profile.findFirst({ where: { email } });

  if (existingUser && existingUser.id !== id) {
    return { error: "Error: Email already exists" };
  }

  const newUser = await prisma.profile.upsert({
    where: { id },
    create: {
      id,
      name,
      email,
      role: data.role ?? "user",
    },
    update: {
      name,
      email,
    },
  });

  return { user: newUser };
};
