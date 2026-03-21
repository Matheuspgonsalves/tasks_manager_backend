import { Request } from "express";
import { ParamsDictionary, Query } from "express-serve-static-core";

export interface AuthRequest<
    P = ParamsDictionary,
    ResBody = any,
    ReqBody = any,
    ReqQuery = Query
> extends Request<P, ResBody, ReqBody, ReqQuery> {
    user?: {
        id: string;
        email?: string;
        role: "user" | "admin";
    }
}

export interface JwtPayload {
    id: string;
    email?: string;
    role: "user" | "admin";
}
