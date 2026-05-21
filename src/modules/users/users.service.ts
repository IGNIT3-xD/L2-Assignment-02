import { config } from "../../config";
import type { User } from "../../types/user";
import { AppError } from "../../utils/appError";
import { pool } from './../../db/index';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const createUserQuery = async ({ name, email, password, role }: User) => {
    if (!name || !email || !password)
        throw new AppError("name, email and password fields are required", 400)

    const hashPassword = await bcrypt.hash(password, 10)

    const result = await pool.query(`
        INSERT INTO users(name, email, password, role)
        VALUES($1, $2, $3, COALESCE($4, 'contributor'))
        RETURNING id, name, email, role, created_at, updated_at
    `, [name, email, hashPassword, role])

    return result.rows[0]
}

export const loginUserQuery = async ({ email, password }: User) => {
    const user = await pool.query(`SELECT * FROM users WHERE email = $1`, [email])

    if (user.rowCount === 0)
        throw new AppError("User does not exist", 404)

    const userInfo = user.rows[0]
    const matchedPassword = await bcrypt.compare(password, userInfo.password)

    if (!matchedPassword)
        throw new AppError("Invalid Credentials", 401)

    const jwtPayload = {
        id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        role: userInfo.role
    }

    const token = jwt.sign(jwtPayload, config.JWT_ACCESS, { expiresIn: "1d" })
    const refreshToken = jwt.sign(jwtPayload, config.JWT_REFRESH, { expiresIn: "7d" })

    const { password: _, ...loggedInUser } = userInfo
    return {
        token: token,
        user: loggedInUser
    }
}