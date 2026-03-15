import { Response } from "express";

export const healthCheckerController = async (res: Response) => {
  return res.status(200).send({
    success: true,
    message: "Server running",
  });
}