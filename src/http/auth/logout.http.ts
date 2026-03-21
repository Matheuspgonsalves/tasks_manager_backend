import { Response } from "express";
import { AuthRequest } from "../../interfaces/AuthRequest.interface";

export const logoutController = async (req: AuthRequest, res: Response) => {
  try {
    return res.status(200).send({
        success: true,
        message: "Local logout is unnecessary. Sign out through Supabase Auth on the frontend.",
    });
  } catch (error: any) {
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};
