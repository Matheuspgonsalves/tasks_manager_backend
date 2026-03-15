import { Response, CookieOptions } from "express";

const isProduction = process.env.NODE_ENV === "production";

export const COOKIE_NAMES = {
    ACCESS_TOKEN: "accessToken",
};

export const COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
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
            sameSite: isProduction ? "none" : "lax",
            path: "/"
        }
    );
};
