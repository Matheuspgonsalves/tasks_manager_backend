import { Response, CookieOptions } from "express";

const isProduction = process.env.NODE_ENV === "production";
const frontendUrl = process.env.FRONTEND_URL;

const cookieDomain = (() => {
    if (!isProduction || !frontendUrl) {
        return undefined;
    }

    try {
        const hostname = new URL(frontendUrl).hostname;
        return hostname || undefined;
    } catch {
        return undefined;
    }
})();

export const COOKIE_NAMES = {
    ACCESS_TOKEN: "accessToken",
};

export const COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
    ...(cookieDomain ? { domain: cookieDomain } : {}),
};

export const setAccessTokenCookie = (res: Response, token: string): void => {
    res.cookie(
        COOKIE_NAMES.ACCESS_TOKEN,
        token,
        COOKIE_OPTIONS
    );
};

export const clearAccessTokenCookie = (res: Response): void => {
    res.clearCookie(
        COOKIE_NAMES.ACCESS_TOKEN,
        {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: "/",
            ...(cookieDomain ? { domain: cookieDomain } : {}),
        }
    );
};
