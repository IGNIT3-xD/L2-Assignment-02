import type { NextFunction, Request, Response } from "express";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.statusCode || 500).json({ 
        success: false,
        message: err instanceof Error ? err.message : "Something went wrong",
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    })
}