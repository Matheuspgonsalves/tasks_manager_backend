import { TaskStatus } from "@prisma/client";

export interface Tasks {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  userId: string;
  categoryId: string;
}
