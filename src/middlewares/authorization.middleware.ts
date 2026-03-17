import { Response, NextFunction } from "express";
import prisma from "../configs/database";
import { AuthRequest } from "../interfaces/AuthRequest.interface";

const normalizeParamValue = (value: string | string[] | undefined): string | undefined => {
    if (Array.isArray(value)) {
        return value[0];
    }

    return value;
};

const authorizeBodyUserId = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authenticatedUserId = req.user?.id;
    const requestedUserId = req.body?.userId;

    if (!authenticatedUserId) {
        res.status(401).json({
            success: false,
            message: "Authentication required. Please provide a valid token."
        });
        return;
    }

    if (!requestedUserId) {
        res.status(400).json({
            success: false,
            message: "User ID is required."
        });
        return;
    }

    if (authenticatedUserId !== requestedUserId) {
        res.status(403).json({
            success: false,
            message: "You are not allowed to manipulate another user's data."
        });
        return;
    }

    next();
};

export const authorizeUserByParam = (paramName: "id" | "userId" = "id") => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        const authenticatedUserId = req.user?.id;
        const requestedUserId = normalizeParamValue(req.params[paramName]);

        if (!authenticatedUserId) {
            res.status(401).json({
                success: false,
                message: "Authentication required. Please provide a valid token."
            });
            return;
        }

        if (!requestedUserId) {
            res.status(400).json({
                success: false,
                message: "User ID is required."
            });
            return;
        }

        if (authenticatedUserId !== requestedUserId) {
            res.status(403).json({
                success: false,
                message: "You are not allowed to access another user's data."
            });
            return;
        }

        next();
    };
};

export const authorizeTaskBodyUser = authorizeBodyUserId;

export const authorizeCategoryBodyUser = authorizeBodyUserId;

export const authorizeTaskByParam = (paramName: "id" | "taskId" = "taskId") => {
    return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        const authenticatedUserId = req.user?.id;
        const taskId = normalizeParamValue(req.params[paramName]);

        if (!authenticatedUserId) {
            res.status(401).json({
                success: false,
                message: "Authentication required. Please provide a valid token."
            });
            return;
        }

        if (!taskId) {
            res.status(400).json({
                success: false,
                message: "Task ID is required."
            });
            return;
        }

        const task = await prisma.tasks.findUnique({
            where: { id: taskId },
            select: { id: true, userId: true },
        });

        if (!task) {
            res.status(404).json({
                success: false,
                message: "Task not found"
            });
            return;
        }

        if (task.userId !== authenticatedUserId) {
            res.status(403).json({
                success: false,
                message: "You are not allowed to access another user's task."
            });
            return;
        }

        next();
    };
};

export const authorizeCategoryByParam = (paramName: "id" | "categoryId" = "categoryId") => {
    return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        const authenticatedUserId = req.user?.id;
        const categoryId = normalizeParamValue(req.params[paramName]);

        if (!authenticatedUserId) {
            res.status(401).json({
                success: false,
                message: "Authentication required. Please provide a valid token."
            });
            return;
        }

        if (!categoryId) {
            res.status(400).json({
                success: false,
                message: "Category ID is required."
            });
            return;
        }

        const category = await prisma.category.findUnique({
            where: { id: categoryId },
            select: {
                id: true,
                isDefault: true,
                ownerUserId: true,
                hiddenByUsers: {
                    where: {
                        userId: authenticatedUserId,
                    },
                    select: {
                        id: true,
                    },
                },
            },
        });

        if (!category) {
            res.status(404).json({
                success: false,
                message: "Category not found"
            });
            return;
        }

        const categoryIsAccessible =
            category.isDefault
                ? category.hiddenByUsers.length === 0
                : category.ownerUserId === authenticatedUserId;

        if (!categoryIsAccessible) {
            res.status(403).json({
                success: false,
                message: "You are not allowed to access another user's category."
            });
            return;
        }

        next();
    };
};

export default {
    authorizeUserByParam,
    authorizeTaskBodyUser,
    authorizeCategoryBodyUser,
    authorizeTaskByParam,
    authorizeCategoryByParam,
};
