import { Response } from "express"
import { clearAccessTokenCookie } from "../../utils/cookies.util";
import { AuthRequest } from "../../interfaces/AuthRequest.interface";

export const logoutController = async (req: AuthRequest, res: Response) => {
  try {
    clearAccessTokenCookie(res);

    return res.status(200).send({
        success: true,
        message: "Logged out successfully",
    });
  } catch (error: any) {
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
}
