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

export const getAllIssuesQuery = async () => {
    const result = await pool.query(`SELECT * FROM issues`);

    const reporters_ids = result.rows.map(issue => issue.reporter_id);
    // console.log(reporters_ids);

    const reporterData = await pool.query(`SELECT id, name, role FROM users WHERE id = ANY($1)`, [reporters_ids]);
    // console.log(reporterData.rows);

    const reporterMap = new Map(reporterData.rows.map(user => [user.id, user]))
    // console.log(reporterMap);

    const issues = result.rows.map(({ reporter_id, ...issue }) => ({
        ...issue,
        reporter: reporterMap.get(reporter_id)
    }))

    return issues
}