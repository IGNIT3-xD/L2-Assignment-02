import type { NextFunction, Request, Response } from "express";
import { createIssueQuery, getAllIssuesQuery, getSingleIssueQuery, updateIssueQuery } from "./issues.service";
import { sendResponse } from "../../utils/sendResponse";
import { pool } from "../../db";
import { AppError } from "../../utils/appError";

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

export const updateIssue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id as string)
        // console.log({ ...req.body, id });

        const role = req.user?.role
        const user_id = req.user?.id

        if (role === 'contributor') {
            const issue = await pool.query(`SELECT * FROM issues WHERE id=$1`, [id])
            // console.log(issue.rows[0]);

            if (issue.rowCount === 0)
                throw new AppError("Issue not found", 404)

            if (issue.rows[0].reporter_id !== user_id)
                throw new AppError("Unauthorized", 403)

            if (issue.rows[0].status !== "open")
                throw new AppError("You can only update open issues", 403)

        }

        const result = await updateIssueQuery({ ...req.body, id })
        sendResponse(res, 200, true, "Issue updated successfully", result)
    }
    catch (error) {
        next(error)
    }
}