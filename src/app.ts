import express, { type Application, type Request, type Response } from 'express'
import { globalErrorHandler } from './middleware/globalErrorHandler';
import { userRoute } from './modules/users/users.route';
import { issueRoute } from './modules/issues/issues.route';
import cors from 'cors'

const app: Application = express()

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

app.use('/api/auth', userRoute)
app.use('/api/issues', issueRoute)

app.use(globalErrorHandler)
export default app;