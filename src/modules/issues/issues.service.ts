import { pool } from "../../db";
import type { Issue } from "../../types/issue";
import { AppError } from "../../utils/appError";

export const createIssueQuery = async ({ title, description, type, reporter_id }: Issue) => {
    if (!title || !description || !type)
        throw new AppError("Issue title, description and type is required", 400);

    if (description.length < 20)
        throw new AppError("Description must be at least 20 characters long", 400);

    if (title.length > 150)
        throw new AppError("Title must be less than 150 characters long", 400);

    const result = await pool.query(`
        INSERT INTO issues (title, description, type, reporter_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `, [title, description, type, reporter_id])

    return result.rows[0];
}