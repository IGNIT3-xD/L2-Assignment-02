import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
import { config } from "../config";
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { pool } from "../db";

export const authenticate = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization

            if (!token)
                throw new AppError("Unauthorized access", 401);

            const decodedToken = jwt.verify(token, config.JWT_ACCESS) as JwtPayload

            if (!roles.length || !roles.includes(decodedToken.role))
                throw new AppError("Unauthorized access", 403)

            req.user = decodedToken;

            next()
        }
        catch (error) {
            next(error);
        }
    }
}