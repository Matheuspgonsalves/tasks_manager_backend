import { ParamsDictionary } from "express-serve-static-core";

export interface IdRequestParams extends ParamsDictionary {
  id: string;
}

export interface UserIdRequestParams extends ParamsDictionary {
  userId: string;
}

export interface TaskIdRequestParams extends ParamsDictionary {
  taskId: string;
}
