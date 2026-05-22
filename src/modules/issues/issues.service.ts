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


const ALLOWED_SORT = ['newest', 'oldest']
const ALLOWED_TYPE = ['bug', 'feature_request']
const ALLOWED_STATUS = ['open', 'in_progress', 'resolved']

export const getAllIssuesQuery = async (
    sort: string = "newest",
    type?: string,
    status?: string
) => {
    if (!ALLOWED_SORT.includes(sort))
        throw new AppError('Invalid sort value', 400)

    if (type && !ALLOWED_TYPE.includes(type))
        throw new AppError('Invalid type value', 400)

    if (status && !ALLOWED_STATUS.includes(status))
        throw new AppError('Invalid status value', 400)

    const order = sort === 'newest' ? 'DESC' : 'ASC'

    const result = await pool.query(`
        SELECT * FROM issues
        WHERE ($1::text IS NULL OR type = $1)
          AND ($2::text IS NULL OR status = $2)
        ORDER BY created_at ${order}
    `, [type ?? null, status ?? null])


    // const result = await pool.query(`SELECT * FROM issues`);

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

export const getSingleIssueQuery = async (id: number) => {
    const result = await pool.query(`SELECT * FROM issues WHERE id = $1`, [id])
    if (result.rowCount === 0)
        throw new AppError('Issue not found', 404)

    const { reporter_id, ...issue } = result.rows[0];

    const reporterData = await pool.query(`SELECT id, name, role FROM users WHERE id = $1`, [reporter_id])

    return {
        ...issue,
        reporter: reporterData.rows[0]
    }
}

export const updateIssueQuery = async ({ id, title, description, type, status }: Issue) => {

    const result = await pool.query(`
        UPDATE issues SET
            title = COALESCE($1, title), 
            description = COALESCE($2, description),
            type = COALESCE($3, type),
            status = COALESCE($4, 'in_progress'),
            updated_at = NOW()
        WHERE id = $5 
        RETURNING *
    `, [title, description, type, status, id])

    if (result.rowCount === 0)
        throw new AppError('No issue found', 404)

    return result.rows[0]
}

export const deleteIssueQuery = async (id: number) => {
    const issue = await pool.query(`SELECT * FROM issues WHERE id=$1`, [id])
    if (issue.rowCount === 0)
        throw new AppError("Issue not found", 404)

    const result = await pool.query(`DELETE FROM issues WHERE id=$1`, [id])
    return result
}