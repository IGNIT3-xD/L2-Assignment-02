import type { NextFunction, Request, Response } from "express";
import { createIssueQuery, getAllIssuesQuery, getSingleIssueQuery } from "./issues.service";
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

export const getAllIssues = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { sort, type, status } = req.query

        const result = await getAllIssuesQuery(sort as string, type as string, status as string)
        sendResponse(res, 200, true, "", result)
    }
    catch (error) {
        next(error)
    }
}

export const getSingleIssue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id as string)
        const result = await getSingleIssueQuery(id)
        sendResponse(res, 200, true, "", result)
    }
    catch (error) {
        next(error)
    }
}