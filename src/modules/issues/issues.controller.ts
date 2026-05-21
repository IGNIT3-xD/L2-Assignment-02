import type { NextFunction, Request, Response } from "express";
import { createIssueQuery } from "./issues.service";
import { sendResponse } from "../../utils/sendResponse";

export const createIssue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reporter_id = req.user?.id

        const result = await createIssueQuery({ ...req.body, reporter_id })
        sendResponse(res, 201, true, "Issue created successfully", result)
    }
    catch (error) {
        next(error)
    }
}