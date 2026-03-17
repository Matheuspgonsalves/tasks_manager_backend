import { TaskStatus } from "@prisma/client";

export interface GetTasksByStatusQuery {
  status?: TaskStatus;
}

export interface GetTasksByCategoryQuery {
  categoryId?: string;
}

export interface SearchTasksQuery {
  search?: string;
}
