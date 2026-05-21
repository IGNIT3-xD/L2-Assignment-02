import type { NextFunction, Request, Response } from "express";
import { createUserQuery } from "./users.service";
import { AppError } from "../../utils/appError";
import { sendResponse } from "../../utils/sendResponse";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password)
            throw new AppError("name, email and password fields are required", 400)

        const result = await createUserQuery(req.body)
        sendResponse(res, 201, true, "User created successfully", result)
    }
    catch (error) {
        next(error)
    }
}