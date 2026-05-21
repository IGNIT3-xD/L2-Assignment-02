import type { NextFunction, Request, Response } from "express";
import { createUserQuery, loginUserQuery } from "./users.service";
import { sendResponse } from "../../utils/sendResponse";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await createUserQuery(req.body)
        sendResponse(res, 201, true, "User created successfully", result)
    }
    catch (error) {
        next(error)
    }
}

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await loginUserQuery(req.body)
        sendResponse(res, 200, true, "Login successful", user)
    }
    catch (error) {
        next(error)
    }
}