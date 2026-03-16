import "dotenv/config"
import jwt from "jsonwebtoken";
import { AuthRequest, JwtPayload } from "../interfaces/AuthRequest.interface";
import { Response, NextFunction } from "express";
import { COOKIE_NAMES } from "../utils/cookies.util";
import {
    createRequestId,
    createTimer,
    logObservation,
} from "../utils/observability.util";

const MySecretWord: string | undefined = process.env.JWT_SECRET;

export const checkToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const requestId = createRequestId();
    const timer = createTimer();

    try {
        const cookieKeys = req.cookies ? Object.keys(req.cookies) : [];

        logObservation({ flow: "auth.middleware", requestId }, "request_received", {
            method: req.method,
            path: req.originalUrl,
            origin: req.headers.origin,
            referer: req.headers.referer,
            userAgent: req.headers["user-agent"],
            hasCookiesObject: Boolean(req.cookies),
            cookieKeys,
            hasAccessTokenCookie: Boolean(req.cookies?.[COOKIE_NAMES.ACCESS_TOKEN]),
            ...timer.checkpoint(),
        });

        let token: string | null = null;

        if (req.cookies && req.cookies[COOKIE_NAMES.ACCESS_TOKEN]) {
            token = req.cookies[COOKIE_NAMES.ACCESS_TOKEN];
        }

        if (!token) {
            logObservation({ flow: "auth.middleware", requestId }, "request_rejected", {
                reason: "cookie_absent",
                statusCode: 401,
                ...timer.checkpoint(),
            });
            res.status(401).json({
                success: false,
                message: "Authentication required. Please provide a valid token."
            });
            return;
        }

        if (!MySecretWord) {
            console.error("JWT_SECRET not configured");
            logObservation({ flow: "auth.middleware", requestId }, "request_failed", {
                reason: "jwt_secret_missing",
                statusCode: 500,
                ...timer.checkpoint(),
            });
            res.status(500).json({
                success: false,
                message: "Server configuration error"
            });
            return;
        }

        try {
            const decoded = jwt.verify(token, MySecretWord) as JwtPayload;

            req.user = decoded;
            logObservation({ flow: "auth.middleware", requestId }, "token_accepted", {
                userId: decoded.id,
                email: decoded.email,
                role: decoded.role,
                ...timer.checkpoint(),
            });
            next();
        } catch (error: any) {
            if (error.name === "TokenExpiredError") {
                logObservation({ flow: "auth.middleware", requestId }, "request_rejected", {
                    reason: "token_expired",
                    statusCode: 401,
                    error: error.message,
                    expiredAt: error.expiredAt,
                    ...timer.checkpoint(),
                });
                res.status(401).json({
                    success: false,
                    message: "Invalid token. Please login again."
                });
                return
            }

            logObservation({ flow: "auth.middleware", requestId }, "request_rejected", {
                reason: "token_invalid",
                statusCode: 401,
                error: error?.message,
                errorName: error?.name,
                ...timer.checkpoint(),
            });
            res.status(401).json({
                success: false,
                message: "Invalid token. Please login again."
            });
        }
    } catch (error) {
        const isProduction = process.env.NODE_ENV === "production";

        logObservation({ flow: "auth.middleware", requestId }, "unexpected_error", {
            statusCode: 500,
            error: error instanceof Error ? error.message : "Unknown error",
            ...timer.checkpoint(),
        });
        
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
