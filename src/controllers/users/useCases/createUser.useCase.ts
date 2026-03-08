import prisma from "../../../configs/database";
import { Users } from "../../../interfaces/users.interface";
import bcrypt from "bcrypt";

export const createUserUseCase = async (data: Users) => {
  const { name, email, password } = data;

  const existingUser = await prisma.user.findUnique({
    where: { email: email },
  });

  if (existingUser) {
    return { error: "Error: Email already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const { password: _, role: __, ...userWithoutPassword } = newUser;

  return { user: userWithoutPassword };
};
