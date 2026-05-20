import dotenv from 'dotenv'
import path from 'node:path'

dotenv.config({
    path: path.join(process.cwd(), '.env'),
    quiet: true
})

export const config = {
    PORT: process.env.PORT,
    DB: process.env.DB
}