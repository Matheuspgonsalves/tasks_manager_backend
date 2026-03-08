import "dotenv/config"
import jwt from "jsonwebtoken";
import { AuthRequest, JwtPayload } from "../interfaces/AuthRequest.interface";
import { Response, NextFunction } from "express";

const MySecretWord: string = process.env.JWT_SECRET || "";

export const checkToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        let token: string | undefined = req.headers["x-access-token"] as string || req.headers["authorization"] as string;

        if (token && token.startsWith("Bearer ")) {
            token = token.slice(7, token.length);
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
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error ocurred. Please try again later."
        });
        return;
    }
};

export default {
    MySecretWord,
    checkToken,
};
