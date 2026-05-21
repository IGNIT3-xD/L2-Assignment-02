import dotenv from 'dotenv'
import path from 'node:path'

dotenv.config({
    path: path.join(process.cwd(), '.env'),
    quiet: true
})

export const config = {
    PORT: process.env.PORT as number | undefined,
    DB: process.env.DB as string,
    NODE_ENV: process.env.NODE_ENV as string
}