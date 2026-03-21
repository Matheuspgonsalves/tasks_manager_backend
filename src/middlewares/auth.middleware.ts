import "dotenv/config"
import { AuthRequest } from "../interfaces/AuthRequest.interface";
import { Response, NextFunction } from "express";
import {
    createRequestId,
    createTimer,
    logObservation,
} from "../utils/observability.util";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

interface SupabaseUser {
    id: string;
    email?: string;
    app_metadata?: {
        role?: string;
    };
}

const getBearerToken = (authorizationHeader?: string): string | null => {
    if (!authorizationHeader?.startsWith("Bearer ")) {
        return null;
    }

    const token = authorizationHeader.slice("Bearer ".length).trim();
    return token || null;
};

const getSupabaseUser = async (token: string): Promise<SupabaseUser | null> => {
    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Supabase authentication environment variables are not configured");
    }

    const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
        method: "GET",
        headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        return null;
    }

    return response.json() as Promise<SupabaseUser>;
};

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
            hasAuthorizationHeader: Boolean(req.headers.authorization),
            ...timer.checkpoint(),
        });

        const token = getBearerToken(req.headers.authorization);

        if (!token) {
            logObservation({ flow: "auth.middleware", requestId }, "request_rejected", {
                reason: "authorization_header_absent",
                statusCode: 401,
                ...timer.checkpoint(),
            });
            res.status(401).json({
                success: false,
                message: "Authentication required. Please provide a valid Supabase bearer token."
            });
            return;
        }

        if (!supabaseUrl || !supabaseAnonKey) {
            logObservation({ flow: "auth.middleware", requestId }, "request_failed", {
                reason: "supabase_env_missing",
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
            const supabaseUser = await getSupabaseUser(token);

            if (!supabaseUser?.id) {
                logObservation({ flow: "auth.middleware", requestId }, "request_rejected", {
                    reason: "token_invalid",
                    statusCode: 401,
                    ...timer.checkpoint(),
                });
                res.status(401).json({
                    success: false,
                    message: "Invalid token. Please login again."
                });
                return;
            }

            const role = supabaseUser.app_metadata?.role === "admin"
                    ? "admin"
                    : "user";

            req.user = {
                id: supabaseUser.id,
                email: supabaseUser.email,
                role,
            };
            logObservation({ flow: "auth.middleware", requestId }, "token_accepted", {
                userId: req.user.id,
                email: req.user.email,
                role: req.user.role,
                ...timer.checkpoint(),
            });
            next();
        } catch (error: any) {
            logObservation({ flow: "auth.middleware", requestId }, "request_rejected", {
                reason: "token_invalid",
                statusCode: 401,
                error: error?.message,
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
