import { Pool } from "pg";
import { config } from "../config";

export const pool = new Pool({
    connectionString: config.DB
})

export const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role VARCHAR(20) NOT NULL DEFAULT 'contributor',
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `)

        console.log("DB connected successfully !!!");
    } catch (error: any) {
        console.error("DB connection failed", error.message)
    }
}