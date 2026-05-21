import type { User } from "../../types/user";
import { pool } from './../../db/index';
import bcrypt from 'bcrypt';

export const createUserQuery = async ({ name, email, password, role }: User) => {
    const hashPassword = await bcrypt.hash(password, 10)

    const result = await pool.query(`
        INSERT INTO users(name, email, password, role)
        VALUES($1, $2, $3, COALESCE($4, 'contributor'))
        RETURNING id, name, email, role, created_at, updated_at
    `, [name, email, hashPassword, role])

    return result.rows[0]
}