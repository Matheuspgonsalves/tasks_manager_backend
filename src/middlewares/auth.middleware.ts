import "dotenv/config"
import jwt from "jsonwebtoken";
import { AuthRequest, JwtPayload } from "../interfaces/AuthRequest.interface";
import { Response, NextFunction } from "express";
import { COOKIE_NAMES } from "../utils/cookies.util";

const MySecretWord: string | undefined = process.env.JWT_SECRET;

export const checkToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        let token: string | null = null;

        if (req.cookies && req.cookies[COOKIE_NAMES.ACCESS_TOKEN]) {
            token = req.cookies[COOKIE_NAMES.ACCESS_TOKEN];
        }

        if (!token) {
            res.status(401).json({
                success: false,
                message: "Authentication required. Please provide a valid token."
            });
            return;
        }

        if (!MySecretWord) {
            console.error("JWT_SECRET not configured");
            res.status(500).json({
                success: false,
                message: "Server configuration error"
            });
            return;
        }

        try {
            const decoded = jwt.verify(token, MySecretWord) as JwtPayload;

            req.user = decoded;
            next();
        } catch (error: any) {
            if (error.name === "TokenExpiredError") {
                res.status(401).json({
                    success: false,
                    message: "Invalid token. Please login again."
                });
                return
            }

            res.status(401).json({
                success: false,
                message: "Invalid token. Please login again."
            });
        }
    } catch (error) {
        const isProduction = process.env.NODE_ENV === "production";
        
        if (!isProduction) {
        console.error("Authentication error:", error);
        }

        res.status(500).json({
            success: false,
            message: "An error ocurred. Please try again later."
        });
        return;
    }
};

export default {
    checkToken,
};
