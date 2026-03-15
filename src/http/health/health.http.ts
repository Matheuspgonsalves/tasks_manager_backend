import { Request, Response } from "express";

export const healthCheckerController = async (_req: Request, res: Response) => {
  return res.status(200).send({
    success: true,
    message: "Server running",
  });
}